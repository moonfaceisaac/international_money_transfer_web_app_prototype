
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { Transaction } from '../lib/types'
import { initialTransactions } from '../data/transactions'

type TransactionState = {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            transaction,
            ...state.transactions,
          ],
        })),
    }),
    {
      name: 'inter-transaction-history',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
)
