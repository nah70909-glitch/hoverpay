import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Txn {
  id: string;
  name: string;
  date: string;
  amount: number;
  status: string;
}

interface AppState {
  balance: number;
  transactions: Txn[];
  addTransaction: (txn: Omit<Txn, 'id'>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      balance: 154500, // ₹1,54,500 initial balance
      transactions: [
        { id: '1', name: 'Zomato', date: 'Yesterday, 8:30 PM', amount: 850, status: 'Success' },
        { id: '2', name: 'Ramesh Kirana', date: 'Oct 24, 10:15 AM', amount: 1200, status: 'Success' },
      ],
      addTransaction: (txn) => set((state) => ({
        balance: state.balance - txn.amount,
        transactions: [{ ...txn, id: Date.now().toString() }, ...state.transactions]
      })),
    }),
    { 
      name: 'hoverpay-storage',
      // skip hydration error by only using store after mount in components
    }
  )
);
