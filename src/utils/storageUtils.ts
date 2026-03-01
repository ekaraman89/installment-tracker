/**
 * LocalStorage utilities for persisting application data
 * Requirements: 8.1, 8.2, 8.4, 8.5, 8.6
 */

export interface Card {
  id: string;
  name: string;
  billingCycleDate: number; // 1-31
  color: string; // hex color code
  createdAt: Date;
}

export interface Installment {
  id: string;
  cardId: string;
  totalAmount: number;
  installmentCount: number;
  startDate: Date;
  description?: string;
  createdAt: Date;
}

export interface StorageData {
  cards: Card[];
  installments: Installment[];
  filters: string[];
}

const STORAGE_KEY = 'installment-tracker-storage';

/**
 * Save data to LocalStorage as JSON
 * Requirements: 8.1, 8.2, 8.6
 */
export function saveToStorage(data: StorageData): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded:', error);
      throw new Error('Depolama alanı dolu. Lütfen eski kayıtları siliniz');
    }
    console.error('Failed to save to LocalStorage:', error);
    throw error;
  }
}

/**
 * Load data from LocalStorage and parse it
 * Requirements: 8.4, 8.5
 */
export function loadFromStorage(): StorageData | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    
    if (!serialized) {
      return null;
    }

    const parsed = JSON.parse(serialized);
    
    // Validate structure
    if (!parsed || typeof parsed !== 'object') {
      console.error('Invalid storage data structure');
      return null;
    }

    // Convert date strings back to Date objects
    const data: StorageData = {
      cards: Array.isArray(parsed.cards) ? parsed.cards.map((card: unknown) => {
        const c = card as Record<string, unknown>;
        return {
          ...c,
          createdAt: new Date(c.createdAt as string),
        } as Card;
      }) : [],
      installments: Array.isArray(parsed.installments) ? parsed.installments.map((inst: unknown) => {
        const i = inst as Record<string, unknown>;
        return {
          ...i,
          startDate: new Date(i.startDate as string),
          createdAt: new Date(i.createdAt as string),
        } as Installment;
      }) : [],
      filters: Array.isArray(parsed.filters) ? parsed.filters : [],
    };

    return data;
  } catch (error) {
    console.error('Failed to load from LocalStorage (corrupted data):', error);
    // Return null for corrupted data - app will initialize with empty state
    return null;
  }
}

/**
 * Clear all data from LocalStorage
 * Requirements: 8.6
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear LocalStorage:', error);
    throw error;
  }
}
