/**
 * Type definitions for the Installment Tracker application
 * Requirements: 1.1, 2.1
 */

/**
 * Card interface representing a credit card
 * Requirement 1.1: Card management with name, billing cycle, and color
 */
export interface Card {
  id: string;
  name: string;
  type: 'credit_card' | 'manual'; // Kredi kartı veya elden taksit
  billingCycleDate?: number; // 1-31, sadece kredi kartları için
  paymentDay?: number; // 1-31, sadece elden taksitler için
  color: string; // hex color code
  createdAt: Date;
}

/**
 * Installment interface representing a purchase with installment payments
 * Requirement 2.1: Installment entry with amount, card, count, and start date
 */
export interface Installment {
  id: string;
  cardId: string;
  totalAmount: number;
  installmentCount: number;
  startMonth: Date; // Taksitlerin başlayacağı ay
  description?: string;
  createdAt: Date;
}

/**
 * InstallmentPayment interface representing a single payment in an installment schedule
 * Used for calendar display and payment tracking
 */
export interface InstallmentPayment {
  installmentId: string;
  cardId: string;
  amount: number;
  dueDate: Date;
  installmentNumber: number; // e.g., 3 of 12
  totalInstallments: number;
}

/**
 * StoreState interface defining the complete application state and actions
 * Requirements: 1.1, 1.8, 1.10, 1.11, 1.12, 2.1, 2.8, 2.9, 2.10, 6.1, 7.5, 8.3, 8.6
 */
export interface StoreState {
  // Data
  cards: Card[];
  installments: Installment[];
  
  // UI State
  selectedMonth: Date;
  selectedDay: Date | null;
  activeCardFilters: string[]; // card IDs
  
  // Card Actions
  addCard: (card: Omit<Card, 'id' | 'createdAt'>) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  
  // Installment Actions
  addInstallment: (installment: Omit<Installment, 'id' | 'createdAt'>) => void;
  updateInstallment: (id: string, updates: Partial<Installment>) => void;
  deleteInstallment: (id: string) => void;
  
  // UI State Actions
  setSelectedMonth: (date: Date) => void;
  setSelectedDay: (date: Date | null) => void;
  toggleCardFilter: (cardId: string) => void;
  
  // Computed Functions
  getPaymentsForMonth: (month: Date) => InstallmentPayment[];
  getPaymentsForDay: (day: Date) => InstallmentPayment[];
  getMonthlyTotal: (month: Date) => number;
}
