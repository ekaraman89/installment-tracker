/**
 * MonthlySummary component
 * Requirements: 6.1, 6.2, 6.3, 6.4
 * 
 * Displays monthly total and payment statistics
 */

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatUtils';

interface MonthlySummaryProps {
  month: Date;
  total: number;
  paymentCount: number;
}

export function MonthlySummary({ month, total, paymentCount }: MonthlySummaryProps) {
  // Format month and year in Turkish
  const monthYear = format(month, 'MMMM yyyy', { locale: tr });
  
  return (
    <div className="card bg-gradient-to-br from-blue-50 to-white border border-blue-100 animate-slide-down">
      <div className="space-y-4">
        {/* Month and Year */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {monthYear}
          </h2>
        </div>
        
        {/* Monthly Total */}
        <div className="border-t border-blue-200 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-gray-600">
              Aylık Toplam
            </span>
            <div className="text-right">
              <span className="text-3xl font-bold text-blue-600 block">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Payment Count */}
        <div className="border-t border-blue-200 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-gray-600">
              Ödeme Sayısı
            </span>
            <span className="text-xl font-semibold text-gray-900">
              {paymentCount}
            </span>
          </div>
        </div>
        
        {/* Visual indicator */}
        {total > 0 && (
          <div className="border-t border-blue-200 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Ödeme planı aktif</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
