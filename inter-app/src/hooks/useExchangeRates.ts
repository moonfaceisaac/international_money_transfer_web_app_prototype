import { useQuery } from '@tanstack/react-query'
import { getIdrRates } from '../lib/api/exchange-rates'

export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchange-rates', 'IDR'],
    queryFn: ({ signal }) => getIdrRates(signal),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}
