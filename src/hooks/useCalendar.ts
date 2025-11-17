import { useState, useCallback, useMemo } from 'react';
import { ViewMode } from '../types';

export const useCalendar = (initialDate: Date = new Date(), initialView: ViewMode = 'month') => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<ViewMode>(initialView);

  const goToNext = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() + 1, 1);
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() + 7);
      } else { // agenda
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  }, [view]);

  const goToPrevious = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() - 1, 1);
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() - 7);
      } else { // agenda
        newDate.setDate(newDate.getDate() - 1);
      }
      return newDate;
    });
  }, [view]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);
  
  const setDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const state = useMemo(() => ({
    currentDate,
    view,
  }), [currentDate, view]);

  const actions = useMemo(() => ({
    goToNext,
    goToPrevious,
    goToToday,
    setView,
    setDate,
  }), [goToNext, goToPrevious, goToToday, setDate]);

  return { state, actions };
};
