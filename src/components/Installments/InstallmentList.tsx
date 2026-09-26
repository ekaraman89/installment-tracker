/**
 * InstallmentList component for displaying and managing installments
 * Requirements: 2.1, 2.8, 2.9
 */

import type { Card, Installment } from '../../store/types';
import { formatCurrency } from '../../utils/formatUtils';
import { format, addMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { calculatePaymentDueDate, calculateManualPaymentDate } from '../../utils/dateUtils';

interface InstallmentListProps {
  installments: Installment[];
  cards: Card[];
  onEdit: (installment: Installment) => void;
  onDelete: (installmentId: string) => void;
}

/**
 * Calculate how many installments have been paid (due date has passed)
 * by comparing each installment's due date with the current date.
 */
function getPaymentProgress(
  installment: Installment,
  card: Card | undefined
): { paid: number; total: number; isCompleted: boolean } {
  const total = installment.installmentCount;
  if (!card) return { paid: 0, total, isCompleted: false };

  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today — consider today's payments as paid

  let paidCount = 0;
  for (let i = 0; i < installment.installmentCount; i++) {
    const targetMonth = addMonths(installment.startMonth, i);
    let dueDate: Date | null = null;

    if (card.type === 'credit_card' && card.billingCycleDate) {
      dueDate = calculatePaymentDueDate(card.billingCycleDate, targetMonth);
    } else if (card.type === 'manual' && card.paymentDay) {
      dueDate = calculateManualPaymentDate(card.paymentDay, targetMonth);
    }

    if (dueDate && dueDate <= today) {
      paidCount++;
    } else {
      break; // Payments are sequential; no need to check further
    }
  }

  return {
    paid: paidCount,
    total,
    isCompleted: paidCount >= total,
  };
}

export function InstallmentList({ installments, cards, onEdit, onDelete }: InstallmentListProps) {
  // Create a map for quick card lookup
  const cardMap = new Map(cards.map((card) => [card.id, card]));

  if (installments.length === 0) {
    return (
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
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-600 font-medium">Henüz taksit eklenmemiş.</p>
        <p className="text-sm mt-2 text-gray-500">Başlamak için yeni bir taksit ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="Taksitler listesi">
      {[...installments]
        .map((installment) => {
          const card = cardMap.get(installment.cardId);
          const progress = getPaymentProgress(installment, card);
          return { installment, card, progress };
        })
        .sort((a, b) => Number(a.progress.isCompleted) - Number(b.progress.isCompleted))
        .map(({ installment, card, progress }) => {
        const amountPerInstallment = installment.totalAmount / installment.installmentCount;
        const progressPercent = Math.round((progress.paid / progress.total) * 100);

        return (
          <div
            key={installment.id}
            className={`card card-hover flex items-start gap-3 animate-slide-up transition-opacity duration-300 ${
              progress.isCompleted ? 'bg-green-50/50 border border-green-200' : ''
            }`}
            role="listitem"
          >
            {/* Card color indicator */}
            {card && (
              <div
                className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 shadow-sm ${
                  progress.isCompleted ? 'ring-2 ring-green-300' : ''
                }`}
                style={{ backgroundColor: card.color }}
                title={card.name}
                aria-label={`Kart: ${card.name}`}
              />
            )}

            {/* Installment information */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className={`font-medium ${progress.isCompleted ? 'text-gray-500' : 'text-gray-900'}`}>
                    {formatCurrency(installment.totalAmount)}
                  </h3>
                  {installment.description && (
                    <p className={`text-sm mt-0.5 ${progress.isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                      {installment.description}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  {progress.isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Tamamlandı
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {installment.installmentCount} Taksit
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <p className={`text-sm ${progress.isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="font-medium">Kart:</span>{' '}
                  {card ? card.name : <span className="text-red-600">[Silinmiş Kart]</span>}
                </p>
                <p className={`text-sm ${progress.isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="font-medium">Aylık ödeme:</span> {formatCurrency(amountPerInstallment)}
                </p>
                <p className={`text-sm ${progress.isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="font-medium">Başlangıç:</span> {format(installment.startMonth, 'MMMM yyyy', { locale: tr })}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={progress.isCompleted ? 'text-green-600 font-medium' : 'text-gray-600'}>
                    {progress.paid}/{progress.total} taksit ödendi
                  </span>
                  <span className={progress.isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'}>
                    %{progressPercent}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      progress.isCompleted
                        ? 'bg-green-500'
                        : progress.paid > 0
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                    role="progressbar"
                    aria-valuenow={progress.paid}
                    aria-valuemin={0}
                    aria-valuemax={progress.total}
                    aria-label={`${progress.paid} / ${progress.total} taksit ödendi`}
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(installment)}
                className="btn btn-sm bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-500"
                aria-label="Taksiti düzenle"
              >
                Düzenle
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Bu taksiti silmek istediğinizden emin misiniz?')) {
                    onDelete(installment.id);
                  }
                }}
                className="btn btn-sm bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-500"
                aria-label="Taksiti sil"
              >
                Sil
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
