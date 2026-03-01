/**
 * CalendarGrid component - Displays monthly calendar grid
 * Requirements: 3.1, 3.5, 3.6, 9.1
 */

import { CalendarDay } from './CalendarDay';
import { InstallmentPayment, Card } from '../../store/types';
import { isSameDay } from '../../utils/dateUtils';

interface CalendarGridProps {
  month: Date;
  payments: InstallmentPayment[];
  cards: Card[];
  onDayClick: (date: Date) => void;
}

const DAY_NAMES = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export function CalendarGrid({ month, payments, cards, onDayClick }: CalendarGridProps) {
  const today = new Date();
  
  // Get first day of month and calculate offset
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  
  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  // Convert to Monday-based (0 = Monday, 6 = Sunday)
  let firstDayOfWeek = firstDayOfMonth.getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Create array of all days to display (including empty cells for offset)
  const calendarDays: (Date | null)[] = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  
  return (
    <div className="card overflow-hidden p-0 animate-fade-in">
      {/* Day names header */}
      <div className="grid grid-cols-7 gap-0 border-b border-gray-200" role="row">
        {DAY_NAMES.map((dayName) => (
          <div
            key={dayName}
            className="p-3 text-center text-sm font-semibold text-gray-700 bg-gradient-to-b from-gray-50 to-white"
            role="columnheader"
          >
            {dayName}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0" role="grid" aria-label="Takvim">
        {calendarDays.map((date, index) => {
          if (date === null) {
            // Empty cell for offset
            return (
              <div
                key={`empty-${index}`}
                className="min-h-[80px] border border-gray-200 bg-gray-50"
                role="gridcell"
                aria-hidden="true"
              />
            );
          }
          
          // Get payments for this day
          const dayPayments = payments.filter(payment =>
            isSameDay(payment.dueDate, date)
          );
          
          // Check if this is today
          const isToday = isSameDay(date, today);
          
          return (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              payments={dayPayments}
              cards={cards}
              isToday={isToday}
              onClick={onDayClick}
            />
          );
        })}
      </div>
    </div>
  );
}
