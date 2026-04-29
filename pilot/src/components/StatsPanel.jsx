function StatCard({ title, value, accentClass }) {
  return (
    <article className={`stat-card ${accentClass}`}>
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  );
}

export default function StatsPanel({
  totalHabits,
  completedCount,
  activeCount,
  bestStreak,
}) {
  return (
    <section className="stats-grid">
      <StatCard title="Всего привычек" value={totalHabits} accentClass="accent-sun" />
      <StatCard title="Выполнено сегодня" value={completedCount} accentClass="accent-mint" />
      <StatCard title="Еще в работе" value={activeCount} accentClass="accent-sea" />
      <StatCard title="Лучшая серия" value={`${bestStreak} дн.`} accentClass="accent-coral" />
    </section>
  );
}
