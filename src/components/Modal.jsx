import "./Modal.css";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const handleBackgroundClick = (event) => {
    if (event.target === event.currentTarget) onClose?.();
  };

  return (
    <div
      className="modal-background"
      onClick={handleBackgroundClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-window">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
