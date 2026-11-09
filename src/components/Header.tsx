import { useTheme } from '../hooks/useTheme';
import './Header.scss';

export const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="header">
            <h1 className="header__title">Study Planner</h1>
            <button className="header__theme-btn" onClick={toggleTheme}>
                {theme === 'dark' ? 'Світла' : 'Темна'}
            </button>
        </header>
    );
};