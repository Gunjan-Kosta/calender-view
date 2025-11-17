
import React from 'react';
import { CalendarView } from './components/Calendar/CalendarView';
import { CalendarEvent } from './types';

const sampleEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Team Standup',
    description: 'Daily sync with the team',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 9, 0),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 9, 30),
    color: '#2563eb', // blue-600
    category: 'Meeting',
  },
  {
    id: 'evt-2',
    title: 'Design Review',
    description: 'Review new component designs',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1, 14, 0),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1, 15, 30),
    color: '#047857', // emerald-700
    category: 'Design',
  },
  {
    id: 'evt-3',
    title: 'Client Presentation',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 10, 0),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 11, 30),
    color: '#d97706', // amber-600
    category: 'Meeting',
  },
  {
    id: 'evt-4',
    title: 'Development Sprint',
    description: 'Sprint planning and task assignment',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 9, 0),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 7, 17, 0),
    color: '#7c3aed', // violet-600
    category: 'Work',
  },
    {
    id: 'evt-5',
    title: 'Lunch with Sarah',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 12, 30),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 13, 30),
    color: '#be185d', // pink-700
    category: 'Personal',
  },
];

const App: React.FC = () => {
  return (
    <div>
      <CalendarView events={sampleEvents} />
    </div>
  );
};

export default App;
