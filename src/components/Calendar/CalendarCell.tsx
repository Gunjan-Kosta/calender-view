import React, { useCallback } from 'react';
import { CalendarEvent } from '../../types';
import { isToday, getMonthName, formatTime, isSameDay } from '../../utils/date.utils';
import { clsx } from 'clsx';
import { Tooltip } from '../primitives/Tooltip';

interface CalendarCellProps {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  onCellClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, eventId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, date: Date) => void;
  index: number;
  draggedEventId: string | null;
  selectedDate?: Date | null;
}

const CalendarCellComponent: React.FC<CalendarCellProps> = ({
  date,
  events,
  isCurrentMonth,
  onCellClick,
  onEventClick,
  onDragStart,
  onDragOver,
  onDrop,
  index,
  draggedEventId,
  selectedDate,
}) => {
  const dayNumber = date.getDate();
  const isTodaysDate = isToday(date);
  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

  const handleClick = useCallback(() => {
    onCellClick(date);
  }, [date, onCellClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCellClick(date);
    }
  }, [date, onCellClick]);
  
  const eventCount = events.length;
  const monthName = getMonthName(date);
  const year = date.getFullYear();
  const ariaLabel = `${monthName} ${dayNumber}, ${year}. ${eventCount} event${eventCount !== 1 ? 's' : ''}.`;

  const renderTooltipContent = (event: CalendarEvent) => (
    <div className="text-left">
      <p className="font-bold">{event.title}</p>
      <p className="text-neutral-300">
        {formatTime(new Date(event.startDate))} - {formatTime(new Date(event.endDate))}
      </p>
      {event.description && <p className="mt-1 whitespace-pre-wrap">{event.description}</p>}
    </div>
  );


  return (
    <div
      className={clsx(
        "border-t border-r border-neutral-200 p-2 flex flex-col min-h-24 md:min-h-32 lg:min-h-40 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:z-10",
        {
          "bg-neutral-50 text-neutral-500": !isCurrentMonth,
          "bg-white hover:bg-neutral-50 cursor-pointer": isCurrentMonth,
        }
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, date)}
      role="button"
      tabIndex={-1}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      aria-current={isTodaysDate ? "date" : undefined}
      data-index={index}
    >
      <div className="flex justify-start mb-1">
        <span
          className={clsx(
            'text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full',
            { 'text-neutral-900': isCurrentMonth && !isTodaysDate },
            { 'text-neutral-500': !isCurrentMonth },
            { 'bg-primary-700 text-white': isTodaysDate }
          )}
        >
          {dayNumber}
        </span>
      </div>
      <div className="space-y-1 overflow-hidden flex-grow">
        {events.slice(0, 3).map(event => (
           <Tooltip key={event.id} content={renderTooltipContent(event)}>
            <div
              onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
              onDragStart={(e) => { e.stopPropagation(); onDragStart(e, event.id); }}
              draggable
              className={clsx(
                "text-xs text-white px-2 py-1 rounded truncate cursor-grab active:cursor-grabbing transition-opacity",
                { 'opacity-50': draggedEventId === event.id }
              )}
              style={{ backgroundColor: event.color || '#3b82f6' }}
              aria-label={`Event: ${event.title}`}
            >
              {event.title}
            </div>
          </Tooltip>
        ))}
        {events.length > 3 && (
          <button onClick={(e) => {e.stopPropagation(); onCellClick(date)}} className="text-xs text-primary-600 hover:underline w-full text-left">
            +{events.length - 3} more
          </button>
        )}
      </div>
    </div>
  );
};

export const CalendarCell = React.memo(CalendarCellComponent);
