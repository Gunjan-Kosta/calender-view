
import React, { useState, useCallback, lazy, Suspense, useMemo } from 'react';
import { CalendarEvent, CalendarViewProps } from '../../types';
import { useCalendar } from '../../hooks/useCalendar';
import { useEventManager } from '../../hooks/useEventManager';
import { useDebounce } from '../../hooks/useDebounce';
import { getCalendarGrid, MONTH_NAMES } from '../../utils/date.utils';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { AgendaView } from './AgendaView';
import { Button } from '../primitives/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '../primitives/icons';
import { clsx } from 'clsx';

const EventModal = lazy(() => import('./EventModal').then(module => ({ default: module.EventModal })));

export const CalendarView: React.FC<CalendarViewProps> = ({
  events: initialEvents = [],
  initialDate,
  initialView,
}) => {
  const { state: calendarState, actions: calendarActions } = useCalendar(initialDate, initialView);
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { events, addEvent, updateEvent, deleteEvent, getEventsForDay } = useEventManager(initialEvents, debouncedSearchTerm);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<CalendarEvent> | null>(null);

  const handleCellClick = useCallback((date: Date) => {
    setSelectedEvent({ startDate: date, endDate: new Date(date.getTime() + 60 * 60 * 1000) });
    setIsModalOpen(true);
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  const calendarGrid = useMemo(() => getCalendarGrid(calendarState.currentDate), [calendarState.currentDate]);
  
  const currentMonth = calendarState.currentDate.getMonth();
  const currentYear = calendarState.currentDate.getFullYear();

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(calendarState.currentDate);
    newDate.setMonth(parseInt(e.target.value, 10));
    calendarActions.setDate(newDate);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(calendarState.currentDate);
    newDate.setFullYear(parseInt(e.target.value, 10));
    calendarActions.setDate(newDate);
  };
  
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto font-sans">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <select
              value={currentMonth}
              onChange={handleMonthChange}
              className="text-2xl font-bold text-neutral-900 bg-transparent p-1 -m-1 rounded-md hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
              aria-label="Select month"
            >
              {MONTH_NAMES.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={currentYear}
              onChange={handleYearChange}
              className="text-2xl font-medium text-neutral-500 bg-transparent p-1 -m-1 rounded-md hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
              aria-label="Select year"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={calendarActions.goToPrevious} aria-label="Previous period"><ChevronLeftIcon className="w-5 h-5"/></Button>
            <Button variant="secondary" size="sm" onClick={calendarActions.goToToday}>Today</Button>
            <Button variant="ghost" size="sm" onClick={calendarActions.goToNext} aria-label="Next period"><ChevronRightIcon className="w-5 h-5"/></Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
             <input
               type="text"
               placeholder="Search events..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-40 sm:w-48 pl-3 pr-4 py-1.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
               aria-label="Search events"
             />
           </div>
           <div className="p-1 bg-neutral-200 rounded-lg">
                <button onClick={() => calendarActions.setView('month')} className={clsx("px-3 py-1 text-sm font-semibold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500", calendarState.view === 'month' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-600')}>Month</button>
                <button onClick={() => calendarActions.setView('week')} className={clsx("px-3 py-1 text-sm font-semibold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500", calendarState.view === 'week' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-600')}>Week</button>
                <button onClick={() => calendarActions.setView('agenda')} className={clsx("px-3 py-1 text-sm font-semibold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500", calendarState.view === 'agenda' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-600')}>Agenda</button>
           </div>
           <Button onClick={() => handleCellClick(new Date())}>Add Event</Button>
        </div>
      </header>

      <main>
        {calendarState.view === 'month' ? (
          <MonthView
            grid={calendarGrid}
            currentMonth={calendarState.currentDate.getMonth()}
            events={events}
            getEventsForDay={getEventsForDay}
            onCellClick={handleCellClick}
            onEventClick={handleEventClick}
            onEventUpdate={updateEvent}
            selectedDate={selectedEvent?.startDate}
          />
        ) : calendarState.view === 'week' ? (
          <WeekView
            currentDate={calendarState.currentDate}
            getEventsForDay={getEventsForDay}
            onEventClick={handleEventClick}
          />
        ) : (
          <AgendaView
            currentDate={calendarState.currentDate}
            events={events}
            onEventClick={handleEventClick}
          />
        )}
      </main>

      <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">Loading...</div>}>
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
          onSave={addEvent}
          onUpdate={updateEvent}
          onDelete={deleteEvent}
        />
      </Suspense>
    </div>
  );
};