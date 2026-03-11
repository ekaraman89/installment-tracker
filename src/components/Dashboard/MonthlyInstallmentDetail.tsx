/**
 * MonthlyInstallmentDetail component
 * Displays detailed list of installments for the selected month
 */

import { InstallmentPayment, Card } from '../../store/types';
import { formatCurrency } from '../../utils/formatUtils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface MonthlyInstallmentDetailProps {
  month: Date;
  payments: InstallmentPayment[];
  cards: Card[];
}

export function MonthlyInstallmentDetail({ month, payments, cards }: MonthlyInstallmentDetailProps) {
  // Create a map of card IDs to cards for quick lookup
  const cardMap = new Map(cards.map(card => [card.id, card]));
  
  // Group payments by installment ID to show unique installments
  const installmentGroups = payments.reduce((groups, payment) => {
    const key = payment.installmentId;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(payment);
    return groups;
  }, {} as Record<string, InstallmentPayment[]>);
  
  // Create installment summary
  const installmentSummary = Object.values(installmentGroups).map(group => {
    const firstPayment = group[0];
    const card = cardMap.get(firstPayment.cardId);
    
    return {
      installmentId: firstPayment.installmentId,
      description: firstPayment.description || 'Taksit',
      cardName: card?.name || '[Silinmiş Kart]',
      cardColor: card?.color || '#6B7280',
      installmentNumber: firstPayment.installmentNumber,
      totalInstallments: firstPayment.totalInstallments,
      amount: firstPayment.amount,
      dueDate: firstPayment.dueDate
    };
  }).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  const monthName = format(month, 'MMMM yyyy', { locale: tr });
  
  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Aylık Taksit Detayları</h3>
        <p className="text-sm text-gray-600 mt-1">{monthName}</p>
      </div>
      
      {installmentSummary.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-600 text-sm">Bu ayda taksit bulunmamaktadır</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
          {installmentSummary.map((item, index) => (
            <div
              key={`${item.installmentId}-${index}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {/* Card color indicator */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                style={{ backgroundColor: item.cardColor }}
                title={item.cardName}
              />
              
              {/* Installment details */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                  <span>{item.cardName}</span>
                  <span>•</span>
                  <span className="font-semibold">
                    {item.installmentNumber}/{item.totalInstallments}
                  </span>
                </div>
              </div>
              
              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-gray-900 text-sm">
                  {formatCurrency(item.amount)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {format(item.dueDate, 'd MMM', { locale: tr })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {installmentSummary.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Toplam {installmentSummary.length} taksit</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(installmentSummary.reduce((sum, item) => sum + item.amount, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
