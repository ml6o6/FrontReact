import { useEffect, useMemo, useState } from "react";

/**
 * Форма добавления/редактирования технологии с валидацией в реальном времени.
 * По Практике 25: title, description, category, difficulty, deadline, resources (URL).
 */
export default function TechnologyForm({ onSave, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    category: initialData.category || "frontend",
    difficulty: initialData.difficulty || "beginner",
    deadline: initialData.deadline || "",
    resources: Array.isArray(initialData.resources) && initialData.resources.length
      ? initialData.resources
      : [""],
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const title = String(formData.title || "").trim();
    const description = String(formData.description || "").trim();

    if (!title) {
      newErrors.title = "Название технологии обязательно";
    } else if (title.length < 2) {
      newErrors.title = "Название должно содержать минимум 2 символа";
    } else if (title.length > 50) {
      newErrors.title = "Название не должно превышать 50 символов";
    }

    if (!description) {
      newErrors.description = "Описание технологии обязательно";
    } else if (description.length < 10) {
      newErrors.description = "Описание должно содержать минимум 10 символов";
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) newErrors.deadline = "Дедлайн не может быть в прошлом";
    }

    (formData.resources || []).forEach((resource, index) => {
      const v = String(resource || "").trim();
      if (v && !isValidUrl(v)) newErrors[`resource_${index}`] = "Введите корректный URL";
    });

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  useEffect(() => {
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResourceChange = (index, value) => {
    const next = [...(formData.resources || [])];
    next[index] = value;
    setFormData((prev) => ({ ...prev, resources: next }));
  };

  const addResourceField = () => {
    setFormData((prev) => ({ ...prev, resources: [...(prev.resources || [""]), ""] }));
  };

  const removeResourceField = (index) => {
    const arr = formData.resources || [""];
    if (arr.length <= 1) return;
    const next = arr.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, resources: next }));
  };

  const cleaned = useMemo(() => {
    return {
      ...formData,
      title: String(formData.title || "").trim(),
      description: String(formData.description || "").trim(),
      resources: (formData.resources || [])
        .map((r) => String(r || "").trim())
        .filter((r) => r !== ""),
    };
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSave?.(cleaned);
  };

  const isEdit = Boolean(initialData?.id || initialData?.title);

  return (
    <form onSubmit={handleSubmit} className="page-card" noValidate>
      <div className="page-header" style={{ marginBottom: 10 }}>
        <div>
          <h2 style={{ margin: 0 }}>{isEdit ? "Редактирование технологии" : "Добавление технологии"}</h2>
          <p style={{ margin: "6px 0 0", color: "#697086" }}>
            Поля с * обязательны
          </p>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="title" className="required">
          Название *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? "error" : ""}
          placeholder="Например: React, Node.js, TypeScript"
          aria-describedby={errors.title ? "title-error" : undefined}
          aria-invalid={Boolean(errors.title)}
          required
        />
        {errors.title && (
          <span id="title-error" className="error-message" role="alert">
            {errors.title}
          </span>
        )}
      </div>

      <div className="form-group" style={{ marginTop: 10 }}>
        <label htmlFor="description" className="required">
          Описание *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={errors.description ? "error" : ""}
          placeholder="Опишите, что это за технология и зачем её изучать..."
          aria-describedby={errors.description ? "description-error" : undefined}
          aria-invalid={Boolean(errors.description)}
          required
        />
        {errors.description && (
          <span id="description-error" className="error-message" role="alert">
            {errors.description}
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 10 }}>
        <div className="form-group">
          <label htmlFor="category">Категория</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange}>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="mobile">Mobile</option>
            <option value="devops">DevOps</option>
            <option value="database">Базы данных</option>
            <option value="tools">Инструменты</option>
            <option value="other">Другое</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Сложность</label>
          <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="beginner">Начинающий</option>
            <option value="intermediate">Средний</option>
            <option value="advanced">Продвинутый</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Планируемая дата</label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            className={errors.deadline ? "error" : ""}
            aria-describedby={errors.deadline ? "deadline-error" : undefined}
            aria-invalid={Boolean(errors.deadline)}
          />
          {errors.deadline && (
            <span id="deadline-error" className="error-message" role="alert">
              {errors.deadline}
            </span>
          )}
        </div>
      </div>

      <div className="form-group" style={{ marginTop: 12 }}>
        <label>Ресурсы (URL)</label>

        {(formData.resources || [""]).map((resource, index) => (
          <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "start" }}>
            <div style={{ display: "grid", gap: 6 }}>
              <input
                type="url"
                value={resource}
                onChange={(e) => handleResourceChange(index, e.target.value)}
                placeholder="https://..."
                className={errors[`resource_${index}`] ? "error" : ""}
                aria-describedby={errors[`resource_${index}`] ? `resource-${index}-error` : undefined}
                aria-invalid={Boolean(errors[`resource_${index}`])}
              />
              {errors[`resource_${index}`] && (
                <span id={`resource-${index}-error`} className="error-message" role="alert">
                  {errors[`resource_${index}`]}
                </span>
              )}
            </div>

            {(formData.resources || []).length > 1 && (
              <button type="button" className="btn" onClick={() => removeResourceField(index)} aria-label="Удалить ресурс">
                ✕
              </button>
            )}
          </div>
        ))}

        <div className="btn-row" style={{ marginTop: 8 }}>
          <button type="button" className="btn" onClick={addResourceField}>
            + Добавить ресурс
          </button>
        </div>
      </div>

      <div className="btn-row" style={{ marginTop: 12 }}>
        <button type="submit" className="btn primary" disabled={!isFormValid}>
          {isEdit ? "Сохранить" : "Добавить"}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Отмена
        </button>
      </div>

      {!isFormValid && (
        <div className="form-validation-info" role="status" style={{ marginTop: 10, color: "#8a6d3b" }}>
          ⚠ Заполните обязательные поля корректно
        </div>
      )}
    </form>
  );
}
