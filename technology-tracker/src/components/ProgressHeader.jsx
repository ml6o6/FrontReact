import "./ProgressHeader.css";

export default function ProgressHeader({ total, counts }) {
  const safeTotal = Math.max(0, Number(total) || 0);

  const notStarted = Number(counts?.["not-started"] || 0);
  const inProgress = Number(counts?.["in-progress"] || 0);
  const completed = Number(counts?.completed || 0);

  const percent =
    safeTotal === 0 ? 0 : Math.round((completed / safeTotal) * 100);

  let hint;
  if (safeTotal === 0) hint = "Добавьте технологии в список, чтобы начать.";
  else if (percent === 100) hint = "Отлично! Всё выполнено 🎉";
  else if (percent === 0) hint = "Пока не начато — выберите первую технологию.";
  else hint = "Продолжайте в том же духе!";

  return (
    <section className="progress-header">
      <div className="progress-header__top">
        <h1 className="progress-header__title">Technology Tracker</h1>

        <div className="progress-header__stats">
          <span>
            Всего: <b>{safeTotal}</b>
          </span>
          <span>
            Не начато: <b>{notStarted}</b>
          </span>
          <span>
            В процессе: <b>{inProgress}</b>
          </span>
          <span>
            Выполнено: <b>{completed}</b>
          </span>
          <span>
            Прогресс: <b>{percent}%</b>
          </span>
        </div>
      </div>

      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>

      <p className="progress-header__hint">{hint}</p>
    </section>
  );
}
