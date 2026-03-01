/**
 * MonthNavigation component - Navigation controls for calendar
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { addMonths, subMonths, format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface MonthNavigationProps {
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
}

export function MonthNavigation({ currentMonth, onMonthChange }: MonthNavigationProps) {
  const handlePreviousMonth = () => {
    const previousMonth = subMonths(currentMonth, 1);
    onMonthChange(previousMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    onMonthChange(nextMonth);
  };
  
  // Format month and year in Turkish
  const monthYearText = format(currentMonth, 'MMMM yyyy', { locale: tr });
  // Capitalize first letter
  const formattedMonthYear = monthYearText.charAt(0).toUpperCase() + monthYearText.slice(1);
  
  return (
    <nav className="card flex items-center justify-between" aria-label="Ay navigasyonu">
      {/* Previous month button */}
      <button
        onClick={handlePreviousMonth}
        className="btn-primary flex items-center gap-2 group"
        aria-label="Önceki ay"
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Önceki</span>
      </button>
      
      {/* Month and year display */}
      <h2 className="text-xl font-bold text-gray-800" aria-live="polite">
        {formattedMonthYear}
      </h2>
      
      {/* Next month button */}
      <button
        onClick={handleNextMonth}
        className="btn-primary flex items-center gap-2 group"
        aria-label="Sonraki ay"
      >
        <span>Sonraki</span>
        <svg
          className="w-5 h-5 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </nav>
  );
}
