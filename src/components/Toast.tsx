import { useTaskContext } from '../hooks/useTaskContext';
import './Toast.scss';

export const Toast = () => {
    const { toast, dismissToast } = useTaskContext();

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
                    <button
                        type="button"
                        className="toast__close-btn"
                        onClick={dismissToast}
                        aria-label="Закрити повідомлення"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
};