export const transferSteps = [
  { id: 'calculator', label: 'Calculator', to: '/' },
  { id: 'recipient', label: 'Recipient', to: '/recipient' },
  { id: 'review', label: 'Review', to: '/review' },
] as const

export type TransferStepId = (typeof transferSteps)[number]['id']

