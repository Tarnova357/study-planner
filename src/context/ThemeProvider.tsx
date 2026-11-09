import { useCallback, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ThemeContext, type Theme } from './ThemeContext';

const THEME_STORAGE_KEY = 'study-planner-theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useLocalStorage<Theme>(THEME_STORAGE_KEY, 'light');

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, [setTheme]);

    const value = useMemo(
        () => ({
            theme,
            toggleTheme,
        }),
        [theme, toggleTheme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};