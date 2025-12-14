import "./ProgressBar.css";

// Универсальный компонент прогресс-бара
export default function ProgressBar({
  progress,
  label = "",
  color = "#4CAF50",
  height = 20,
  showPercentage = true,
  animated = false,
}) {
  const normalized = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <div className="progress-bar-container">
      {(label || showPercentage) && (
        <div className="progress-bar-header">
          {label ? <span className="progress-label">{label}</span> : null}
          {showPercentage ? (
            <span className="progress-percentage">{normalized}%</span>
          ) : null}
        </div>
      )}

      <div
        className="progress-bar-outer"
        style={{
          height: `${height}px`,
          borderRadius: `${Math.max(8, Math.round(height / 2))}px`,
        }}
      >
        <div
          className={`progress-bar-inner ${animated ? "animated" : ""}`}
          style={{
            width: `${normalized}%`,
            backgroundColor: color,
            transition: animated ? "width 0.5s ease-in-out" : "none",
          }}
        />
      </div>
    </div>
  );
}
