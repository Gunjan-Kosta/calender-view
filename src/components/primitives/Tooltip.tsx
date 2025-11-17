import React from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full mb-2 w-max max-w-xs bg-neutral-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 left-1/2 -translate-x-1/2">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-900"></div>
      </div>
    </div>
  );
};
