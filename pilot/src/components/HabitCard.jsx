export default function HabitCard({
  habit,
  onToggleHabit,
  onEditHabit,
  onDeleteHabit,
}) {
  return (
    <article className={`habit-card ${habit.completedToday ? 'habit-card-done' : ''}`}>
      <div>
        <div className="habit-card-topline">
          <span className="habit-category">{habit.category}</span>
          {habit.completedToday ? <span className="done-chip">Сделано сегодня</span> : null}
        </div>

        <h3>{habit.title}</h3>
        <p className="habit-meta">Частота: {habit.frequency}</p>
        <p className="habit-meta">Серия: {habit.streak} дн.</p>
      </div>

      <div className="habit-card-actions">
        <button className="primary-button" type="button" onClick={() => onToggleHabit(habit.id)}>
          {habit.completedToday ? 'Отменить' : 'Отметить'}
        </button>
        <button className="ghost-button" type="button" onClick={() => onEditHabit(habit.id)}>
          Изменить
        </button>
        <button className="danger-button" type="button" onClick={() => onDeleteHabit(habit.id)}>
          Удалить
        </button>
      </div>
    </article>
  );
}
