import AppHeader from '../components/AppHeader.jsx';
import HabitFilters from '../components/HabitFilters.jsx';
import HabitForm from '../components/HabitForm.jsx';
import HabitList from '../components/HabitList.jsx';
import StatsPanel from '../components/StatsPanel.jsx';

export default function DashboardPage({
  habits,
  stats,
  searchTerm,
  statusFilter,
  editingHabitId,
  onCancelEdit,
  onDeleteHabit,
  onEditHabit,
  onSaveHabit,
  onSearchChange,
  onStatusChange,
  onToggleHabit,
}) {
  const editingHabit = habits.find((habit) => habit.id === editingHabitId) ?? null;

  const filteredHabits = habits.filter((habit) => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      habit.title.toLowerCase().includes(searchValue) ||
      habit.category.toLowerCase().includes(searchValue);

    if (statusFilter === 'completed') {
      return matchesSearch && habit.completedToday;
    }

    if (statusFilter === 'active') {
      return matchesSearch && !habit.completedToday;
    }

    return matchesSearch;
  });

  return (
    <>
      <AppHeader totalHabits={stats.totalHabits} completedCount={stats.completedCount} />

      <StatsPanel
        totalHabits={stats.totalHabits}
        completedCount={stats.completedCount}
        activeCount={stats.activeCount}
        bestStreak={stats.bestStreak}
      />

      <section className="layout-grid">
        <HabitForm
          key={editingHabitId ?? 'new-habit'}
          editingHabit={editingHabit}
          onCancelEdit={onCancelEdit}
          onSaveHabit={onSaveHabit}
        />

        <div className="content-stack">
          <HabitFilters
            habitsShown={filteredHabits.length}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={onSearchChange}
            onStatusChange={onStatusChange}
          />

          <HabitList
            habits={filteredHabits}
            onDeleteHabit={onDeleteHabit}
            onEditHabit={onEditHabit}
            onToggleHabit={onToggleHabit}
          />
        </div>
      </section>
    </>
  );
}
