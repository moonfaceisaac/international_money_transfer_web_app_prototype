import type { ExchangeRate } from '../types'

const RATES_API = 'https://api.frankfurter.dev/v2/rates?base=idr'

export async function getIdrRates(signal?: AbortSignal) {
  const response = await fetch(RATES_API, { signal })

  if (!response.ok) {
    throw new Error(`Exchange-rate service returned ${response.status}`)
  }

  const rates = (await response.json()) as ExchangeRate[]

  return rates.reduce<Record<string, number>>((lookup, item) => {
    if (item.base === 'IDR' && Number.isFinite(item.rate) && item.rate > 0) {
      lookup[item.quote] = item.rate
    }

    return lookup
  }, {})
}
