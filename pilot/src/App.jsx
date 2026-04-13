import { useEffect, useState } from 'react';
import AppHeader from './components/AppHeader.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import HabitForm from './components/HabitForm.jsx';
import HabitFilters from './components/HabitFilters.jsx';
import HabitList from './components/HabitList.jsx';

const STORAGE_KEY = 'habit-pilot-storage';

const categoryMap = {
  Health: 'Здоровье',
  Study: 'Учёба',
  Focus: 'Фокус',
  Sport: 'Спорт',
  Personal: 'Личное',
};

const frequencyMap = {
  'Every day': 'Каждый день',
  '5 times a week': '5 раз в неделю',
  '3 times a week': '3 раза в неделю',
  Weekends: 'По выходным',
};

const demoHabits = [
  {
    id: 'habit-1',
    title: 'Утро без телефона',
    category: 'Фокус',
    frequency: 'Каждый день',
    streak: 4,
    completedToday: true,
  },
  {
    id: 'habit-2',
    title: '30 минут чтения',
    category: 'Учёба',
    frequency: '5 раз в неделю',
    streak: 2,
    completedToday: false,
  },
  {
    id: 'habit-3',
    title: 'Вечерняя прогулка',
    category: 'Здоровье',
    frequency: 'Каждый день',
    streak: 6,
    completedToday: true,
  },
];

function normalizeHabit(habit) {
  return {
    ...habit,
    category: categoryMap[habit.category] ?? habit.category,
    frequency: frequencyMap[habit.frequency] ?? habit.frequency,
  };
}

function loadHabits() {
  if (typeof window === 'undefined') {
    return demoHabits.map(normalizeHabit);
  }

  const savedHabits = window.localStorage.getItem(STORAGE_KEY);
  if (!savedHabits) {
    return demoHabits.map(normalizeHabit);
  }

  try {
    const parsedHabits = JSON.parse(savedHabits);
    return Array.isArray(parsedHabits)
      ? parsedHabits.map(normalizeHabit)
      : demoHabits.map(normalizeHabit);
  } catch {
    return demoHabits.map(normalizeHabit);
  }
}

function createHabitId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `habit-${Date.now()}`;
}

export default function App() {
  const [habits, setHabits] = useState(loadHabits);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingHabitId, setEditingHabitId] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const editingHabit = habits.find((habit) => habit.id === editingHabitId) ?? null;

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch =
      habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      habit.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'completed') {
      return matchesSearch && habit.completedToday;
    }

    if (statusFilter === 'active') {
      return matchesSearch && !habit.completedToday;
    }

    return matchesSearch;
  });

  const completedCount = habits.filter((habit) => habit.completedToday).length;
  const bestStreak = habits.reduce(
    (currentBest, habit) => Math.max(currentBest, habit.streak),
    0,
  );

  function handleSaveHabit(habitData) {
    if (editingHabitId) {
      setHabits((currentHabits) =>
        currentHabits.map((habit) =>
          habit.id === editingHabitId ? { ...habit, ...habitData } : habit,
        ),
      );
      setEditingHabitId(null);
      return;
    }

    setHabits((currentHabits) => [
      {
        id: createHabitId(),
        completedToday: false,
        ...habitData,
      },
      ...currentHabits,
    ]);
  }

  function handleDeleteHabit(habitId) {
    setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== habitId));

    if (editingHabitId === habitId) {
      setEditingHabitId(null);
    }
  }

  function handleToggleHabit(habitId) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        const nextCompletedValue = !habit.completedToday;

        return {
          ...habit,
          completedToday: nextCompletedValue,
          streak: nextCompletedValue ? habit.streak + 1 : Math.max(0, habit.streak - 1),
        };
      }),
    );
  }

  function handleStartEdit(habitId) {
    setEditingHabitId(habitId);
  }

  function handleCancelEdit() {
    setEditingHabitId(null);
  }

  return (
    <div className="app-shell">
      <div className="background-glow background-glow-left" />
      <div className="background-glow background-glow-right" />

      <main className="page">
        <AppHeader totalHabits={habits.length} completedCount={completedCount} />

        <StatsPanel
          totalHabits={habits.length}
          completedCount={completedCount}
          activeCount={habits.length - completedCount}
          bestStreak={bestStreak}
        />

        <section className="layout-grid">
          <HabitForm
            key={editingHabitId ?? 'new-habit'}
            editingHabit={editingHabit}
            onCancelEdit={handleCancelEdit}
            onSaveHabit={handleSaveHabit}
          />

          <div className="content-stack">
            <HabitFilters
              habitsShown={filteredHabits.length}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSearchChange={setSearchTerm}
              onStatusChange={setStatusFilter}
            />

            <HabitList
              habits={filteredHabits}
              onDeleteHabit={handleDeleteHabit}
              onEditHabit={handleStartEdit}
              onToggleHabit={handleToggleHabit}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
