import HabitCard from './HabitCard.jsx';
import EmptyState from './EmptyState.jsx';

export default function HabitList({
  habits,
  onToggleHabit,
  onEditHabit,
  onDeleteHabit,
}) {
  if (habits.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="cards-stack">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onDeleteHabit={onDeleteHabit}
          onEditHabit={onEditHabit}
          onToggleHabit={onToggleHabit}
        />
      ))}
    </section>
  );
}
