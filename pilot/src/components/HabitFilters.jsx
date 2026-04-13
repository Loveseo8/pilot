export default function HabitFilters({
  habitsShown,
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Подборка</p>
          <h2>Фильтры и поиск</h2>
        </div>
        <span className="status-chip">Показано: {habitsShown}</span>
      </div>

      <div className="filters-grid">
        <label>
          Поиск
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Ищите по названию или категории"
          />
        </label>

        <label>
          Статус
          <select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            <option value="all">Все</option>
            <option value="completed">Выполненные</option>
            <option value="active">Активные</option>
          </select>
        </label>
      </div>
    </section>
  );
}
