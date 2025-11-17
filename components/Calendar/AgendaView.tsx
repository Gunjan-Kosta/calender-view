import React, { useMemo, useRef, useState, useEffect } from 'react';
import { CalendarEvent } from '../../types';
import { DAY_NAMES_FULL, formatTime, isToday } from '../../utils/date.utils';
import { clsx } from 'clsx';

interface AgendaViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const VIRTUALIZATION_THRESHOLD = 20; // Only virtualize if there are more than 20 events total
const DAY_GROUP_HEADER_HEIGHT = 48;
const EVENT_ITEM_HEIGHT = 88;
const GROUP_SPACING = 24;

const AgendaViewComponent: React.FC<AgendaViewProps> = ({ currentDate, events, onEventClick }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldVirtualize = events.length > VIRTUALIZATION_THRESHOLD;

  const agendaEventsByDay = useMemo(() => {
    const startDate = new Date(currentDate);
    startDate.setHours(0, 0, 0, 0);

    const sortedEvents = events
      .slice()
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    const futureEvents = sortedEvents.filter(event => new Date(event.startDate) >= startDate);
    
    const groupedEvents = new Map<string, { date: Date, events: CalendarEvent[] }>();

    futureEvents.forEach(event => {
        const eventDate = new Date(event.startDate);
        eventDate.setHours(0,0,0,0);
        const dateString = eventDate.toISOString().split('T')[0];

        if (!groupedEvents.has(dateString)) {
            groupedEvents.set(dateString, { date: eventDate, events: [] });
        }
        groupedEvents.get(dateString)!.events.push(event);
    });

    return Array.from(groupedEvents.values());
  }, [currentDate, events]);

  // Virtualization calculations
  const virtualItemsMeta = useMemo(() => {
    let offset = 0;
    return agendaEventsByDay.map(group => {
      const height = DAY_GROUP_HEADER_HEIGHT + (group.events.length * EVENT_ITEM_HEIGHT) + GROUP_SPACING;
      const item = { group, height, offset };
      offset += height;
      return item;
    });
  }, [agendaEventsByDay]);

  const totalHeight = virtualItemsMeta.length > 0 
    ? virtualItemsMeta[virtualItemsMeta.length - 1].offset + virtualItemsMeta[virtualItemsMeta.length - 1].height 
    : 0;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (shouldVirtualize) {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };

  const getVisibleGroups = () => {
    if (!shouldVirtualize) return virtualItemsMeta;

    const viewportHeight = containerRef.current?.clientHeight || 0;
    const visibleItems = [];

    for (const item of virtualItemsMeta) {
      if (item.offset + item.height > scrollTop && item.offset < scrollTop + viewportHeight) {
        visibleItems.push(item);
      }
    }
    return visibleItems;
  };

  const visibleGroups = getVisibleGroups();
  
  if (agendaEventsByDay.length === 0) {
    return (
        <div className="bg-white border border-neutral-200 shadow-sm rounded-lg p-10 text-center animate-fade-in">
            <h3 className="text-lg font-semibold text-neutral-800">No upcoming events</h3>
            <p className="text-neutral-500 mt-2">There are no events scheduled on or after {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.</p>
        </div>
    )
  }

  const renderGroup = (group: { date: Date, events: CalendarEvent[] }, style: React.CSSProperties = {}) => {
    const { date, events: dayEvents } = group;
    const isTodaysDate = isToday(date);
    return (
      <div style={style} className="flex flex-col md:flex-row md:gap-6 p-4 md:p-6">
        <div className="md:w-40 flex-shrink-0 mb-2 md:mb-0">
          <h3 className={clsx("font-bold text-lg", isTodaysDate ? "text-primary-600" : "text-neutral-900")}>
            {DAY_NAMES_FULL[date.getDay()]}
          </h3>
          <p className="text-sm text-neutral-500">
            {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex-grow border-t md:border-t-0 md:border-l border-neutral-200 md:pl-6 pt-4 md:pt-0">
            <ul className="space-y-4">
              {dayEvents.map(event => (
                <li 
                  key={event.id} 
                  onClick={() => onEventClick(event)}
                  className="cursor-pointer group flex gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  tabIndex={0}
                  aria-label={`Event: ${event.title}, from ${formatTime(new Date(event.startDate))} to ${formatTime(new Date(event.endDate))}`}
                >
                  <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: event.color || '#3b82f6' }}></div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-neutral-800 group-hover:text-primary-600 truncate">{event.title}</p>
                    <p className="text-sm text-neutral-500">
                      {formatTime(new Date(event.startDate))} - {formatTime(new Date(event.endDate))}
                    </p>
                    {event.description && <p className="text-sm text-neutral-600 mt-1 truncate">{event.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="bg-white border border-neutral-200 shadow-sm rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      style={{
        maxHeight: '70vh',
        overflowY: 'auto'
      }}
      tabIndex={-1}
    >
      {shouldVirtualize ? (
        <div className="relative" style={{ height: `${totalHeight}px` }}>
          {visibleGroups.map(({ group, offset }) => (
            <div key={group.date.toISOString()} style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${offset}px)` }}>
              {renderGroup(group)}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {agendaEventsByDay.map(({ date, events: dayEvents }) => (
            renderGroup({ date, events: dayEvents }, { animation: 'fadeIn 0.5s' })
          ))}
        </div>
      )}
    </div>
  );
};

export const AgendaView = React.memo(AgendaViewComponent);