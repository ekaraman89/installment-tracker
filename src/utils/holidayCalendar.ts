/**
 * Turkish Public Holiday Calendar
 * Contains official holidays for 2024 and 2025
 */

// Turkish public holidays for 2024 and 2025
export const TURKISH_HOLIDAYS: Date[] = [
  // 2024 Holidays
  new Date(2024, 0, 1),   // Yılbaşı (New Year's Day)
  
  // Ramazan Bayramı 2024 (Eid al-Fitr) - 3 days
  new Date(2024, 3, 10),  // April 10
  new Date(2024, 3, 11),  // April 11
  new Date(2024, 3, 12),  // April 12
  
  new Date(2024, 3, 23),  // Ulusal Egemenlik ve Çocuk Bayramı (National Sovereignty and Children's Day)
  new Date(2024, 4, 1),   // Emek ve Dayanışma Günü (Labour Day)
  new Date(2024, 4, 19),  // Atatürk'ü Anma, Gençlik ve Spor Bayramı (Commemoration of Atatürk, Youth and Sports Day)
  
  // Kurban Bayramı 2024 (Eid al-Adha) - 4 days
  new Date(2024, 5, 16),  // June 16
  new Date(2024, 5, 17),  // June 17
  new Date(2024, 5, 18),  // June 18
  new Date(2024, 5, 19),  // June 19
  
  new Date(2024, 6, 15),  // Demokrasi ve Millî Birlik Günü (Democracy and National Unity Day)
  new Date(2024, 7, 30),  // Zafer Bayramı (Victory Day)
  new Date(2024, 9, 29),  // Cumhuriyet Bayramı (Republic Day)
  
  // 2025 Holidays
  new Date(2025, 0, 1),   // Yılbaşı (New Year's Day)
  
  // Ramazan Bayramı 2025 (Eid al-Fitr) - 3 days
  new Date(2025, 2, 30),  // March 30
  new Date(2025, 2, 31),  // March 31
  new Date(2025, 3, 1),   // April 1
  
  new Date(2025, 3, 23),  // Ulusal Egemenlik ve Çocuk Bayramı (National Sovereignty and Children's Day)
  new Date(2025, 4, 1),   // Emek ve Dayanışma Günü (Labour Day)
  new Date(2025, 4, 19),  // Atatürk'ü Anma, Gençlik ve Spor Bayramı (Commemoration of Atatürk, Youth and Sports Day)
  
  // Kurban Bayramı 2025 (Eid al-Adha) - 4 days
  new Date(2025, 5, 6),   // June 6
  new Date(2025, 5, 7),   // June 7
  new Date(2025, 5, 8),   // June 8
  new Date(2025, 5, 9),   // June 9
  
  new Date(2025, 6, 15),  // Demokrasi ve Millî Birlik Günü (Democracy and National Unity Day)
  new Date(2025, 7, 30),  // Zafer Bayramı (Victory Day)
  new Date(2025, 9, 29),  // Cumhuriyet Bayramı (Republic Day)
];

/**
 * Check if a given date is a Turkish public holiday
 * @param date - The date to check
 * @returns true if the date is a holiday, false otherwise
 */
export function isHoliday(date: Date): boolean {
  return TURKISH_HOLIDAYS.some(holiday => 
    holiday.getFullYear() === date.getFullYear() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getDate() === date.getDate()
  );
}
