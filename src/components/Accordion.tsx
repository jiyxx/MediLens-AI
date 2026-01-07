import React, { useState } from 'react';
import { ChevronDownIcon } from './Icons';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
}

const Accordion: React.FC<AccordionProps> = ({ 
  title, 
  children, 
  icon, 
  defaultOpen = false,
  className = "",
  headerClassName = "bg-white"
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors duration-200 ${headerClassName}`}
      >
        <div className="flex items-center space-x-3">
          {icon && <span className="text-teal-600">{icon}</span>}
          <span className="font-semibold text-slate-800 text-lg">{title}</span>
        </div>
        <div className={`transform transition-transform duration-300 text-slate-400 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden bg-slate-50 ${
          isOpen ? 'max-h-[2000px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-5 text-slate-700 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
