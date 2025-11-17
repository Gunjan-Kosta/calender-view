
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CalendarEvent } from '../../types';
import { CalendarCell } from './CalendarCell';
import { DAY_NAMES, isToday } from '../../utils/date.utils';

interface MonthViewProps {
  grid: Date[];
  currentMonth: number;
  events: CalendarEvent[];
  getEventsForDay: (date: Date) => CalendarEvent[];
  onCellClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
  selectedDate?: Date | null;
}

const MonthViewComponent: React.FC<MonthViewProps> = ({
  grid,
  currentMonth,
  events,
  getEventsForDay,
  onCellClick,
  onEventClick,
  onEventUpdate,
  selectedDate,
}) => {
    const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    useEffect(() => {
        const gridElement = gridRef.current;
        if (!gridElement) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Home', 'End'].includes(e.key)) return;

            e.preventDefault();
            
            let newIndex: number;
            if (focusedIndex === null) {
                const todayIndex = grid.findIndex(isToday);
                newIndex = todayIndex !== -1 ? todayIndex : grid.findIndex(d => d.getMonth() === currentMonth)
            } else {
                newIndex = focusedIndex;
            }
            if (newIndex === -1) newIndex = 0;


            if (e.key === 'ArrowRight') newIndex = (newIndex + 1);
            if (e.key === 'ArrowLeft') newIndex = (newIndex - 1);
            if (e.key === 'ArrowDown') newIndex = (newIndex + 7);
            if (e.key === 'ArrowUp') newIndex = (newIndex - 7);
            if (e.key === 'Home') newIndex = 0;
            if (e.key === 'End') newIndex = 41;

            newIndex = Math.max(0, Math.min(41, newIndex));

            setFocusedIndex(newIndex);
            
            const cellToFocus = gridElement.querySelector(`[data-index='${newIndex}']`) as HTMLDivElement;
            cellToFocus?.focus();

            if (e.key === 'Enter' || e.key === ' ') {
                onCellClick(grid[newIndex]);
            }
        };

        gridElement.addEventListener('keydown', handleKeyDown);
        return () => gridElement.removeEventListener('keydown', handleKeyDown);
    }, [focusedIndex, grid, onCellClick, currentMonth]);

    const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, eventId: string) => {
        setDraggedEventId(eventId);
        e.dataTransfer.effectAllowed = 'move';
        
        // Create a ghost preview
        const dragGhost = e.currentTarget.cloneNode(true) as HTMLElement;
        dragGhost.style.position = "absolute";
        dragGhost.style.top = "-1000px";
        dragGhost.style.width = `${e.currentTarget.offsetWidth}px`;
        dragGhost.style.opacity = '0.7';
        document.body.appendChild(dragGhost);
        e.dataTransfer.setDragImage(dragGhost, 20, 10);

        setTimeout(() => {
            document.body.removeChild(dragGhost);
        }, 0);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, newDate: Date) => {
        e.preventDefault();
        if (draggedEventId) {
            const eventToUpdate = events.find(ev => ev.id === draggedEventId);
            if (eventToUpdate) {
                const originalStartDate = new Date(eventToUpdate.startDate);
                const originalEndDate = new Date(eventToUpdate.endDate);
                const duration = originalEndDate.getTime() - originalStartDate.getTime();
                
                const newStartDate = new Date(newDate);
                newStartDate.setHours(originalStartDate.getHours(), originalStartDate.getMinutes(), originalStartDate.getSeconds());

                const newEndDate = new Date(newStartDate.getTime() + duration);

                onEventUpdate(draggedEventId, { startDate: newStartDate, endDate: newEndDate });
            }
            setDraggedEventId(null);
        }
    }, [draggedEventId, events, onEventUpdate]);
  
  return (
    <div className="bg-white border-l border-b border-neutral-200 shadow-sm rounded-lg overflow-hidden" >
      <div className="grid grid-cols-7">
        {DAY_NAMES.map(day => (
          <div key={day} className="text-center py-2 text-sm font-semibold text-neutral-600 border-t border-r border-neutral-200 bg-neutral-100 sticky top-0 z-10">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7" ref={gridRef} tabIndex={0} onBlur={() => setFocusedIndex(null)} aria-label="Month grid. Use arrow keys to navigate days.">
        {grid.map((date, index) => (
          <CalendarCell
            key={index}
            date={date}
            events={getEventsForDay(date)}
            isCurrentMonth={date.getMonth() === currentMonth}
            onCellClick={onCellClick}
            onEventClick={onEventClick}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            index={index}
            draggedEventId={draggedEventId}
            selectedDate={selectedDate}
          />
        ))}
      </div>
    </div>
  );
};

export const MonthView = React.memo(MonthViewComponent);