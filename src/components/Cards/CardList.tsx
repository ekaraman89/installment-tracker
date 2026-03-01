/**
 * CardList component for displaying and managing credit cards
 * Requirements: 1.1, 1.8, 1.10, 9.3
 */

import type { Card } from '../../store/types';

interface CardListProps {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
}

export function CardList({ cards, onEdit, onDelete }: CardListProps) {
  if (cards.length === 0) {
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
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <p className="text-gray-600 font-medium">Henüz kart eklenmemiş.</p>
        <p className="text-sm mt-2 text-gray-500">Başlamak için yeni bir kart ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="Kredi kartları listesi">
      {cards.map((card) => (
        <div
          key={card.id}
          className="card card-hover flex items-center gap-3 animate-slide-up"
          role="listitem"
        >
          {/* Card color indicator */}
          <div
            className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
            style={{ backgroundColor: card.color }}
            title={card.color}
            aria-label={`Kart rengi: ${card.color}`}
          />

          {/* Card information */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{card.name}</h3>
            <p className="text-sm text-gray-600">
              {card.type === 'credit_card' 
                ? `Hesap kesim: Her ayın ${card.billingCycleDate}. günü`
                : `Ödeme: Her ayın ${card.paymentDay}. günü`
              }
            </p>
            <p className="text-xs text-gray-500">
              {card.type === 'credit_card' ? 'Kredi Kartı' : 'Elden Taksit'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(card)}
              className="btn btn-sm bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-500"
              aria-label={`${card.name} kartını düzenle`}
            >
              Düzenle
            </button>
            <button
              onClick={() => {
                if (window.confirm(`"${card.name}" kartını silmek istediğinizden emin misiniz? Bu karta ait tüm taksitler de silinecektir.`)) {
                  onDelete(card.id);
                }
              }}
              className="btn btn-sm bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-500"
              aria-label={`${card.name} kartını sil`}
            >
              Sil
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
