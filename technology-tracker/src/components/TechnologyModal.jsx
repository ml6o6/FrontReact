import { useMemo } from "react";
import Modal from "./Modal";
import "./TechnologyModal.css";

const STATUS_META = {
  "not-started": "Не начато",
  "in-progress": "В процессе",
  completed: "Выполнено",
};

export default function TechnologyModal({
  isOpen,
  onClose,
  technology,
  onStatusChange,
  onNotesChange,
}) {
  const title = technology?.title || "Технология";

  const statusLabel = useMemo(() => {
    if (!technology) return "";
    return STATUS_META[technology.status] || technology.status || "";
  }, [technology]);

  if (!technology) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="tech-modal">
        <p className="tech-modal__desc">{technology.description}</p>

        <div className="tech-modal__row">
          <span className="tech-modal__label">Категория:</span>
          <span className="tech-modal__value">{technology.category}</span>
        </div>

        <div className="tech-modal__row">
          <span className="tech-modal__label">Статус:</span>
          <span className="tech-modal__value">{statusLabel}</span>
        </div>

        <div className="tech-modal__controls">
          <label className="tech-modal__control">
            <span>Сменить статус</span>
            <select
              value={technology.status}
              onChange={(e) => onStatusChange?.(technology.id, e.target.value)}
            >
              <option value="not-started">Не начато</option>
              <option value="in-progress">В процессе</option>
              <option value="completed">Выполнено</option>
            </select>
          </label>

          <label className="tech-modal__control">
            <span>Заметки</span>
            <textarea
              value={technology.notes || ""}
              onChange={(e) => onNotesChange?.(technology.id, e.target.value)}
              placeholder="Записывайте сюда важные моменты..."
              rows={4}
            />
          </label>
        </div>

        <div className="tech-modal__actions">
          <button type="button" className="btn" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </Modal>
  );
}
