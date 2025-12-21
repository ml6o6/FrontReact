import { useMemo, useState } from "react";
import Modal from "./Modal";
import "./QuickActions.css";

export default function QuickActions({
  onMarkAllCompleted,
  onResetAll,
  technologies,
}) {
  const [showExportModal, setShowExportModal] = useState(false);

  const exportJson = useMemo(() => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies,
    };
    return JSON.stringify(data, null, 2);
  }, [technologies]);

  const handleExport = () => {
    console.log("Данные для экспорта:", exportJson);
    setShowExportModal(true);
  };

  return (
    <section className="quick-actions">
      <h3 className="quick-actions__title">Быстрые действия</h3>

      <div className="action-buttons">
        <button onClick={onMarkAllCompleted} className="btn btn-success">
          ✅ Отметить все как выполненные
        </button>
        <button onClick={onResetAll} className="btn btn-warning">
          🔄 Сбросить все статусы
        </button>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
      >
        <p>Данные успешно подготовлены для экспорта!</p>
        <p>Они выведены в консоль разработчика (DevTools → Console).</p>

        <details className="export-details">
          <summary>Показать JSON</summary>
          <textarea readOnly value={exportJson} rows={10} />
        </details>

        <button className="btn" onClick={() => setShowExportModal(false)}>
          Закрыть
        </button>
      </Modal>
    </section>
  );
}
