
import React from 'react';
import { CalendarEvent } from '../../types';
import { getWeekDays, DAY_NAMES_FULL, formatTime, getHoursBetween, isToday } from '../../utils/date.utils';
import { clsx } from 'clsx';
import { Tooltip } from '../primitives/Tooltip';

interface WeekViewProps {
  currentDate: Date;
  getEventsForDay: (date: Date) => CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const MINUTES_IN_DAY = 24 * 60;

const getEventPosition = (event: CalendarEvent) => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  
  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();

  const top = (startMinutes / MINUTES_IN_DAY) * 100;
  const height = ((endMinutes - startMinutes) / MINUTES_IN_DAY) * 100;

  return { top: `${top}%`, height: `${height}%` };
};

const WeekViewComponent: React.FC<WeekViewProps> = ({ currentDate, getEventsForDay, onEventClick }) => {
  const weekDays = getWeekDays(currentDate);
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  
  const renderTooltipContent = (event: CalendarEvent) => (
    <div className="text-left">
      <p className="font-bold">{event.title}</p>
      {event.description && <p className="mt-1 whitespace-pre-wrap">{event.description}</p>}
    </div>
  );

  return (
    <div className="bg-white border border-neutral-200 shadow-sm rounded-lg flex overflow-auto">
      <div className="w-20 flex-shrink-0">
        <div className="h-20 border-b border-r border-neutral-200"></div>
        {timeSlots.map(hour => (
          <div key={hour} className="h-24 text-right pr-2 pt-1 text-xs text-neutral-500 border-r border-neutral-200">
            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-grow min-w-[800px]">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isTodaysDate = isToday(day);

          return (
            <div key={day.toString()} className="border-r border-neutral-200 relative">
              <div className="text-center py-2 h-20 border-b border-neutral-200 sticky top-0 bg-white z-10">
                <p className="text-sm text-neutral-500">{day.toString().substring(0,3)}</p>
                <p className={clsx("text-2xl font-semibold", isTodaysDate ? 'text-primary-600' : 'text-neutral-900')}>{day.getDate()}</p>
              </div>
              <div className="relative h-[2880px]"> {/* 24 * 4 * 30px */}
                {timeSlots.map(hour => (
                  <div key={hour} className="h-24 border-b border-neutral-100"></div>
                ))}
                {dayEvents.map(event => {
                  const {top, height} = getEventPosition(event);
                  return (
                    <Tooltip key={event.id} content={renderTooltipContent(event)}>
                      <div
                        className="absolute left-1 right-1 p-2 rounded-lg text-white cursor-pointer overflow-hidden z-20"
                        style={{ backgroundColor: event.color || '#3b82f6', top, height }}
                        onClick={() => onEventClick(event)}
                      >
                        <p className="font-bold text-xs">{event.title}</p>
                        <p className="text-xs opacity-80">{formatTime(new Date(event.startDate))} - {formatTime(new Date(event.endDate))}</p>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const WeekView = React.memo(WeekViewComponent);