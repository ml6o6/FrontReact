export default function ProgressBar({ value, progress }) {
  const raw = typeof value === "number" ? value : progress;

  const num = Number(raw);

  const pct = Number.isFinite(num) ? Math.min(100, Math.max(0, num)) : 0;

  return (
    <div className="page-card" style={{ marginTop: 12 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <strong>Прогресс</strong>
        <span>{pct}%</span>
      </div>

      <div
        style={{
          marginTop: 10,
          width: "100%",
          height: 12,
          borderRadius: 999,
          background: "rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 999,
            background: "rgba(255,255,255,0.5)",
            transition: "width 250ms ease",
          }}
        />
      </div>
    </div>
  );
}
