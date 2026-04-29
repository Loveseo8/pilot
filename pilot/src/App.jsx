import { useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import IdeasPage from './pages/IdeasPage.jsx';

const STORAGE_KEY = 'habit-pilot-storage';

const categoryMap = {
  Health: 'Здоровье',
  Study: 'Учеба',
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
    category: 'Учеба',
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
  const normalizedTitle =
    typeof habit?.title === 'string' && habit.title.trim()
      ? habit.title.trim()
      : 'Новая привычка';
  const normalizedCategory =
    typeof habit?.category === 'string' && habit.category.trim()
      ? habit.category.trim()
      : 'Личное';
  const normalizedFrequency =
    typeof habit?.frequency === 'string' && habit.frequency.trim()
      ? habit.frequency.trim()
      : 'Каждый день';
  const normalizedStreak = Number.isFinite(Number(habit?.streak))
    ? Math.max(0, Number(habit.streak))
    : 0;

  return {
    ...habit,
    id:
      typeof habit?.id === 'string' && habit.id.trim()
        ? habit.id
        : `habit-${Math.random().toString(36).slice(2, 10)}`,
    title: normalizedTitle,
    category: categoryMap[normalizedCategory] ?? normalizedCategory,
    frequency: frequencyMap[normalizedFrequency] ?? normalizedFrequency,
    streak: normalizedStreak,
    completedToday: Boolean(habit?.completedToday),
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
      ? parsedHabits.filter(Boolean).map(normalizeHabit)
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

  const stats = useMemo(() => {
    const completedCount = habits.filter((habit) => habit.completedToday).length;
    const bestStreak = habits.reduce(
      (currentBest, habit) => Math.max(currentBest, habit.streak),
      0,
    );

    return {
      totalHabits: habits.length,
      completedCount,
      activeCount: habits.length - completedCount,
      bestStreak,
    };
  }, [habits]);

  function saveHabit(habitData) {
    if (editingHabitId) {
      setHabits((currentHabits) =>
        currentHabits.map((habit) =>
          habit.id === editingHabitId ? normalizeHabit({ ...habit, ...habitData }) : habit,
        ),
      );
      setEditingHabitId(null);
      return;
    }

    setHabits((currentHabits) => [
      normalizeHabit({
        id: createHabitId(),
        completedToday: false,
        ...habitData,
      }),
      ...currentHabits,
    ]);
  }

  function addHabitFromIdea(title) {
    setHabits((currentHabits) => [
      normalizeHabit({
        id: createHabitId(),
        title,
        category: 'Личное',
        frequency: 'Каждый день',
        streak: 0,
        completedToday: false,
      }),
      ...currentHabits,
    ]);
  }

  function deleteHabit(habitId) {
    setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== habitId));

    if (editingHabitId === habitId) {
      setEditingHabitId(null);
    }
  }

  function toggleHabit(habitId) {
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

  return (
    <div className="app-shell">
      <div className="background-glow background-glow-left" />
      <div className="background-glow background-glow-right" />

      <main className="page">
        <nav className="top-nav" aria-label="Основная навигация">
          <NavLink to="/" end>
            Мои привычки
          </NavLink>
          <NavLink to="/ideas">Идеи</NavLink>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                habits={habits}
                stats={stats}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                editingHabitId={editingHabitId}
                onCancelEdit={() => setEditingHabitId(null)}
                onDeleteHabit={deleteHabit}
                onEditHabit={setEditingHabitId}
                onSaveHabit={saveHabit}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
                onToggleHabit={toggleHabit}
              />
            }
          />
          <Route
            path="/ideas"
            element={
              <IdeasPage
                habitsCount={stats.totalHabits}
                completedCount={stats.completedCount}
                onAddHabit={addHabitFromIdea}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
