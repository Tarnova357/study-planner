import { useTaskContext } from '../hooks/useTaskContext';
import './Pagination.scss';

export const Pagination = () => {
    const { page, totalPages, isLoading, setPage } = useTaskContext();

    if (totalPages <= 1 && !isLoading) {
        return null;
    }

    return (
        <nav className="pagination" aria-label="Пагінація завдань">
            <button
                type="button"
                className="pagination__btn"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1 || isLoading}
            >
                Попередня
            </button>
            <span className="pagination__info">
                Сторінка {page} з {totalPages}
            </span>
            <button
                type="button"
                className="pagination__btn"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages || isLoading}
            >
                Наступна
            </button>
        </nav>
    );
};