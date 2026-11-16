import type { TransferProvider } from '../lib/types'

export const banks: TransferProvider[] = [
  { id: 'bca', name: 'BCA', fees: { instant: 35000, regular: 15000 } },
  { id: 'mandiri', name: 'Bank Mandiri', fees: { instant: 30000, regular: 12000 } },
  { id: 'bni', name: 'BNI', fees: { instant: 30000, regular: 12000 } },
  { id: 'bri', name: 'BRI', fees: { instant: 30000, regular: 12000 } },
]

export const ewallets: TransferProvider[] = [
  { id: 'gopay', name: 'GoPay', fees: { instant: 25000, regular: 10000 } },
  { id: 'ovo', name: 'OVO', fees: { instant: 25000, regular: 10000 } },
  { id: 'dana', name: 'DANA', fees: { instant: 20000, regular: 10000 } },
  { id: 'linkaja', name: 'LinkAja', fees: { instant: 20000, regular: 10000 } },
]

export function calculateFee(
  provider: TransferProvider | undefined,
  speed: 'instant' | 'regular',
) {
  if (!provider) return 0
  return provider.fees[speed]
}
