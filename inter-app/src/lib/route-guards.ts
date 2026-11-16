
import { redirect } from '@tanstack/react-router'

import { useTransferStore } from '../stores/transfer.store'
import { useTransactionStore } from '../stores/transaction.store'
import { parseAmount } from './utils/money'

export function requireTransfer() {
  const { destination, sendAmount } = useTransferStore.getState()

  const amount = parseAmount(sendAmount)

  if (!destination || !Number.isFinite(amount) || amount <= 0) {
    throw redirect({ to: '/' })
  }
}

export function requireRecipient() {
  requireTransfer()

  const { recipient } = useTransferStore.getState()

  if (!recipient) {
    throw redirect({ to: '/recipient' })
  }
}

export async function requireCompletedTransaction() {
 
  if (typeof window === 'undefined') return

  await useTransactionStore.persist.rehydrate()

  const { activeTransactionId, transactions } =
    useTransactionStore.getState()

  const hasActiveTransaction = transactions.some(
    (transaction) => transaction.id === activeTransactionId,
  )

  if (!activeTransactionId || !hasActiveTransaction) {
    throw redirect({ to: '/' })
  }
}