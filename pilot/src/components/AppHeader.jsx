export default function AppHeader({ totalHabits, completedCount }) {
  return (
    <section className="hero-card">
      <div className="hero-copy">
        <p className="eyebrow">Habit Pilot</p>
        <h1>Привычки, которые делают тебя лучше</h1>
        <p className="hero-text">
          Контролируй свою жизнь: отмечайте сделанное, держите фокус и наблюдайте, как
          маленькие действия превращаются в стабильный результат.
        </p>
      </div>

      <div className="hero-badge">
        <span className="hero-badge-label">Сегодняшний прогресс</span>
        <strong>{completedCount} из {totalHabits} привычек уже выполнено</strong>
        <span className="hero-text">
          Добавьте новую привычку или обновите существующую прямо из формы слева.
        </span>
      </div>
    </section>
  );
}
