import { useState, useEffect, useRef } from 'react';

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    const initialValueRef = useRef(initialValue);

    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`Помилка читання localStorage за ключем "${key}":`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            const serialized = JSON.stringify(storedValue);
            if (window.localStorage.getItem(key) !== serialized) {
                window.localStorage.setItem(key, serialized);
            }
        } catch (error) {
            console.warn(`Помилка запису в localStorage за ключем "${key}":`, error);
        }
    }, [key, storedValue]);

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key !== null && event.key !== key) return;

            if (event.key === null || event.newValue === null) {
                setStoredValue(initialValueRef.current);
                return;
            }

            try {
                const parsed = JSON.parse(event.newValue) as T;
                setStoredValue(parsed);
            } catch (error) {
                console.warn(`Помилка синхронізації localStorage за ключем "${key}":`, error);
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => {
            window.removeEventListener('storage', handleStorage);
        };
    }, [key]);

    return [storedValue, setStoredValue];
}