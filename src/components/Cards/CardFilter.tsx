/**
 * CardFilter component for filtering calendar view by cards
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.7
 */

import type { Card } from '../../store/types';

interface CardFilterProps {
  cards: Card[];
  activeFilters: string[]; // card IDs
  onToggle: (cardId: string) => void;
}

export function CardFilter({ cards, activeFilters, onToggle }: CardFilterProps) {
  if (cards.length === 0) {
    return (
      <div className="empty-state py-4">
        <p className="text-sm">Filtrelenecek kart bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Kartlara Göre Filtrele</h3>
      
      <div role="group" aria-label="Kart filtreleri">
        {cards.map((card) => {
          const isActive = activeFilters.includes(card.id);
          
          return (
            <label
              key={card.id}
              className="flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => onToggle(card.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded transition-colors focus:ring-2 focus:ring-blue-500"
                aria-label={`${card.name} kartını ${isActive ? 'gizle' : 'göster'}`}
              />
              
              {/* Card color indicator */}
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm transition-transform hover:scale-110"
                style={{ backgroundColor: card.color }}
                title={card.color}
                aria-hidden="true"
              />
              
              {/* Card name */}
              <span className="text-sm text-gray-900 flex-1 truncate">
                {card.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
