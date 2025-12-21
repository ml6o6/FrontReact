import "./TechnologyNotes.css";

export default function TechnologyNotes({ notes, onNotesChange, techId }) {
  const safeNotes = typeof notes === "string" ? notes : "";

  return (
    <div className="notes-section">
      <h4 className="notes-section__title">Мои заметки:</h4>

      <textarea
        className="notes-section__textarea"
        value={safeNotes}
        onChange={(e) => onNotesChange?.(techId, e.target.value)}
        placeholder="Записывайте сюда важные моменты..."
        rows={3}
      />

      <div className="notes-section__hint">
        {safeNotes.length > 0
          ? `Заметка сохранена (${safeNotes.length} символов)`
          : "Добавьте заметку"}
      </div>
    </div>
  );
}
