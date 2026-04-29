import { useState } from 'react';

const emptyForm = {
  title: '',
  category: 'Здоровье',
  frequency: 'Каждый день',
  streak: 1,
};

function getInitialFormData(editingHabit) {
  if (!editingHabit) {
    return emptyForm;
  }

  return {
    title: editingHabit.title,
    category: editingHabit.category,
    frequency: editingHabit.frequency,
    streak: editingHabit.streak,
  };
}

export default function HabitForm({ editingHabit, onSaveHabit, onCancelEdit }) {
  const [formData, setFormData] = useState(() => getInitialFormData(editingHabit));

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: name === 'streak' ? Number(value) : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    onSaveHabit({
      title: formData.title.trim(),
      category: formData.category,
      frequency: formData.frequency,
      streak: formData.streak,
    });

    if (!editingHabit) {
      setFormData(getInitialFormData(null));
    }
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Форма</p>
          <h2>{editingHabit ? 'Редактирование привычки' : 'Добавить привычку'}</h2>
        </div>
        {editingHabit ? <span className="status-chip">Режим редактирования</span> : null}
      </div>

      <form className="habit-form" onSubmit={handleSubmit}>
        <label>
          Название
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Например: 20 минут английского"
          />
        </label>

        <label>
          Категория
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Здоровье">Здоровье</option>
            <option value="Учеба">Учеба</option>
            <option value="Фокус">Фокус</option>
            <option value="Спорт">Спорт</option>
            <option value="Личное">Личное</option>
          </select>
        </label>

        <label>
          Частота
          <select name="frequency" value={formData.frequency} onChange={handleChange}>
            <option value="Каждый день">Каждый день</option>
            <option value="5 раз в неделю">5 раз в неделю</option>
            <option value="3 раза в неделю">3 раза в неделю</option>
            <option value="По выходным">По выходным</option>
          </select>
        </label>

        <label>
          Текущая серия
          <input
            name="streak"
            type="number"
            min="0"
            max="365"
            value={formData.streak}
            onChange={handleChange}
          />
        </label>

        <div className="form-actions">
          <button className="primary-button" type="submit">
            {editingHabit ? 'Сохранить изменения' : 'Добавить привычку'}
          </button>

          {editingHabit ? (
            <button className="secondary-button" type="button" onClick={onCancelEdit}>
              Отмена
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
