/**
 * Unit tests for InstallmentList component
 * Requirements: 2.1, 2.8, 2.9
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InstallmentList } from './InstallmentList';
import type { Card, Installment } from '../../store/types';

describe('InstallmentList', () => {
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

  const mockInstallments: Installment[] = [
    {
      id: '1',
      cardId: '1',
      totalAmount: 1200,
      installmentCount: 12,
      startMonth: new Date(),
      description: 'Test Purchase',
      createdAt: new Date(),
    },
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('should render empty state when no installments', () => {
    render(
      <InstallmentList
        installments={[]}
        cards={mockCards}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Henüz taksit eklenmemiş.')).toBeInTheDocument();
  });

  it('should render installment information', () => {
    render(
      <InstallmentList
        installments={mockInstallments}
        cards={mockCards}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('1200.00 TL')).toBeInTheDocument();
    expect(screen.getByText('Test Purchase')).toBeInTheDocument();
    expect(screen.getByText('12 Taksit')).toBeInTheDocument();
    expect(screen.getByText(/Test Card/)).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <InstallmentList
        installments={mockInstallments}
        cards={mockCards}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByText('Düzenle');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockInstallments[0]);
  });

  it('should show deleted card message when card is not found', () => {
    const installmentWithDeletedCard: Installment = {
      ...mockInstallments[0],
      cardId: 'non-existent',
    };

    render(
      <InstallmentList
        installments={[installmentWithDeletedCard]}
        cards={mockCards}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('[Silinmiş Kart]')).toBeInTheDocument();
  });
});
