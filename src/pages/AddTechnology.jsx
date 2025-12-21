import { useNavigate, Link } from "react-router-dom";
import "../pages/pages.css";
import "./AddTechnology.css";
import TechnologyForm from "../components/TechnologyForm";

export default function AddTechnology({ onAdd }) {
  const navigate = useNavigate();

  const handleSave = (data) => {
    onAdd?.(data);
    navigate("/technologies");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Добавить технологию</h1>
        </div>

        <div className="btn-row">
          <Link className="btn" to="/technologies">
            Назад
          </Link>
        </div>
      </div>

      <TechnologyForm
        onSave={handleSave}
        onCancel={() => navigate("/technologies")}
      />
    </div>
  );
}
