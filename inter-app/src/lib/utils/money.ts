export function parseAmount(value: string) {
  const normalized = value.replaceAll(',', '').trim()
  if (!normalized) return 0
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatAmount(value: number, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) return ''
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value)
}

export function formatInputAmount(value: string) {
  const digits = value.replace(/[^0-9.]/g, '')
  const [integerPart = '', ...decimalParts] = digits.split('.')
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimalParts.length
    ? `${groupedInteger}.${decimalParts.join('').slice(0, 2)}`
    : groupedInteger
}

export function convertAmount(amount: number, idrRate: number, direction: 'to' | 'from') {
  if (!Number.isFinite(amount) || !Number.isFinite(idrRate) || idrRate <= 0) {
    return 0
  }

  return direction === 'to' ? amount * idrRate : amount / idrRate
}
