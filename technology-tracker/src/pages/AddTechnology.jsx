import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../pages/pages.css";
import "./AddTechnology.css";

export default function AddTechnology({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("frontend");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    onAdd?.({ title, description, category });
    navigate("/technologies");
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link className="btn" to="/technologies">
          ← Назад
        </Link>
        <h1 style={{ margin: 0 }}>Добавить технологию</h1>
      </div>

      <div className="page-card">
        <form className="add-form" onSubmit={submit}>
          <div className="form-group">
            <label>Название</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: React Router"
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Коротко: что именно изучаю / зачем"
            />
          </div>

          <div className="form-group">
            <label>Категория</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="frontend / backend / database / other"
            />
          </div>

          <div className="btn-row">
            <button className="btn primary" type="submit">
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
