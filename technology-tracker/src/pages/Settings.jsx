import "../pages/pages.css";

export default function Settings({
  isLoggedIn,
  username,
  onLogout,
  onMarkAllCompleted,
  onResetAll,
  onClearAllNotes,
  onResetData,
}) {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Настройки</h1>
          <p style={{ margin: "6px 0 0", color: "#697086" }}>
            Управление приложением и данными (localStorage).
          </p>
        </div>
      </div>

      <div className="page-card" style={{ marginBottom: 12 }}>
        <h3 style={{ marginTop: 0 }}>Аккаунт</h3>
        {isLoggedIn ? (
          <div className="btn-row">
            <span style={{ color: "#697086", alignSelf: "center" }}>
              Вы вошли как: <strong>{username || "user"}</strong>
            </span>
            <button className="btn" type="button" onClick={onLogout}>
              Выйти
            </button>
          </div>
        ) : (
          <p style={{ margin: 0, color: "#697086" }}>Вы не авторизованы.</p>
        )}
      </div>

      <div className="page-card">
        <h3 style={{ marginTop: 0 }}>Данные</h3>
        <div className="btn-row">
          <button className="btn" type="button" onClick={onMarkAllCompleted}>
            Пометить всё выполненным
          </button>
          <button className="btn" type="button" onClick={onResetAll}>
            Сбросить статусы
          </button>
          <button className="btn" type="button" onClick={onClearAllNotes}>
            Очистить все заметки
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => {
              if (confirm("Сбросить данные к исходным?")) onResetData();
            }}
          >
            Сбросить данные (как в начале)
          </button>
        </div>

        <p style={{ margin: "12px 0 0", color: "#697086" }}>
          Все изменения сохраняются в <code>localStorage</code>, поэтому данные не пропадают при переходах и перезагрузке.
        </p>
      </div>
    </div>
  );
}
