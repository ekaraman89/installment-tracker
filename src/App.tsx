/**
 * Main App component - Integrates all components
 * Requirements: 9.1
 */

import { useState } from 'react';
import { useStore } from './store/useStore';
import type { Card, Installment } from './store/types';
import { MonthlySummary } from './components/Dashboard/MonthlySummary';
import { MonthlyInstallmentDetail } from './components/Dashboard/MonthlyInstallmentDetail';
import { CardFilter } from './components/Cards/CardFilter';
import { CardList } from './components/Cards/CardList';
import { InstallmentList } from './components/Installments/InstallmentList';
import { CalendarGrid } from './components/Calendar/CalendarGrid';
import { MonthNavigation } from './components/Calendar/MonthNavigation';
import { CardForm } from './components/Cards/CardForm';
import { InstallmentForm } from './components/Installments/InstallmentForm';
import { DayDetailModal } from './components/Modals/DayDetailModal';

function App() {
  const [showCardForm, setShowCardForm] = useState(false);
  const [showInstallmentForm, setShowInstallmentForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [editingInstallment, setEditingInstallment] = useState<Installment | null>(null);
  
  // Test store
  const { 
    cards, 
    installments, 
    selectedMonth,
    activeCardFilters,
    getPaymentsForMonth,
    getPaymentsForDay,
    getMonthlyTotal,
    toggleCardFilter,
    setSelectedMonth,
    addCard,
    addInstallment,
    updateCard,
    updateInstallment,
    deleteCard,
    deleteInstallment
  } = useStore();

  // Get computed values
  const monthPayments = getPaymentsForMonth(selectedMonth);
  const monthlyTotal = getMonthlyTotal(selectedMonth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Taksit Takip Uygulaması
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Monthly Summary */}
            <MonthlySummary
              month={selectedMonth}
              total={monthlyTotal}
              paymentCount={monthPayments.length}
            />
            
            {/* Monthly Installment Detail */}
            <MonthlyInstallmentDetail
              month={selectedMonth}
              payments={monthPayments}
              cards={cards}
            />
            
            {/* Card Filter */}
            <div className="card">
              <CardFilter
                cards={cards}
                activeFilters={activeCardFilters}
                onToggle={toggleCardFilter}
              />
            </div>
          </aside>

          {/* Main Calendar Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Month Navigation */}
            <MonthNavigation
              currentMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
            
            {/* Calendar */}
            <CalendarGrid
              month={selectedMonth}
              payments={monthPayments}
              cards={cards}
              onDayClick={(date) => setSelectedDay(date)}
            />
            
            {/* Card List */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Kartlarım</h2>
                <button
                  onClick={() => {
                    setEditingCard(null);
                    setShowCardForm(true);
                  }}
                  className="btn-primary btn-sm"
                >
                  + Yeni Kart
                </button>
              </div>
              <CardList
                cards={cards}
                onEdit={(card) => {
                  setEditingCard(card);
                  setShowCardForm(true);
                }}
                onDelete={deleteCard}
              />
            </div>
            
            {/* Installment List */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Taksitlerim</h2>
                <button
                  onClick={() => {
                    setEditingInstallment(null);
                    setShowInstallmentForm(true);
                  }}
                  className="btn-primary btn-sm"
                  disabled={cards.length === 0}
                >
                  + Yeni Taksit
                </button>
              </div>
              <InstallmentList
                installments={installments}
                cards={cards}
                onEdit={(installment) => {
                  setEditingInstallment(installment);
                  setShowInstallmentForm(true);
                }}
                onDelete={deleteInstallment}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Card Form Modal */}
      {showCardForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCard ? 'Kart Düzenle' : 'Yeni Kart Ekle'}
            </h3>
            <CardForm
              card={editingCard || undefined}
              onSubmit={(cardData) => {
                if (editingCard) {
                  updateCard(editingCard.id, cardData);
                } else {
                  addCard(cardData);
                }
                setShowCardForm(false);
                setEditingCard(null);
              }}
              onCancel={() => {
                setShowCardForm(false);
                setEditingCard(null);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Installment Form Modal */}
      {showInstallmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingInstallment ? 'Taksit Düzenle' : 'Yeni Taksit Ekle'}
            </h3>
            <InstallmentForm
              installment={editingInstallment || undefined}
              cards={cards}
              onSubmit={(installmentData) => {
                if (editingInstallment) {
                  updateInstallment(editingInstallment.id, installmentData);
                } else {
                  addInstallment(installmentData);
                }
                setShowInstallmentForm(false);
                setEditingInstallment(null);
              }}
              onCancel={() => {
                setShowInstallmentForm(false);
                setEditingInstallment(null);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Day Detail Modal */}
      {selectedDay && (
        <DayDetailModal
          date={selectedDay}
          payments={getPaymentsForDay(selectedDay)}
          cards={cards}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}

export default App;