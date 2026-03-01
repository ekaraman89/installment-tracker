/**
 * Unit tests for InstallmentForm component
 * Requirements: 2.2, 2.3, 2.4, 2.5
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InstallmentForm } from './InstallmentForm';
import type { Card } from '../../store/types';

describe('InstallmentForm', () => {
  const mockCards: Card[] = [
    {
      id: '1',
      name: 'Test Card',
      type: 'credit_card',
      billingCycleDate: 15,
      color: '#3b82f6',
      createdAt: new Date(),
    },
  ];

  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it('should render form fields', () => {
    render(
      <InstallmentForm
        cards={mockCards}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/Toplam Tutar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Taksit Sayısı/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kart/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Başlangıç Ayı/i)).toBeInTheDocument();
  });

  it('should show error when amount is invalid', () => {
    render(
      <InstallmentForm
        cards={mockCards}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByText('Kaydet');
    fireEvent.click(submitButton);

    expect(screen.getByText('Tutar pozitif bir sayı olmalıdır')).toBeInTheDocument();
  });

  it('should show error when installment count is invalid', () => {
    render(
      <InstallmentForm
        cards={mockCards}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const amountInput = screen.getByLabelText(/Toplam Tutar/i);
    fireEvent.change(amountInput, { target: { value: '1000' } });

    const submitButton = screen.getByText('Kaydet');
    fireEvent.click(submitButton);

    expect(screen.getByText('Taksit sayısı pozitif bir tam sayı olmalıdır')).toBeInTheDocument();
  });

  it('should show error when no card is selected', () => {
    render(
      <InstallmentForm
        cards={mockCards}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const amountInput = screen.getByLabelText(/Toplam Tutar/i);
    const countInput = screen.getByLabelText(/Taksit Sayısı/i);
    
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(countInput, { target: { value: '12' } });

    const submitButton = screen.getByText('Kaydet');
    fireEvent.click(submitButton);

    expect(screen.getByText('Lütfen bir kart seçiniz')).toBeInTheDocument();
  });

  it('should show error when no start month is provided', () => {
    render(
      <InstallmentForm
        cards={mockCards}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const amountInput = screen.getByLabelText(/Toplam Tutar/i);
    const countInput = screen.getByLabelText(/Taksit Sayısı/i);
    const cardSelect = screen.getByLabelText(/Kart/i);
    const startMonthInput = screen.getByLabelText(/Başlangıç Ayı/i);
    
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(countInput, { target: { value: '12' } });
    fireEvent.change(cardSelect, { target: { value: '1' } });
    fireEvent.change(startMonthInput, { target: { value: '' } }); // Clear the default value

    const submitButton = screen.getByText('Kaydet');
    fireEvent.click(submitButton);

    expect(screen.getByText('Lütfen başlangıç ayını seçiniz')).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <InstallmentForm
        cards={mockCards}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('İptal');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
