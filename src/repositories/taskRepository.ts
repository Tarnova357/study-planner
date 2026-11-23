import { getAuthToken, httpClient } from '../api/httpClient';
import type { ApiTodo, PaginatedTasks, TodosResponse } from '../types/api';
import type { Priority, Task, TaskClientMetadata, TaskInput } from '../types/task';

const DEFAULT_USER_ID = 1;
const CLIENT_METADATA_STORAGE_KEY = 'study-planner-task-metadata';
const CLIENT_CREATED_TASKS_STORAGE_KEY = 'study-planner-created-tasks';
const FALLBACK_PRIORITIES: Priority[] = ['low', 'medium', 'high'];

type StoredTaskMetadata = Partial<TaskInput> & Partial<Pick<TaskClientMetadata, 'createdBy' | 'createdAt'>>;

function readClientMetadataMap(): Record<number, StoredTaskMetadata> {
    try {
        const raw = window.localStorage.getItem(CLIENT_METADATA_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Record<number, StoredTaskMetadata>) : {};
    } catch {
        return {};
    }
}

function writeClientMetadata(id: number, metadata: StoredTaskMetadata): void {
    try {
        const current = readClientMetadataMap();
        current[id] = {
            ...current[id],
            ...metadata,
        };
        window.localStorage.setItem(CLIENT_METADATA_STORAGE_KEY, JSON.stringify(current));
    } catch {
        return;
    }
}

function removeClientMetadata(id: number): void {
    try {
        const current = readClientMetadataMap();
        delete current[id];
        window.localStorage.setItem(CLIENT_METADATA_STORAGE_KEY, JSON.stringify(current));
    } catch {
        return;
    }
}

function readCreatedTasks(): Task[] {
    try {
        const raw = window.localStorage.getItem(CLIENT_CREATED_TASKS_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch {
        return [];
    }
}

function writeCreatedTasks(tasks: Task[]): void {
    try {
        window.localStorage.setItem(CLIENT_CREATED_TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch {
        return;
    }
}

function ensureAuthenticated(): void {
    if (!getAuthToken()) {
        throw new Error('Необхідна авторизація для виконання цієї дії');
    }
}

function buildFallbackCreatedAt(id: number): string {
    const baseTimestamp = Date.UTC(2026, 10, 1, 9, 0, 0);
    return new Date(baseTimestamp + id * 3600 * 1000).toISOString();
}

function buildFallbackPriority(id: number): Priority {
    return FALLBACK_PRIORITIES[id % FALLBACK_PRIORITIES.length];
}

function toTask(todo: ApiTodo, overrideMetadata?: StoredTaskMetadata): Task {
    const stored = readClientMetadataMap()[todo.id];
    const merged: StoredTaskMetadata = {
        ...stored,
        ...overrideMetadata,
    };

    return {
        id: todo.id,
        title: todo.todo,
        description: merged.description ?? '',
        completed: todo.completed,
        priority: merged.priority ?? buildFallbackPriority(todo.id),
        category: merged.category ?? 'General',
        createdBy: merged.createdBy ?? `user#${todo.userId}`,
        createdAt: merged.createdAt ?? buildFallbackCreatedAt(todo.id),
        isClientOwnedMetadata: true,
    };
}

export const taskRepository = {
    async getAll(limit: number, skip: number, signal?: AbortSignal): Promise<PaginatedTasks> {
        const data = await httpClient.get<TodosResponse>(
            `/todos?limit=${limit}&skip=${skip}`,
            signal
        );

        const serverTasks = data.todos.map((todo) => toTask(todo));
        const createdTasks = readCreatedTasks();
        const tasks = skip === 0 ? [...createdTasks, ...serverTasks] : serverTasks;

        return {
            tasks,
            total: data.total + createdTasks.length,
            skip: data.skip,
            limit: data.limit,
        };
    },

    async getById(id: number, signal?: AbortSignal): Promise<Task> {
        const localTask = readCreatedTasks().find((task) => task.id === id);
        if (localTask) {
            return localTask;
        }

        const data = await httpClient.get<ApiTodo>(`/todos/${id}`, signal);
        return toTask(data);
    },

    async create(input: TaskInput, createdBy: string): Promise<Task> {
        const data = await httpClient.post<ApiTodo>(
            '/todos/add',
            {
                todo: input.title,
                completed: false,
                userId: DEFAULT_USER_ID,
            },
            undefined,
            true
        );

        const existingCreated = readCreatedTasks();
        const nextId = existingCreated.reduce(
            (maxId, task) => (task.id >= maxId ? task.id + 1 : maxId),
            data.id
        );

        const clientMetadata: StoredTaskMetadata = {
            ...input,
            createdBy,
            createdAt: new Date().toISOString(),
        };

        const createdTask = toTask({ ...data, id: nextId }, clientMetadata);
        writeClientMetadata(nextId, clientMetadata);
        writeCreatedTasks([createdTask, ...existingCreated]);

        return createdTask;
    },

    async update(
        id: number,
        changes: Partial<Pick<Task, 'title' | 'completed' | 'description' | 'priority' | 'category'>>
    ): Promise<Task> {
        const createdTasks = readCreatedTasks();
        const localIndex = createdTasks.findIndex((task) => task.id === id);

        if (localIndex !== -1) {
            ensureAuthenticated();
            const current = createdTasks[localIndex];
            const updated: Task = {
                ...current,
                title: changes.title ?? current.title,
                completed: changes.completed ?? current.completed,
                description: changes.description ?? current.description,
                priority: changes.priority ?? current.priority,
                category: changes.category ?? current.category,
            };

            const nextCreated = [...createdTasks];
            nextCreated[localIndex] = updated;
            writeCreatedTasks(nextCreated);
            return updated;
        }

        const body: Record<string, unknown> = {};
        if (changes.title !== undefined) body.todo = changes.title;
        if (changes.completed !== undefined) body.completed = changes.completed;

        const data = await httpClient.patch<ApiTodo>(`/todos/${id}`, body, undefined, true);

        const metadataPatch: StoredTaskMetadata = {};
        if (changes.description !== undefined) metadataPatch.description = changes.description;
        if (changes.priority !== undefined) metadataPatch.priority = changes.priority;
        if (changes.category !== undefined) metadataPatch.category = changes.category;

        writeClientMetadata(id, metadataPatch);
        return toTask(data, metadataPatch);
    },

    async delete(id: number): Promise<void> {
        const createdTasks = readCreatedTasks();
        const isLocalTask = createdTasks.some((task) => task.id === id);

        if (isLocalTask) {
            ensureAuthenticated();
            writeCreatedTasks(createdTasks.filter((task) => task.id !== id));
            removeClientMetadata(id);
            return;
        }

        await httpClient.delete<ApiTodo>(`/todos/${id}`, undefined, true);
        removeClientMetadata(id);
    },
};