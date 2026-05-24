import React, { useState } from 'react';

import { kanbanData, kanbanGrid } from '../data/dummy';
import { Header } from '../components';
import { KanbanBoard } from '../components/ui/KanbanBoard';

const COLUMNS = kanbanGrid.map((col) => ({ id: col.keyField, title: col.headerText }));

const PRIORITY_COLOR = {
  Low: 'text-green-600 dark:text-green-400',
  Normal: 'text-blue-600 dark:text-blue-400',
  High: 'text-orange-500',
  Critical: 'text-red-600',
};

const initialCards = kanbanData.map((d) => ({
  id: d.Id,
  columnId: d.Status,
  title: d.Title,
  summary: d.Summary,
  priority: d.Priority,
  type: d.Type,
  color: d.Color,
}));

const Kanban = () => {
  const [cards, setCards] = useState(initialCards);

  return (
    <div className="min-h-screen px-6 lg:px-8 pt-4 pb-6 bg-gray-50 dark:bg-main-dark-bg">
      <Header category="App" title="Kanban" />
      <KanbanBoard
        columns={COLUMNS}
        cards={cards}
        onDrop={setCards}
        renderCard={(card) => (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">{card.type}</span>
              <span className={`text-xs font-semibold ${PRIORITY_COLOR[card.priority] || 'text-gray-500'}`}>
                {card.priority}
              </span>
            </div>
            <p className="text-sm font-medium dark:text-gray-200">{card.title}</p>
            {card.summary && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{card.summary}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default Kanban;
