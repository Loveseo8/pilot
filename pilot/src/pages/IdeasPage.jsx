import { useEffect, useState } from 'react';

const FALLBACK_IDEAS = [
  { id: 1, todo: 'Выпить стакан воды утром' },
  { id: 2, todo: 'Прочитать 10 страниц книги' },
  { id: 3, todo: 'Сделать короткую прогулку' },
];

function formatIdeaTitle(todo) {
  return todo
    .replace(/^Do /i, '')
    .replace(/^Read /i, 'Прочитать ')
    .replace(/^Watch /i, 'Посмотреть ')
    .trim();
}

export default function IdeasPage({ habitsCount, completedCount, onAddHabit }) {
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadIdeas() {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch('https://dummyjson.com/todos?limit=6', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Не удалось получить идеи');
        }

        const data = await response.json();
        setIdeas(Array.isArray(data.todos) ? data.todos : FALLBACK_IDEAS);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Не удалось обновить подборку, поэтому показаны резервные варианты.');
          setIdeas(FALLBACK_IDEAS);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadIdeas();

    return () => controller.abort();
  }, []);

  return (
    <>
      <section className="hero-card ideas-hero">
        <div className="hero-copy">
          <p className="eyebrow">Новые варианты</p>
          <h1>Идеи для следующей полезной привычки</h1>
          <p className="hero-text">
            Выберите небольшое действие, которое легко встроить в день. Любую идею
            можно сразу добавить в список привычек.
          </p>
        </div>

        <div className="hero-badge">
          <span className="hero-badge-label">Ваш прогресс</span>
          <strong>{completedCount} выполнено из {habitsCount}</strong>
          <span className="hero-text">
            Продолжайте в своем темпе и добавляйте только те привычки, которые
            действительно хочется закрепить.
          </span>
        </div>
      </section>

      <section className="panel ideas-panel">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Подборка</p>
            <h2>Подсказки для старта</h2>
          </div>
          <span className="status-chip">{isLoading ? 'Загрузка...' : `${ideas.length} идей`}</span>
        </div>

        {error ? <p className="api-message">{error}</p> : null}

        <div className="ideas-grid">
          {ideas.map((idea) => {
            const title = formatIdeaTitle(idea.todo);

            return (
              <article className="idea-card" key={idea.id}>
                <span className="habit-category">Идея #{idea.id}</span>
                <h3>{title}</h3>
                <p className="habit-meta">
                  Подойдет как маленький шаг на сегодня или как новая регулярная цель.
                </p>
                <button className="primary-button" type="button" onClick={() => onAddHabit(title)}>
                  Добавить в привычки
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
