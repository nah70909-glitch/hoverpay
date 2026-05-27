import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Txn {
  id: string;
  name: string;
  date: string;
  amount: number;
  status: string;
  category?: string;
  method?: string;
  fraudScore?: number;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'active' | 'paused';
  autoPay: boolean;
  category: string;
}

export interface Wearable {
  id: string;
  name: string;
  type: 'watch' | 'ring' | 'band';
  battery: number;
  connected: boolean;
}

export interface LinkedCard {
  id: string;
  bank: string;
  last4: string;
  type: 'debit' | 'credit';
  expiry: string;
  brand: 'Visa' | 'Mastercard' | 'RuPay';
  color: string;
}

interface AppState {
  balance: number;
  transactions: Txn[];
  subscriptions: Subscription[];
  wearables: Wearable[];
  cards: LinkedCard[];
  settings: {
    voiceEnabled: boolean;
    offlineMode: boolean;
    bleScanning: boolean;
    biometricLevel: 'none' | 'face' | 'finger';
    ambientRange: number; // in meters
    riskThreshold: number; // in %
  };
  addTransaction: (txn: Omit<Txn, 'id'>) => void;
  addFunds: (amount: number) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  toggleSubscriptionAutoPay: (id: string) => void;
  toggleWearableConnection: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      balance: 154500, // ₹1,54,500 initial balance
      transactions: [
        { id: '1', name: 'Starbucks Coffee', date: 'Today, 08:30 AM', amount: 340, status: 'Success', category: 'Food & Beverage', method: 'Hover Gesture', fraudScore: 0.01 },
        { id: '2', name: 'Zara Fashion', date: 'Yesterday, 07:15 PM', amount: 4890, status: 'Success', category: 'Shopping', method: 'NFC Ring Tap', fraudScore: 0.02 },
        { id: '3', name: 'Reliance Supermart', date: 'May 25, 02:30 PM', amount: 1850, status: 'Success', category: 'Groceries', method: 'Standard QR Scan', fraudScore: 0.05 },
        { id: '4', name: 'Metro Ride Gate 4', date: 'May 24, 08:45 AM', amount: 45, status: 'Success', category: 'Transit', method: 'Express Metro Gate Bypass', fraudScore: 0.01 }
      ],
      subscriptions: [
        { id: 'sub-1', name: 'Netflix Premium', amount: 649, dueDate: 'June 05, 2026', status: 'active', autoPay: true, category: 'Entertainment' },
        { id: 'sub-2', name: 'Spotify Premium Family', amount: 179, dueDate: 'June 12, 2026', status: 'active', autoPay: true, category: 'Entertainment' },
        { id: 'sub-3', name: 'HoverTransit Metro Pass', amount: 1200, dueDate: 'June 20, 2026', status: 'active', autoPay: false, category: 'Transit' },
        { id: 'sub-4', name: 'Cult.Fit Gym Elite', amount: 2450, dueDate: 'July 01, 2026', status: 'paused', autoPay: false, category: 'Health' }
      ],
      wearables: [
        { id: 'w-1', name: 'HoverRing Active Gold', type: 'ring', battery: 88, connected: true },
        { id: 'w-2', name: 'HoverWatch Pro Black', type: 'watch', battery: 92, connected: true }
      ],
      cards: [
        { id: 'c-1', bank: 'HDFC Bank', last4: '4092', type: 'debit', expiry: '09/31', brand: 'Visa', color: 'from-zinc-900 to-zinc-950' },
        { id: 'c-2', bank: 'ICICI Bank', last4: '8812', type: 'credit', expiry: '04/30', brand: 'Mastercard', color: 'from-zinc-900 to-indigo-950' }
      ],
      settings: {
        voiceEnabled: true,
        offlineMode: false,
        bleScanning: true,
        biometricLevel: 'face',
        ambientRange: 1.5,
        riskThreshold: 1.2
      },
      addTransaction: (txn) => set((state) => ({
        balance: state.balance - txn.amount,
        transactions: [
          { 
            ...txn, 
            id: Date.now().toString(),
            fraudScore: txn.fraudScore ?? parseFloat((Math.random() * 0.05).toFixed(3))
          }, 
          ...state.transactions
        ]
      })),
      addFunds: (amount) => set((state) => ({ balance: state.balance + amount })),
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      toggleSubscriptionAutoPay: (id) => set((state) => ({
        subscriptions: state.subscriptions.map(sub => 
          sub.id === id ? { ...sub, autoPay: !sub.autoPay } : sub
        )
      })),
      toggleWearableConnection: (id) => set((state) => ({
        wearables: state.wearables.map(w => 
          w.id === id ? { ...w, connected: !w.connected } : w
        )
      }))
    }),
    { 
      name: 'hoverpay-storage-v2',
    }
  )
);
