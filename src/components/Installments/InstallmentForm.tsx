/**
 * InstallmentForm component for creating and editing installments
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 9.5, 9.6
 */

import { useState } from 'react';
import type { Card, Installment } from '../../store/types';
import { generatePaymentSchedule, formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';
import { format } from 'date-fns';

interface InstallmentFormProps {
  installment?: Installment; // undefined for create, defined for edit
  cards: Card[];
  onSubmit: (installment: Omit<Installment, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function InstallmentForm({ installment, cards, onSubmit, onCancel }: InstallmentFormProps) {
  const [totalAmount, setTotalAmount] = useState(
    installment?.totalAmount?.toString() || ''
  );
  const [installmentCount, setInstallmentCount] = useState(
    installment?.installmentCount?.toString() || ''
  );
  const [cardId, setCardId] = useState(installment?.cardId || '');
  const [description, setDescription] = useState(installment?.description || '');
  
  // Default to current month, or use existing installment's start month
  const [startMonth, setStartMonth] = useState(() => {
    if (installment?.startMonth) {
      return format(installment.startMonth, 'yyyy-MM');
    }
    return format(new Date(), 'yyyy-MM');
  });
  
  const [errors, setErrors] = useState<{
    totalAmount?: string;
    installmentCount?: string;
    cardId?: string;
    startMonth?: string;
  }>({});

  // Calculate payment schedule preview
  const paymentSchedulePreview = (() => {
    const amount = parseFloat(totalAmount);
    const count = parseInt(installmentCount);
    const card = cards.find(c => c.id === cardId);

    if (amount > 0 && count > 0 && card && startMonth) {
      try {
        const amountPerInstallment = amount / count;
        const startDate = new Date(startMonth + '-01'); // Convert YYYY-MM to Date
        const schedule = generatePaymentSchedule(
          'preview',
          cardId,
          card,
          Math.min(count, 3), // Show first 3 payments
          amountPerInstallment,
          startDate
        );
        return schedule;
      } catch {
        return null;
      }
    }
    return null;
  })();

  const validate = (): boolean => {
    const newErrors: {
      totalAmount?: string;
      installmentCount?: string;
      cardId?: string;
      startMonth?: string;
    } = {};

    // Validate amount is positive
    const amount = parseFloat(totalAmount);
    if (!totalAmount || isNaN(amount) || amount <= 0) {
      newErrors.totalAmount = 'Tutar pozitif bir sayı olmalıdır';
    }

    // Validate installment count is positive integer
    const count = parseInt(installmentCount);
    if (!installmentCount || isNaN(count) || count <= 0 || !Number.isInteger(count)) {
      newErrors.installmentCount = 'Taksit sayısı pozitif bir tam sayı olmalıdır';
    }

    // Validate card is selected
    if (!cardId) {
      newErrors.cardId = 'Lütfen bir kart seçiniz';
    }

    // Validate start month is selected
    if (!startMonth) {
      newErrors.startMonth = 'Lütfen başlangıç ayını seçiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      totalAmount: parseFloat(totalAmount),
      installmentCount: parseInt(installmentCount),
      cardId,
      startMonth: new Date(startMonth + '-01'), // Convert YYYY-MM to Date
      description: description.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-down">
      <div>
        <label htmlFor="installment-amount" className="label">
          Toplam Tutar (TL)
        </label>
        <input
          id="installment-amount"
          type="number"
          step="0.01"
          min="0"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          className={`input ${errors.totalAmount ? 'input-error' : ''}`}
          placeholder="Örn: 5000"
          aria-invalid={!!errors.totalAmount}
          aria-describedby={errors.totalAmount ? 'amount-error' : undefined}
        />
        {errors.totalAmount && (
          <p id="amount-error" className="error-message" role="alert">
            {errors.totalAmount}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="installment-count" className="label">
          Taksit Sayısı
        </label>
        <input
          id="installment-count"
          type="number"
          min="1"
          step="1"
          value={installmentCount}
          onChange={(e) => setInstallmentCount(e.target.value)}
          className={`input ${errors.installmentCount ? 'input-error' : ''}`}
          placeholder="Örn: 12"
          aria-invalid={!!errors.installmentCount}
          aria-describedby={errors.installmentCount ? 'count-error' : 'count-help'}
        />
        {errors.installmentCount && (
          <p id="count-error" className="error-message" role="alert">
            {errors.installmentCount}
          </p>
        )}
        {totalAmount && installmentCount && !errors.totalAmount && !errors.installmentCount && (
          <p id="count-help" className="mt-1 text-sm text-gray-600">
            Aylık ödeme: {formatCurrency(parseFloat(totalAmount) / parseInt(installmentCount))}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="installment-card" className="label">
          Kart
        </label>
        <select
          id="installment-card"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          className={`input ${errors.cardId ? 'input-error' : ''}`}
          aria-invalid={!!errors.cardId}
          aria-describedby={errors.cardId ? 'card-error' : cards.length === 0 ? 'card-warning' : undefined}
        >
          <option value="">Kart seçiniz</option>
          {cards.map((card) => (
            <option key={card.id} value={card.id}>
              {card.name} ({card.type === 'credit_card' ? 'Kredi Kartı' : 'Elden Taksit'})
            </option>
          ))}
        </select>
        {errors.cardId && (
          <p id="card-error" className="error-message" role="alert">
            {errors.cardId}
          </p>
        )}
        {cards.length === 0 && (
          <p id="card-warning" className="mt-1 text-sm text-yellow-600" role="alert">
            Önce bir kart eklemelisiniz
          </p>
        )}
      </div>

      <div>
        <label htmlFor="start-month" className="label">
          Başlangıç Ayı
        </label>
        <input
          id="start-month"
          type="month"
          value={startMonth}
          onChange={(e) => setStartMonth(e.target.value)}
          className={`input ${errors.startMonth ? 'input-error' : ''}`}
          aria-invalid={!!errors.startMonth}
          aria-describedby={errors.startMonth ? 'start-month-error' : 'start-month-help'}
        />
        {errors.startMonth && (
          <p id="start-month-error" className="error-message" role="alert">
            {errors.startMonth}
          </p>
        )}
        {!errors.startMonth && (
          <p id="start-month-help" className="mt-1 text-sm text-gray-600">
            Taksitlerin başlayacağı ay
          </p>
        )}
      </div>

      <div>
        <label htmlFor="installment-description" className="label">
          Açıklama (Opsiyonel)
        </label>
        <input
          id="installment-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
          placeholder="Örn: Laptop alışverişi"
        />
      </div>

      {/* Payment schedule preview */}
      {paymentSchedulePreview && paymentSchedulePreview.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 animate-fade-in">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Ödeme Planı Önizlemesi (İlk 3 Taksit)
          </h4>
          <div className="space-y-1">
            {paymentSchedulePreview.map((payment) => (
              <div key={payment.installmentNumber} className="text-sm text-blue-800">
                {payment.installmentNumber}. Taksit: {formatCurrency(payment.amount)} - {formatDate(payment.dueDate)}
              </div>
            ))}
            {parseInt(installmentCount) > 3 && (
              <div className="text-sm text-blue-600 italic">
                ... ve {parseInt(installmentCount) - 3} taksit daha
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={cards.length === 0}
          aria-label={installment ? 'Taksiti güncelle' : 'Taksiti kaydet'}
        >
          {installment ? 'Güncelle' : 'Kaydet'}
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