import './Header.scss';

interface HeaderProps {
    isDark: boolean;
    onToggleTheme: () => void;
}

export const Header = ({ isDark, onToggleTheme }: HeaderProps) => (
    <header className="header">
        <h1 className="header__title">Study Planner</h1>
        <button className="header__theme-btn" onClick={onToggleTheme}>
            {isDark ? 'Світла' : 'Темна'}
        </button>
    </header>
);