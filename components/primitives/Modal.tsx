import React, { useEffect, useRef } from 'react';
import { XIcon } from './icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, description }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg w-full max-w-md m-4 animate-slide-up"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full p-1"
            aria-label="Close modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {description && <p id="modal-description" className="sr-only">{description}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};
