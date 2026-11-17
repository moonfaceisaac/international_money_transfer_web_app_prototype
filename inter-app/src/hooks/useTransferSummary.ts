import { useExchangeRates } from './useExchangeRates'
import { banks, ewallets, calculateFee } from '../mock/providers'
import { useTransferStore } from '../stores/transfer.store'
import { convertAmount, formatAmount, parseAmount } from '../lib/utils/money'

export function useTransferSummary() {
  const destination = useTransferStore((state) => state.destination)
  const speed = useTransferStore((state) => state.speed)
  const service = useTransferStore((state) => state.service)
  const providerId = useTransferStore((state) => state.providerId)
  const sendAmountText = useTransferStore((state) => state.sendAmount)
  const receiveAmountText = useTransferStore((state) => state.receiveAmount)
  const lastEdited = useTransferStore((state) => state.lastEdited)

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
  const supported = Boolean(
    destination?.currencyCode &&
    typeof rate === 'number' &&
    Number.isFinite(rate) &&
    rate > 0,
  )

  const providers = service === 'bank' ? banks : ewallets

  const provider =
    providers.find((item) => item.id === providerId) ?? providers[0]

  const enteredSendAmount = parseAmount(sendAmountText)
  const enteredReceiveAmount = parseAmount(receiveAmountText)
  const convertedAmount =
    supported && rate
      ? parseAmount(
          formatAmount(
            convertAmount(
              lastEdited === 'send' ? enteredSendAmount : enteredReceiveAmount,
              rate,
              lastEdited === 'send' ? 'to' : 'from',
            ),
          ),
        )
      : 0
  const sendAmount = lastEdited === 'send' ? enteredSendAmount : convertedAmount
  const receiveAmount =
    lastEdited === 'receive' ? enteredReceiveAmount : convertedAmount

  const fee = calculateFee(provider, speed)
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
