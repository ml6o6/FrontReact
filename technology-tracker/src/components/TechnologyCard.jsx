import "./TechnologyCard.css";

const STATUS_META = {
  "not-started": { label: "Не начато", icon: "🕒" },
  "in-progress": { label: "В процессе", icon: "⏳" },
  completed: { label: "Выполнено", icon: "✅" },
};

export default function TechnologyCard({ technology, onOpen }) {
  const meta = STATUS_META[technology.status] ?? {
    label: "Неизвестно",
    icon: "❔",
  };

  return (
    <button
      type="button"
      className={["tech-card", `tech-card--${technology.status}`].join(" ")}
      onClick={() => onOpen?.(technology)}
      aria-label={`Открыть: ${technology.title}`}
    >
      <header className="tech-card__header">
        <h3 className="tech-card__title">{technology.title}</h3>
        <span className="tech-card__status">
          {meta.icon} {meta.label}
        </span>
      </header>

      <p className="tech-card__description">{technology.description}</p>

      <div className="tech-card__footer">
        <span className="tech-card__category">{technology.category}</span>
        <span className="tech-card__hint">Открыть карточку</span>
      </div>
    </button>
  );
}
