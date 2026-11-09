import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from '../context/ThemeContext';

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme має використовуватися всередині ThemeProvider');
    }
    return context;
}