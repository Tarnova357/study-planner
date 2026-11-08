import { useTaskContext } from '../hooks/useTaskContext';
import './Toast.scss';

export const Toast = () => {
    const { toast, undoDelete, dismissToast } = useTaskContext();

    if (!toast) return null;

    return (
        <div
            className={`toast toast--${toast.type}`}
            role="status"
            aria-live="polite"
        >
            <div className="toast__body">
                <span className="toast__message">{toast.message}</span>
                <div className="toast__actions">
                    {toast.undoable && (
                        <button
                            type="button"
                            className="toast__undo-btn"
                            onClick={undoDelete}
                        >
                            Скасувати
                        </button>
                    )}
                    {!toast.undoable && (
                        <button
                            type="button"
                            className="toast__close-btn"
                            onClick={dismissToast}
                            aria-label="Закрити повідомлення"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {toast.undoable && toast.duration && (
                <div className="toast__progress">
                    <div
                        key={toast.id}
                        className="toast__progress-bar"
                        style={{ animationDuration: `${toast.duration}ms` }}
                    />
                </div>
            )}
        </div>
    );
};