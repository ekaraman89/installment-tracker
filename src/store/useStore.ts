/**
 * Zustand store for Installment Tracker application
 * Requirements: 1.1, 1.8, 1.10, 1.11, 1.12, 2.1, 2.8, 2.9, 2.10, 6.1, 7.5, 8.3, 8.6
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Card, Installment, InstallmentPayment, StoreState } from './types';
import { generatePaymentSchedule, isSameDay } from '../utils/dateUtils';

/**
 * Create the Zustand store with persistence
 */
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      cards: [],
      installments: [],
      selectedMonth: new Date(),
      selectedDay: null,
      activeCardFilters: [],

      // Card Actions
      
      /**
       * Add a new card
       * Requirements: 1.1, 1.12
       */
      addCard: (card) => {
        const newCard: Card = {
          ...card,
          id: uuidv4(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          cards: [...state.cards, newCard],
          // Automatically add new card to active filters
          activeCardFilters: [...state.activeCardFilters, newCard.id],
        }));
      },

      /**
       * Update an existing card
       * Requirements: 1.8, 1.12
       */
      updateCard: (id, updates) => {
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id ? { ...card, ...updates } : card
          ),
        }));
      },

      /**
       * Delete a card and cascade to installments
       * Requirements: 1.10, 1.11, 1.12
       */
      deleteCard: (id) => {
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== id),
          // Cascade delete: remove all installments associated with this card
          installments: state.installments.filter((inst) => inst.cardId !== id),
          // Remove from active filters
          activeCardFilters: state.activeCardFilters.filter((cardId) => cardId !== id),
        }));
      },

      // Installment Actions
      
      /**
       * Add a new installment
       * Requirements: 2.1, 2.10
       */
      addInstallment: (installment) => {
        const newInstallment: Installment = {
          ...installment,
          id: uuidv4(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          installments: [...state.installments, newInstallment],
        }));
      },

      /**
       * Update an existing installment
       * Requirements: 2.8, 2.10
       */
      updateInstallment: (id, updates) => {
        set((state) => ({
          installments: state.installments.map((inst) =>
            inst.id === id ? { ...inst, ...updates } : inst
          ),
        }));
      },

      /**
       * Delete an installment
       * Requirements: 2.9, 2.10
       */
      deleteInstallment: (id) => {
        set((state) => ({
          installments: state.installments.filter((inst) => inst.id !== id),
        }));
      },

      // UI State Actions
      
      /**
       * Set the selected month for calendar view
       */
      setSelectedMonth: (date) => {
        set({ selectedMonth: date });
      },

      /**
       * Set the selected day for detail modal
       */
      setSelectedDay: (date) => {
        set({ selectedDay: date });
      },

      /**
       * Toggle card filter on/off
       * Requirements: 7.5
       */
      toggleCardFilter: (cardId) => {
        set((state) => {
          const isActive = state.activeCardFilters.includes(cardId);
          
          return {
            activeCardFilters: isActive
              ? state.activeCardFilters.filter((id) => id !== cardId)
              : [...state.activeCardFilters, cardId],
          };
        });
      },

      // Computed Functions
      
      /**
       * Get all payments for a specific month
       * Requirements: 6.1, 7.5
       */
      getPaymentsForMonth: (month) => {
        const state = get();
        const payments: InstallmentPayment[] = [];
        
        const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
        const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        
        // Filter installments by active card filters
        const filteredInstallments = state.installments.filter((inst) =>
          state.activeCardFilters.includes(inst.cardId)
        );
        
        // Generate payment schedule for each installment
        filteredInstallments.forEach((installment) => {
          const card = state.cards.find(c => c.id === installment.cardId);
          if (!card) return;
          
          const amountPerInstallment = installment.totalAmount / installment.installmentCount;
          
          const schedule = generatePaymentSchedule(
            installment.id,
            installment.cardId,
            card,
            installment.installmentCount,
            amountPerInstallment,
            installment.startMonth,
            installment.description
          );
          
          // Filter payments that fall within the requested month
          const monthPayments = schedule.filter((payment) => {
            return payment.dueDate >= monthStart && payment.dueDate <= monthEnd;
          });
          
          payments.push(...monthPayments);
        });
        
        // Sort by due date
        return payments.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
      },

      /**
       * Get all payments for a specific day
       */
      getPaymentsForDay: (day) => {
        const state = get();
        const payments: InstallmentPayment[] = [];
        
        // Filter installments by active card filters
        const filteredInstallments = state.installments.filter((inst) =>
          state.activeCardFilters.includes(inst.cardId)
        );
        
        // Generate payment schedule for each installment
        filteredInstallments.forEach((installment) => {
          const card = state.cards.find(c => c.id === installment.cardId);
          if (!card) return;
          
          const amountPerInstallment = installment.totalAmount / installment.installmentCount;
          
          const schedule = generatePaymentSchedule(
            installment.id,
            installment.cardId,
            card,
            installment.installmentCount,
            amountPerInstallment,
            installment.startMonth,
            installment.description
          );
          
          // Filter payments that fall on the requested day
          const dayPayments = schedule.filter((payment) =>
            isSameDay(payment.dueDate, day)
          );
          
          payments.push(...dayPayments);
        });
        
        return payments;
      },

      /**
       * Get total payment amount for a month
       * Requirements: 6.1
       */
      getMonthlyTotal: (month) => {
        const payments = get().getPaymentsForMonth(month);
        return payments.reduce((sum, payment) => sum + payment.amount, 0);
      },
    }),
    {
      name: 'installment-tracker-storage',
      
      // Partial persist - only persist data, not UI state
      partialize: (state) => ({
        cards: state.cards,
        installments: state.installments,
        activeCardFilters: state.activeCardFilters,
      }),
      
      // Custom storage to handle Date serialization/deserialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const { state } = JSON.parse(str);
            
            // Convert date strings back to Date objects
            if (state.cards) {
              state.cards = state.cards.map((card: Card) => ({
                ...card,
                createdAt: new Date(card.createdAt),
              }));
            }
            
            if (state.installments) {
              state.installments = state.installments.map((inst: Installment) => ({
                ...inst,
                createdAt: new Date(inst.createdAt),
                startMonth: new Date(inst.startMonth),
              }));
            }
            
            return { state };
          } catch (error) {
            console.error('Error parsing stored data:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
