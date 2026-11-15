import { useExchangeRates } from './useExchangeRates'
import { banks, ewallets, calculateFee } from '../mock/providers'
import { useTransferStore } from '../stores/transfer.store'
import { parseAmount } from '../lib/utils/money'

export function useTransferSummary() {
  const destination = useTransferStore((state) => state.destination)
  const speed = useTransferStore((state) => state.speed)
  const service = useTransferStore((state) => state.service)
  const providerId = useTransferStore((state) => state.providerId)
  const sendAmountText = useTransferStore((state) => state.sendAmount)
  const receiveAmountText = useTransferStore((state) => state.receiveAmount)


  const {
    data: rates,
    isLoading: ratesLoading,
    isError: ratesError,
    refetch,
  } = useExchangeRates()

  const rate = destination?.currencyCode
    ? rates?.[destination.currencyCode]
    : undefined

  const currency = destination?.currencyCode ?? '---'
  const supported = Boolean(destination?.currencyCode && rate)

  const providers = service === 'bank' ? banks : ewallets

  const provider =
    providers.find((item) => item.id === providerId) ?? providers[0]


  const sendAmount = parseAmount(sendAmountText)
  const receiveAmount = parseAmount(receiveAmountText)


  const fee = calculateFee(provider, speed, sendAmount)
  const total = sendAmount + fee

  return {
    destination,
    rate,
    currency,
    supported,
    providers,
    provider,
    sendAmount,
    receiveAmount,
    fee,
    total,
    ratesLoading,
    ratesError,
    refetch,
  }
}