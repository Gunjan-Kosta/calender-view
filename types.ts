
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  category?: string;
}

export type ViewMode = 'month' | 'week' | 'agenda';

export interface CalendarViewProps {
  events?: CalendarEvent[];
  initialView?: ViewMode;
  initialDate?: Date;
}