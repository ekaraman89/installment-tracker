/**
 * CalendarDay component - Displays a single day in the calendar
 * Requirements: 3.2, 3.3, 3.4, 3.7
 */

import { InstallmentPayment, Card } from '../../store/types';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';

interface CalendarDayProps {
  date: Date;
  payments: InstallmentPayment[];
  cards: Card[];
  isToday: boolean;
  onClick: (date: Date) => void;
}

export function CalendarDay({ date, payments, cards, isToday, onClick }: CalendarDayProps) {
  // Calculate total amount for this day
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const hasPayments = payments.length > 0;
  
  // Get unique card colors for this day
  const cardColors = payments
    .map(payment => {
      const card = cards.find(c => c.id === payment.cardId);
      return card?.color || '#cccccc';
    })
    .filter((color, index, self) => self.indexOf(color) === index); // unique colors
  
  // Create tooltip text with payment descriptions
  const tooltipText = hasPayments 
    ? `${formatDate(date)}: ${formatCurrency(totalAmount)}\n${payments.map(p => {
        const card = cards.find(c => c.id === p.cardId);
        const cardName = card?.name || '[Silinmiş Kart]';
        return `• ${p.description || cardName} (${p.installmentNumber}/${p.totalInstallments})`;
      }).join('\n')}`
    : formatDate(date);
  
  return (
    <button
      onClick={() => onClick(date)}
      className={`
        min-h-[80px] p-2 border rounded-md cursor-pointer text-left
        transition-all duration-200 transform
        hover:scale-105 hover:shadow-md hover:z-10
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${isToday ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300' : 'bg-white border-gray-200'}
        ${hasPayments ? 'font-semibold' : ''}
      `}
      title={tooltipText}
      aria-label={`${formatDate(date)}${hasPayments ? `, ${formatCurrency(totalAmount)} ödeme` : ', ödeme yok'}`}
    >
      {/* Day number */}
      <div className={`text-sm mb-1 ${isToday ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
        {date.getDate()}
      </div>
      
      {/* Payment amount */}
      {hasPayments && (
        <div className="text-xs text-gray-900 mb-2 animate-fade-in">
          {formatCurrency(totalAmount)}
        </div>
      )}
      
      {/* Card color indicators */}
      {cardColors.length > 0 && (
        <div className="flex flex-wrap gap-1 animate-fade-in" role="list" aria-label="Kart renkleri">
          {cardColors.map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border border-gray-300 shadow-sm transition-transform hover:scale-110"
              style={{ backgroundColor: color }}
              title={`Kart rengi: ${color}`}
              role="listitem"
            />
          ))}
        </div>
      )}
    </button>
  );
}
