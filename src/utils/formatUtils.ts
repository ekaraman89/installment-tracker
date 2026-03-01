/**
 * Formatting utilities for Turkish localization
 * Requirements: 9.6, 10.5
 */

/**
 * Format currency amount in Turkish Lira
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the TL symbol (default: true)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, showSymbol: boolean = true): string {
  // Format with 2 decimal places and Turkish number format
  const formatted = amount.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return showSymbol ? `${formatted} TL` : formatted;
}

/**
 * Format date in Turkish format (DD/MM/YYYY)
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Format month and year in Turkish
 * @param date - The date to format
 * @returns Formatted month and year string (e.g., "Ocak 2024")
 */
export function formatMonthYear(date: Date): string {
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${month} ${year}`;
}

/**
 * Format day name in Turkish
 * @param dayIndex - Day index (0 = Monday, 6 = Sunday)
 * @returns Turkish day name
 */
export function formatDayName(dayIndex: number): string {
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  return days[dayIndex] || '';
}

/**
 * Format day name (short) in Turkish
 * @param dayIndex - Day index (0 = Monday, 6 = Sunday)
 * @returns Turkish day name (short)
 */
export function formatDayNameShort(dayIndex: number): string {
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  return days[dayIndex] || '';
}
