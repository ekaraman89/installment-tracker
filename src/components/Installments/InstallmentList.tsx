/**
 * InstallmentList component for displaying and managing installments
 * Requirements: 2.1, 2.8, 2.9
 */

import type { Card, Installment } from '../../store/types';
import { formatCurrency } from '../../utils/formatUtils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface InstallmentListProps {
  installments: Installment[];
  cards: Card[];
  onEdit: (installment: Installment) => void;
  onDelete: (installmentId: string) => void;
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
      {installments.map((installment) => {
        const card = cardMap.get(installment.cardId);
        const amountPerInstallment = installment.totalAmount / installment.installmentCount;

        return (
          <div
            key={installment.id}
            className="card card-hover flex items-start gap-3 animate-slide-up"
            role="listitem"
          >
            {/* Card color indicator */}
            {card && (
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 mt-1 shadow-sm"
                style={{ backgroundColor: card.color }}
                title={card.name}
                aria-label={`Kart: ${card.name}`}
              />
            )}

            {/* Installment information */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {formatCurrency(installment.totalAmount)}
                  </h3>
                  {installment.description && (
                    <p className="text-sm text-gray-600 mt-0.5">{installment.description}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {installment.installmentCount} Taksit
                  </span>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Kart:</span>{' '}
                  {card ? card.name : <span className="text-red-600">[Silinmiş Kart]</span>}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Aylık ödeme:</span> {formatCurrency(amountPerInstallment)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Başlangıç:</span> {format(installment.startMonth, 'MMMM yyyy', { locale: tr })}
                </p>
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
