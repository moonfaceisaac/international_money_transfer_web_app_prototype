
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { Transaction } from '../lib/types'
import { initialTransactions } from '../data/transactions'

type TransactionState = {
  transactions: Transaction[]
  activeTransactionId: string | null
  addTransaction: (transaction: Transaction) => void
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,
      activeTransactionId: null,

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            transaction,
            ...state.transactions,
          ],
          activeTransactionId: transaction.id,
        })),
    }),
    {
      name: 'inter-transaction-history',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
  
)
console.log('Transaction store:', useTransactionStore)
console.log('Persist API:', useTransactionStore.persist)
console.log('Persist methods:', Object.keys(useTransactionStore.persist ?? {}))
