import { redirect } from '@tanstack/react-router'

import { useTransferStore } from '../stores/transfer.store'
import { useTransactionStore } from '../stores/transaction.store'
import { parseAmount } from './utils/money'

export async function requireTransfer() {
  if (typeof window === 'undefined') return
  if (!useTransferStore.persist.hasHydrated()) {
    await useTransferStore.persist.rehydrate()
  }

  const { destination, sendAmount } = useTransferStore.getState()

  const amount = parseAmount(sendAmount)

  if (!destination || !Number.isFinite(amount) || amount <= 0) {
    throw redirect({ to: '/' })
  }
}

export async function requireRecipient() {
  await requireTransfer()
  if (typeof window === 'undefined') return

  const { recipient } = useTransferStore.getState()

  if (!recipient) {
    throw redirect({ to: '/recipient' })
  }
}

let pendingSuccessTransactionId: string | null = null

export function allowSuccessForTransaction(id: string) {
  pendingSuccessTransactionId = id
}

export function requireCompletedTransaction() {
  if (typeof window === 'undefined') return

  const confirmedId = pendingSuccessTransactionId
  pendingSuccessTransactionId = null
  const { activeTransactionId, transactions } = useTransactionStore.getState()

  if (
    !confirmedId ||
    activeTransactionId !== confirmedId ||
    !transactions.some((transaction) => transaction.id === confirmedId)
  ) {
    throw redirect({ to: '/' })
  }
}
