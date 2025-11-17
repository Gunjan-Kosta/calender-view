
import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../../types';
import { Button } from '../primitives/Button';
import { Modal } from '../primitives/Modal';
import { TrashIcon } from '../primitives/icons';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
  onDelete: (id: string) => void;
  event: Partial<CalendarEvent> | null;
}

// Type for form state to improve type safety
interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  color: string;
  category: string;
}

type FormErrors = Partial<Record<keyof Omit<EventFormData, 'color' | 'category' | 'startTime' | 'endTime'>, string>>;


// Accessible preset colors with sufficient contrast for white text
const PRESET_COLORS = [
  '#2563eb', // blue-600
  '#047857', // emerald-700
  '#d97706', // amber-600
  '#7c3aed', // violet-600
  '#dc2626', // red-600
  '#be185d', // pink-700
];
const PRESET_CATEGORIES = ['Work', 'Personal', 'Meeting', 'Design', 'Holiday', 'Other'];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  event,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setColor(event.color || PRESET_COLORS[0]);
      setCategory(event.category || '');

      if (event.startDate) {
        const start = new Date(event.startDate);
        setStartDate(start.toISOString().split('T')[0]);
        setStartTime(start.toTimeString().substring(0, 5));
      }
      if (event.endDate) {
        const end = new Date(event.endDate);
        setEndDate(end.toISOString().split('T')[0]);
        setEndTime(end.toTimeString().substring(0, 5));
      }
    } else {
      // Reset form for new event
      setTitle('');
      setDescription('');
      setColor(PRESET_COLORS[0]);
      setCategory('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setStartTime('10:00');
      setEndDate(new Date().toISOString().split('T')[0]);
      setEndTime('11:00');
    }
    setErrors({});
  }, [event, isOpen]);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (title.length > 100) newErrors.title = 'Title cannot exceed 100 characters.';
    if (description.length > 500) newErrors.description = 'Description cannot exceed 500 characters.';

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (isNaN(startDateTime.getTime())) newErrors.startDate = 'Invalid start date/time.';
    if (isNaN(endDateTime.getTime())) newErrors.endDate = 'Invalid end date/time.';
    if (startDateTime >= endDateTime) newErrors.endDate = 'End date must be after start date.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    const eventData = { title, description, startDate: startDateTime, endDate: endDateTime, color, category };

    if (event?.id) {
      onUpdate(event.id, eventData);
    } else {
      onSave(eventData);
    }
    onClose();
  };
  
  const handleDelete = () => {
    if (event?.id) {
        if(window.confirm('Are you sure you want to delete this event?')) {
            onDelete(event.id);
            onClose();
        }
    }
  }
  
  const modalDescription = event?.id ? 'Update the details for the selected event.' : 'Fill out the form to create a new event.';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event?.id ? 'Edit Event' : 'Add Event'} description={modalDescription}>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            maxLength={100}
            required
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
            <label className="block text-sm font-medium text-neutral-700">Time</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
                 <div>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                 </div>
                 <div>
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                 </div>
                 <div>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                 </div>
                 <div>
                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                 </div>
            </div>
             {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
             {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            maxLength={500}
          ></textarea>
           {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-700">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">None</option>
            {PRESET_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-neutral-700">Color</label>
            <div className="flex space-x-2 mt-2">
                {PRESET_COLORS.map(c => (
                    <button key={c} onClick={() => setColor(c)} style={{backgroundColor: c}} className={`w-8 h-8 rounded-full focus:outline-none transition-transform transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 ${color === c ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`} aria-label={`Select color ${c}`}/>
                ))}
            </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div>
            {event?.id && (
                <Button variant="ghost" onClick={handleDelete} aria-label="Delete event">
                    <TrashIcon/>
                </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
