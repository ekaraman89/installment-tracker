/**
 * CardForm component for creating and editing credit cards
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.8, 9.5, 9.6
 */

import { useState } from 'react';
import type { Card } from '../../store/types';
import { calculatePaymentDueDate, calculateManualPaymentDate, formatDate } from '../../utils/dateUtils';

interface CardFormProps {
  card?: Card; // undefined for create, defined for edit
  onSubmit: (card: Omit<Card, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function CardForm({ card, onSubmit, onCancel }: CardFormProps) {
  const [name, setName] = useState(card?.name || '');
  const [type, setType] = useState<'credit_card' | 'manual'>(card?.type || 'credit_card');
  const [billingCycleDate, setBillingCycleDate] = useState(
    card?.billingCycleDate?.toString() || ''
  );
  const [paymentDay, setPaymentDay] = useState(
    card?.paymentDay?.toString() || ''
  );
  const [color, setColor] = useState(card?.color || '#3b82f6');
  const [errors, setErrors] = useState<{ 
    name?: string; 
    billingCycleDate?: string; 
    paymentDay?: string; 
  }>({});

  // Calculate payment preview
  const paymentPreview = (() => {
    if (type === 'credit_card' && billingCycleDate) {
      const cycleDate = parseInt(billingCycleDate);
      if (cycleDate >= 1 && cycleDate <= 31) {
        try {
          const dueDate = calculatePaymentDueDate(cycleDate, new Date());
          return `Ödeme tarihi: ${formatDate(dueDate)}`;
        } catch {
          return null;
        }
      }
    } else if (type === 'manual' && paymentDay) {
      const day = parseInt(paymentDay);
      if (day >= 1 && day <= 31) {
        try {
          const dueDate = calculateManualPaymentDate(day, new Date());
          return `Ödeme tarihi: ${formatDate(dueDate)}`;
        } catch {
          return null;
        }
      }
    }
    return null;
  })();

  const validate = (): boolean => {
    const newErrors: { name?: string; billingCycleDate?: string; paymentDay?: string } = {};

    // Validate name is not empty
    if (!name.trim()) {
      newErrors.name = 'Kart adı boş olamaz';
    }

    if (type === 'credit_card') {
      // Validate billing cycle date is between 1-31
      const cycleDate = parseInt(billingCycleDate);
      if (!billingCycleDate || isNaN(cycleDate) || cycleDate < 1 || cycleDate > 31) {
        newErrors.billingCycleDate = 'Hesap kesim tarihi 1-31 arasında olmalıdır';
      }
    } else if (type === 'manual') {
      // Validate payment day is between 1-31
      const day = parseInt(paymentDay);
      if (!paymentDay || isNaN(day) || day < 1 || day > 31) {
        newErrors.paymentDay = 'Ödeme günü 1-31 arasında olmalıdır';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const cardData: Omit<Card, 'id' | 'createdAt'> = {
      name: name.trim(),
      type,
      color,
    };

    if (type === 'credit_card') {
      cardData.billingCycleDate = parseInt(billingCycleDate);
    } else {
      cardData.paymentDay = parseInt(paymentDay);
    }

    onSubmit(cardData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-down">
      <div>
        <label htmlFor="card-name" className="label">
          Kart Adı
        </label>
        <input
          id="card-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`input ${errors.name ? 'input-error' : ''}`}
          placeholder="Örn: Akbank Kredi Kartı"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'card-name-error' : undefined}
        />
        {errors.name && (
          <p id="card-name-error" className="error-message" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="label">Kart Türü</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="card-type"
              value="credit_card"
              checked={type === 'credit_card'}
              onChange={(e) => setType(e.target.value as 'credit_card')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-900">Kredi Kartı</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="card-type"
              value="manual"
              checked={type === 'manual'}
              onChange={(e) => setType(e.target.value as 'manual')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-900">Elden Taksit</span>
          </label>
        </div>
      </div>

      {type === 'credit_card' && (
        <div>
          <label htmlFor="billing-cycle" className="label">
            Hesap Kesim Tarihi (Ayın Günü)
          </label>
          <input
            id="billing-cycle"
            type="number"
            min="1"
            max="31"
            value={billingCycleDate}
            onChange={(e) => setBillingCycleDate(e.target.value)}
            className={`input ${errors.billingCycleDate ? 'input-error' : ''}`}
            placeholder="1-31 arası bir gün"
            aria-invalid={!!errors.billingCycleDate}
            aria-describedby={errors.billingCycleDate ? 'billing-cycle-error' : paymentPreview ? 'billing-cycle-help' : undefined}
          />
          {errors.billingCycleDate && (
            <p id="billing-cycle-error" className="error-message" role="alert">
              {errors.billingCycleDate}
            </p>
          )}
          {paymentPreview && !errors.billingCycleDate && (
            <p id="billing-cycle-help" className="mt-1 text-sm text-gray-600">
              {paymentPreview}
            </p>
          )}
        </div>
      )}

      {type === 'manual' && (
        <div>
          <label htmlFor="payment-day" className="label">
            Ödeme Günü (Ayın Günü)
          </label>
          <input
            id="payment-day"
            type="number"
            min="1"
            max="31"
            value={paymentDay}
            onChange={(e) => setPaymentDay(e.target.value)}
            className={`input ${errors.paymentDay ? 'input-error' : ''}`}
            placeholder="1-31 arası bir gün"
            aria-invalid={!!errors.paymentDay}
            aria-describedby={errors.paymentDay ? 'payment-day-error' : paymentPreview ? 'payment-day-help' : undefined}
          />
          {errors.paymentDay && (
            <p id="payment-day-error" className="error-message" role="alert">
              {errors.paymentDay}
            </p>
          )}
          {paymentPreview && !errors.paymentDay && (
            <p id="payment-day-help" className="mt-1 text-sm text-gray-600">
              {paymentPreview}
            </p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="card-color" className="label">
          Kart Rengi
        </label>
        <div className="flex items-center gap-3">
          <input
            id="card-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-20 rounded cursor-pointer border border-gray-300 transition-transform hover:scale-105"
            aria-label="Kart rengi seçici"
          />
          <div
            className="h-10 w-10 rounded border border-gray-300 shadow-sm transition-transform hover:scale-105"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          <span className="text-sm text-gray-600">{color}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="btn-primary flex-1"
        >
          {card ? 'Güncelle' : 'Kaydet'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
