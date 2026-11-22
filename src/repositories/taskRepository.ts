import { httpClient } from '../api/httpClient';
import type { ApiTodo, PaginatedTasks, TodosResponse } from '../types/api';
import type { Task, TaskInput } from '../types/task';

const DEFAULT_USER_ID = 1;

function toTask(todo: ApiTodo, metadata?: Partial<TaskInput>): Task {
    return {
        id: todo.id,
        title: todo.todo,
        description: metadata?.description ?? '',
        completed: todo.completed,
        priority: metadata?.priority ?? 'medium',
        category: metadata?.category ?? 'General',
    };
}

export const taskRepository = {
    async getAll(limit: number, skip: number, signal?: AbortSignal): Promise<PaginatedTasks> {
        const data = await httpClient.get<TodosResponse>(
            `/todos?limit=${limit}&skip=${skip}`,
            signal
        );

        return {
            tasks: data.todos.map((todo) => toTask(todo)),
            total: data.total,
            skip: data.skip,
            limit: data.limit,
        };
    },

    async getById(id: number, signal?: AbortSignal): Promise<Task> {
        const data = await httpClient.get<ApiTodo>(`/todos/${id}`, signal);
        return toTask(data);
    },

    async create(input: TaskInput): Promise<Task> {
        const data = await httpClient.post<ApiTodo>('/todos/add', {
            todo: input.title,
            completed: false,
            userId: DEFAULT_USER_ID,
        });

        return toTask(data, input);
    },

    async update(
        id: number,
        changes: Partial<Pick<Task, 'title' | 'completed' | 'description' | 'priority' | 'category'>>
    ): Promise<Task> {
        const body: Record<string, unknown> = {};
        if (changes.title !== undefined) body.todo = changes.title;
        if (changes.completed !== undefined) body.completed = changes.completed;

        const data = await httpClient.patch<ApiTodo>(`/todos/${id}`, body);

        return toTask(data, {
            description: changes.description,
            priority: changes.priority,
            category: changes.category,
        });
    },

    async delete(id: number): Promise<void> {
        await httpClient.delete<ApiTodo>(`/todos/${id}`);
    },
};