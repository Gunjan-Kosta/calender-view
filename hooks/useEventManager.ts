import { useState, useCallback, useMemo } from 'react';
import { CalendarEvent } from '../types';

const getDateKey = (date: Date): string => {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    return d.toISOString().split('T')[0];
}

export const useEventManager = (initialEvents: CalendarEvent[] = [], searchTerm: string = '') => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt-${new Date().getTime()}-${Math.random()}`,
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev =>
      prev.map(event => (event.id === id ? { ...event, ...updates } : event))
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  const filteredEvents = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    if (!lowercasedSearchTerm) {
      return events;
    }
    return events.filter(event =>
      event.title.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [events, searchTerm]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    filteredEvents.forEach(event => {
        const key = getDateKey(event.startDate);
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.push(event);
    });
    // Sort events within each day
    map.forEach(dayEvents => {
        dayEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    });
    return map;
  }, [filteredEvents]);

  const getEventsForDay = useCallback((date: Date) => {
    const key = getDateKey(date);
    return eventsByDate.get(key) || [];
  }, [eventsByDate]);


  return {
    events: filteredEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDay,
  };
};
