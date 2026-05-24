import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

function KanbanCard({ card, renderCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: 'card', card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-lg border bg-background p-3 shadow-sm cursor-default',
        isDragging && 'ring-2 ring-primary'
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab touch-none text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          {renderCard ? renderCard(card) : <p className="text-sm font-medium truncate">{card.title}</p>}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ column, cards, renderCard, renderColumnHeader }) {
  const cardIds = cards.map((c) => c.id);

  return (
    <div className="flex flex-col min-w-[260px] max-w-[320px] flex-1 rounded-lg border bg-muted/30 p-3">
      <div className="mb-3 flex items-center justify-between">
        {renderColumnHeader ? (
          renderColumnHeader(column, cards)
        ) : (
          <>
            <h3 className="font-semibold text-sm">{column.title}</h3>
            <span className="text-xs text-muted-foreground rounded-full bg-muted px-2 py-0.5">
              {cards.length}
            </span>
          </>
        )}
      </div>
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 min-h-[60px]">
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} renderCard={renderCard} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

/**
 * KanbanBoard — dnd-kit kanban.
 *
 * @param {{ id: string, title: string }[]} columns
 * @param {{ id: string, columnId: string, title: string, [key: string]: any }[]} cards
 * @param {(newCards: any[]) => void} onDrop — called with updated cards array after drag
 * @param {(card: any) => React.ReactNode} renderCard — custom card renderer
 * @param {(column: any, cards: any[]) => React.ReactNode} renderColumnHeader — custom column header
 */
export function KanbanBoard({ columns = [], cards = [], onDrop, renderCard, renderColumnHeader }) {
  const [activeCard, setActiveCard] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const cardsByColumn = columns.reduce((acc, col) => {
    acc[col.id] = cards.filter((c) => c.columnId === col.id);
    return acc;
  }, {});

  function handleDragStart({ active }) {
    setActiveCard(cards.find((c) => c.id === active.id) || null);
  }

  function handleDragEnd({ active, over }) {
    setActiveCard(null);
    if (!over || active.id === over.id) return;

    const activeCard = cards.find((c) => c.id === active.id);
    const overCard = cards.find((c) => c.id === over.id);
    const overColumn = columns.find((col) => col.id === over.id);

    let updated = [...cards];

    if (overCard) {
      // Dropped onto another card — move to same column, reorder
      const newColumnId = overCard.columnId;
      updated = updated.map((c) => c.id === active.id ? { ...c, columnId: newColumnId } : c);
      const colCards = updated.filter((c) => c.columnId === newColumnId);
      const oldIdx = colCards.findIndex((c) => c.id === active.id);
      const newIdx = colCards.findIndex((c) => c.id === over.id);
      const reordered = arrayMove(colCards, oldIdx, newIdx);
      updated = [...updated.filter((c) => c.columnId !== newColumnId), ...reordered];
    } else if (overColumn) {
      // Dropped onto a column header — move card to that column
      updated = updated.map((c) => c.id === active.id ? { ...c, columnId: overColumn.id } : c);
    }

    onDrop?.(updated);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            cards={cardsByColumn[col.id] || []}
            renderCard={renderCard}
            renderColumnHeader={renderColumnHeader}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard && (
          <div className="rounded-lg border bg-background p-3 shadow-lg ring-2 ring-primary opacity-95">
            {renderCard ? renderCard(activeCard) : <p className="text-sm font-medium">{activeCard.title}</p>}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
