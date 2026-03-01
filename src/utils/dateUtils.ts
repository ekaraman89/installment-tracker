import { addMonths, addDays, format, getDaysInMonth as dateFnsGetDaysInMonth, isSameDay as dateFnsIsSameDay } from 'date-fns';
import { isHoliday } from './holidayCalendar';

/**
 * Check if a date is a business day (not weekend and not a holiday)
 * @param date - The date to check
 * @returns true if the date is a business day, false otherwise
 */
export function isBusinessDay(date: Date): boolean {
  const dayOfWeek = date.getDay();
  
  // Check if weekend (Saturday = 6, Sunday = 0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  
  // Check if holiday
  if (isHoliday(date)) {
    return false;
  }
  
  return true;
}

/**
 * Get the next business day after the given date
 * @param date - The starting date
 * @returns The next business day
 */
export function getNextBusinessDay(date: Date): Date {
  let nextDay = addDays(date, 1);
  let iterations = 0;
  const MAX_ITERATIONS = 30; // Prevent infinite loops
  
  while (!isBusinessDay(nextDay) && iterations < MAX_ITERATIONS) {
    nextDay = addDays(nextDay, 1);
    iterations++;
  }
  
  if (iterations >= MAX_ITERATIONS) {
    throw new Error('Could not find next business day within 30 days');
  }
  
  return nextDay;
}

/**
 * Calculate payment due date for credit cards: billing cycle date + 10 business days
 * @param billingCycleDate - Day of month (1-31) when billing cycle occurs
 * @param month - The month to calculate for
 * @returns The payment due date
 */
export function calculatePaymentDueDate(billingCycleDate: number, month: Date): Date {
  // Clamp billing cycle date to valid range
  const clampedDate = Math.max(1, Math.min(31, billingCycleDate));
  
  // Get the actual billing date for this month (handle non-existent dates)
  const daysInMonth = dateFnsGetDaysInMonth(month);
  const actualBillingDate = Math.min(clampedDate, daysInMonth);
  
  // Create the billing date
  let currentDate = new Date(month.getFullYear(), month.getMonth(), actualBillingDate);
  
  // Add 10 business days
  let businessDaysAdded = 0;
  let iterations = 0;
  const MAX_ITERATIONS = 50; // Prevent infinite loops
  
  while (businessDaysAdded < 10 && iterations < MAX_ITERATIONS) {
    currentDate = addDays(currentDate, 1);
    
    if (isBusinessDay(currentDate)) {
      businessDaysAdded++;
    }
    
    iterations++;
  }
  
  if (iterations >= MAX_ITERATIONS) {
    throw new Error('Could not calculate payment due date within 50 days');
  }
  
  return currentDate;
}

/**
 * Calculate payment date for manual installments: specific day of month
 * @param paymentDay - Day of month (1-31) when payment is due
 * @param month - The month to calculate for
 * @returns The payment date
 */
export function calculateManualPaymentDate(paymentDay: number, month: Date): Date {
  // Clamp payment day to valid range
  const clampedDay = Math.max(1, Math.min(31, paymentDay));
  
  // Get the actual payment date for this month (handle non-existent dates)
  const daysInMonth = dateFnsGetDaysInMonth(month);
  const actualPaymentDay = Math.min(clampedDay, daysInMonth);
  
  return new Date(month.getFullYear(), month.getMonth(), actualPaymentDay);
}

/**
 * Interface for installment payment information
 */
export interface InstallmentPayment {
  installmentId: string;
  cardId: string;
  amount: number;
  dueDate: Date;
  installmentNumber: number;
  totalInstallments: number;
}

/**
 * Generate payment schedule for an installment
 * @param installmentId - ID of the installment
 * @param cardId - ID of the card
 * @param card - Card object with payment info
 * @param installmentCount - Number of installments
 * @param amountPerInstallment - Amount per installment
 * @param startMonth - The month to start payments from
 * @returns Array of installment payments
 */
export function generatePaymentSchedule(
  installmentId: string,
  cardId: string,
  card: { type: 'credit_card' | 'manual'; billingCycleDate?: number; paymentDay?: number },
  installmentCount: number,
  amountPerInstallment: number,
  startMonth?: Date
): InstallmentPayment[] {
  const payments: InstallmentPayment[] = [];
  const baseMonth = startMonth || new Date();
  
  for (let i = 0; i < installmentCount; i++) {
    let dueDate: Date;
    
    // Calculate the target month (start month + i)
    const targetMonth = addMonths(baseMonth, i);
    
    if (card.type === 'credit_card' && card.billingCycleDate) {
      // For credit cards: billing cycle + 10 business days
      dueDate = calculatePaymentDueDate(card.billingCycleDate, targetMonth);
    } else if (card.type === 'manual' && card.paymentDay) {
      // For manual installments: specific day of month
      dueDate = calculateManualPaymentDate(card.paymentDay, targetMonth);
    } else {
      throw new Error('Invalid card configuration for payment schedule generation');
    }
    
    payments.push({
      installmentId,
      cardId,
      amount: amountPerInstallment,
      dueDate,
      installmentNumber: i + 1,
      totalInstallments: installmentCount,
    });
  }
  
  return payments;
}

/**
 * Get all days in a month as an array of dates
 * @param date - Any date within the target month
 * @returns Array of dates for each day in the month
 */
export function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysCount = dateFnsGetDaysInMonth(date);
  
  const days: Date[] = [];
  for (let day = 1; day <= daysCount; day++) {
    days.push(new Date(year, month, day));
  }
  
  return days;
}

/**
 * Check if two dates are the same day (ignoring time)
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if dates are the same day, false otherwise
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return dateFnsIsSameDay(date1, date2);
}

/**
 * Format date as DD/MM/YYYY
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}
