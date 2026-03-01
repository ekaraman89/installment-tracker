/**
 * DayDetailModal component
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
 * 
 * Displays detailed installment information for a selected day
 */

import { useEffect } from 'react';
import { InstallmentPayment, Card } from '../../store/types';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';

interface DayDetailModalProps {
  date: Date;
  payments: InstallmentPayment[];
  cards: Card[];
  onClose: () => void;
}

export function DayDetailModal({ date, payments, cards, onClose }: DayDetailModalProps) {
  // Calculate daily total
  const dailyTotal = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Create a map of card IDs to cards for quick lookup
  const cardMap = new Map(cards.map(card => [card.id, card]));
  
  // Group payments by card (bank)
  const paymentsByCard = payments.reduce((groups, payment) => {
    const cardId = payment.cardId;
    if (!groups[cardId]) {
      groups[cardId] = [];
    }
    groups[cardId].push(payment);
    return groups;
  }, {} as Record<string, InstallmentPayment[]>);
  
  // Calculate totals per card
  const cardTotals = Object.entries(paymentsByCard).map(([cardId, cardPayments]) => {
    const card = cardMap.get(cardId);
    const cardName = card?.name || '[Silinmiş Kart]';
    const cardColor = card?.color || '#6B7280';
    const total = cardPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      cardId,
      cardName,
      cardColor,
      payments: cardPayments,
      total
    };
  }).sort((a, b) => b.total - a.total); // Sort by total amount descending
  
  // Handle outside click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            {formatDate(date)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
            aria-label="Kapat"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        {/* Payment List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
          {payments.length === 0 ? (
            <div className="empty-state">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-600">Bu günde ödeme bulunmamaktadır</p>
            </div>
          ) : (
            <div className="space-y-4" role="list" aria-label="Banka bazında ödemeler">
              {cardTotals.map((cardGroup) => (
                <div key={cardGroup.cardId} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Card Header with Total */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: cardGroup.cardColor }}
                          aria-hidden="true"
                        />
                        <h3 className="font-semibold text-gray-900">
                          {cardGroup.cardName}
                        </h3>
                      </div>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(cardGroup.total)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Payments */}
                  <div className="divide-y divide-gray-100">
                    {cardGroup.payments.map((payment, index) => (
                      <div
                        key={`${payment.installmentId}-${payment.installmentNumber}-${index}`}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors duration-200"
                        role="listitem"
                      >
                        {/* Payment details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {payment.description || `Taksit ${payment.installmentNumber}/${payment.totalInstallments}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            Taksit {payment.installmentNumber}/{payment.totalInstallments}
                          </p>
                        </div>
                        
                        {/* Amount */}
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(payment.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer with total */}
        {payments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Günlük Toplam
              </span>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(dailyTotal)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}