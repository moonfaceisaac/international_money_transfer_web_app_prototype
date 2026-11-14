export type MockTransaction = {
  id: string
  destination: string
  currency: string
  sentAmountIdr: number
  receivedAmount: number
  status: 'completed' | 'processing' | 'failed'
  createdAt: string
}

export const transactions: MockTransaction[] = [
  {
    id: 'TRX-2026-001',
    destination: 'Philippines',
    currency: 'PHP',
    sentAmountIdr: 1_000_000,
    receivedAmount: 5720,
    status: 'completed',
    createdAt: '2026-11-12T09:30:00.000Z',
  },
  {
    id: 'TRX-2026-002',
    destination: 'Singapore',
    currency: 'SGD',
    sentAmountIdr: 2_500_000,
    receivedAmount: 202.5,
    status: 'processing',
    createdAt: '2026-11-10T14:15:00.000Z',
  },
]
