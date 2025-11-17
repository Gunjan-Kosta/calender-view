import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from '../../types';

const meta: Meta<typeof CalendarView> = {
  title: 'Components/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    initialView: {
      control: { type: 'select' },
      options: ['month', 'week', 'agenda'],
    },
    initialDate: {
      control: 'date',
    },
    events: {
      control: false, // Disable control for events as it's complex
    }
  },
};

export default meta;
type Story = StoryObj<typeof CalendarView>;

// --- Sample Data ---
const today = new Date();
const sampleEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Team Standup',
    description: 'Daily sync with the team',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30),
    color: '#2563eb', // blue-600
    category: 'Meeting',
  },
  {
    id: 'evt-2',
    title: 'Design Review',
    description: 'Review new component designs',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 14, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 15, 30),
    color: '#047857', // emerald-700
    category: 'Design',
  },
  {
    id: 'evt-3',
    title: 'Client Call',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 11, 30),
    color: '#d97706', // amber-600
    category: 'Meeting',
  },
  {
    id: 'evt-5',
    title: 'Lunch with Sarah',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 30),
    color: '#be185d', // pink-700
    category: 'Personal',
  },
];


const generateLargeDataset = (numEvents: number): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const colors = ['#2563eb', '#047857', '#d97706', '#7c3aed', '#dc2626', '#be185d'];
    const titles = ['Sync', 'Planning', 'Review', 'Meeting', 'Workshop', 'Demo'];
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    for (let i = 0; i < numEvents; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const startHour = Math.floor(Math.random() * 8) + 9; // 9am - 4pm
        const duration = Math.random() > 0.5 ? 60 : 30;

        const startDate = new Date(currentYear, currentMonth, day, startHour, 0);
        const endDate = new Date(startDate.getTime() + duration * 60000);

        events.push({
            id: `large-evt-${i}`,
            title: `${titles[i % titles.length]} #${i + 1}`,
            startDate,
            endDate,
            color: colors[i % colors.length]
        });
    }
    return events;
}

// --- Stories ---

export const Default: Story = {
  name: "Default (Current Month)",
  args: {
    events: sampleEvents,
    initialDate: today,
  },
};

export const Empty: Story = {
  name: "Empty Calendar",
  args: {
    events: [],
    initialDate: today,
  },
};

export const WeekView: Story = {
  name: "Week View",
  args: {
    ...Default.args,
    initialView: 'week',
  },
};

export const LargeDataset: Story = {
  name: "Large Dataset (50+ Events)",
  args: {
    events: generateLargeDataset(50),
    initialDate: today,
  },
};

export const InteractivePlayground: Story = {
  name: "Interactive Playground",
  args: {
    events: sampleEvents,
    initialView: 'month',
    initialDate: new Date(today), // Pass a new Date object to make the control work
  },
  render: (args) => {
    // Storybook's date control returns a timestamp, so we need to convert it back to a Date object.
    const initialDate = args.initialDate ? new Date(args.initialDate) : new Date();
    return <CalendarView {...args} initialDate={initialDate} />;
  },
};
