import { createFileRoute } from '@tanstack/react-router'
import { useEffect,useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowRight,
  ArrowDownUp,
  Building2,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { CountryCombobox } from '../components/calculator/CountryCombobox'
import { AmountField } from '../components/calculator/AmountField'
import { TransferSummary } from '../components/calculator/TransferSummary'
import { useExchangeRates } from '../hooks/useExchangeRates'
import { banks, ewallets, calculateFee } from '../mock/providers'
import { transferSchema } from '../schemas/transfer.schema'
import type { TransferFormValues } from '../schemas/transfer.schema'
import { useTransferStore } from '../stores/transfer.store'
import {
  convertAmount,
  formatAmount,
  formatInputAmount,
  parseAmount,
} from '../lib/utils/money'

import { Header } from '../components/layout/Header'

export const Route = createFileRoute('/')({ component: CalculatorPage })

const fieldLabelClassName =
  'mb-[6px] flex items-center justify-between gap-3 text-[12px] font-extrabold text-gray-900 md:mb-[7px] md:text-[13px]'
const speedOptionClassName =
  'min-h-[49px] rounded-pill border border-transparent bg-transparent text-[12px] font-extrabold text-gray-700 aria-pressed:border-gray-100 aria-pressed:bg-white aria-pressed:text-gray-900 aria-pressed:shadow-segment md:min-h-[42px] md:text-[14px]'
const deliveryOptionClassName =
  'group grid min-h-[58px] grid-cols-[32px_1fr_20px] items-center gap-[10px] rounded-control border border-gray-100 bg-white px-3 py-[9px] text-left text-gray-900 aria-pressed:border-[1.5px] aria-pressed:border-primary-500 aria-pressed:bg-surface-selected aria-pressed:px-[11.5px] aria-pressed:py-[8.5px] contrast-more:border-gray-700 md:flex md:min-h-[120px] md:flex-col md:items-stretch md:gap-2 md:p-[14px] md:aria-pressed:p-[13.5px]'
const deliveryIndicatorClassName =
  'col-start-3 row-span-2 row-start-1 size-[19px] rounded-full border-[1.5px] border-blue-200 group-aria-pressed:border-2 group-aria-pressed:border-primary-600 group-aria-pressed:bg-primary-600 group-aria-pressed:shadow-[inset_0_0_0_4px_white]'

function CalculatorPage() {
  const destination = useTransferStore((state) => state.destination)
  const speed = useTransferStore((state) => state.speed)
  const service = useTransferStore((state) => state.service)
  const providerId = useTransferStore((state) => state.providerId)
  const sendAmountText = useTransferStore((state) => state.sendAmount)
  const receiveAmountText = useTransferStore((state) => state.receiveAmount)
  const lastEdited = useTransferStore((state) => state.lastEdited)
  const setDestination = useTransferStore((state) => state.setDestination)
  const setSpeed = useTransferStore((state) => state.setSpeed)
  const setService = useTransferStore((state) => state.setService)
  const setProviderId = useTransferStore((state) => state.setProviderId)
  const setSendAmount = useTransferStore((state) => state.setSendAmount)
  const setReceiveAmount = useTransferStore((state) => state.setReceiveAmount)
  const setDerivedAmount = useTransferStore((state) => state.setDerivedAmount)

  const {
    data: rates,
    isLoading: ratesLoading,
    isError: ratesError,
    refetch,
  } = useExchangeRates()
  const rate = destination?.currencyCode
    ? rates?.[destination.currencyCode]
    : undefined
  const supported = Boolean(destination?.currencyCode && rate)
  const providers = service === 'bank' ? banks : ewallets
  const provider =
    providers.find((item) => item.id === providerId) ?? providers[0]
  const sendAmount = parseAmount(sendAmountText)
  const receiveAmount = parseAmount(receiveAmountText)
  const fee = calculateFee(provider, speed, sendAmount)
  const total = sendAmount + fee


  const {
    setValue,
    formState: { errors },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sendAmount: sendAmountText,
      receiveAmount: receiveAmountText,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (!rate || !destination?.currencyCode) {
      setDerivedAmount(lastEdited, '')
      return
    }

    if (lastEdited === 'send') {
      const converted = convertAmount(sendAmount, rate, 'to')
      setDerivedAmount('send', converted > 0 ? formatAmount(converted) : '')
    } else {
      const converted = convertAmount(receiveAmount, rate, 'from')
      setDerivedAmount('receive', converted > 0 ? formatAmount(converted) : '')
    }
  }, [
    destination?.currencyCode,
    lastEdited,
    rate,
    sendAmount,
    receiveAmount,
    setDerivedAmount,
  ])

  useEffect(() => {
    setValue('sendAmount', sendAmountText, { shouldValidate: true })
    setValue('receiveAmount', receiveAmountText, { shouldValidate: true })
  }, [sendAmountText, receiveAmountText, setValue])

  const [activeField, setActiveField] = useState<'send' | 'receive'>('send')
  const canContinue = Boolean(
    destination && supported && sendAmount > 0 && provider,
  )

  const handleSendChange = (value: string) => {
    const formatted = formatInputAmount(value)
    setActiveField('send')
    setValue('sendAmount', formatted, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setSendAmount(formatted)
  }

  const handleReceiveChange = (value: string) => {
    const formatted = formatInputAmount(value)
    setActiveField('receive')
    setValue('receiveAmount', formatted, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setReceiveAmount(formatted)
  }

  const currency = destination?.currencyCode ?? '---'
  const exchangeLabel = rate
    ? `1 IDR = ${rate.toPrecision(6)} ${currency}`
    : 'Select a supported destination'

  const handleContinue = () => {
    if (!canContinue) return
    window.alert(
      'Page 1 calculator is ready. Recipient and review pages are outside this milestone.',
    )
  }

  const heading = (
    <div className="w-full">
      <h1 className="m-0 mb-[15px] text-[25px] leading-[1.22] font-extrabold tracking-[-0.5px] md:mb-1 md:text-[clamp(25px,3vw,31px)] md:leading-[1.2] md:tracking-[-0.7px]">
        How much are you sending?
      </h1>
      <p className="m-0 mb-6 hidden text-[15px] leading-[1.55] text-gray-700 md:block">
        Enter an amount in rupiah and we’ll show exactly what lands in your
        recipient’s account, fees included.
      </p>
    </div>
  )

  return (
    <>
      <Header/>
      <main className="mx-auto w-[min(100%-40px,520px)] md:w-[min(100%-40px,1400px)]">
        <div className="mb-5 md:hidden">
          <div className="mb-2 flex justify-between text-[12px] text-gray-400">
            <span>Step 1 of 3</span>
            <strong className="text-primary-600">Amount</strong>
          </div>
          <div className="h-1 overflow-hidden rounded-[99px] bg-gray-100">
            <div className="h-full w-[33.333%] rounded-[inherit] bg-primary-600" />
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-[19px] pt-0 pb-7 md:grid md:grid-cols-[minmax(0,1fr)_382px] md:items-start md:gap-[52px] md:pt-[38px] md:pb-14">
          <div className="contents min-w-0 md:block">
            <nav
              className="mb-6 hidden items-center gap-[10px] text-gray-400 md:flex"
              aria-label="Transfer progress"
            >
              <span className="inline-flex items-center gap-2 rounded-[99px] border border-primary-500 py-1 pr-[10px] pl-1 text-[13px] whitespace-nowrap text-primary-600">
                <span className="grid size-[22px] place-items-center rounded-full bg-primary-500 text-[11px] font-extrabold text-white">
                  1
                </span>{' '}
                Amount
              </span>
              <span className="h-px w-[22px] bg-blue-200" />
              <span className="inline-flex items-center gap-2 text-[13px] whitespace-nowrap">
                <span className="grid size-[22px] place-items-center rounded-full bg-gray-100 text-[11px] font-extrabold text-gray-500">
                  2
                </span>{' '}
                Recipient
              </span>
              <span className="h-px w-[22px] bg-blue-200" />
              <span className="inline-flex items-center gap-2 text-[13px] whitespace-nowrap">
                <span className="grid size-[22px] place-items-center rounded-full bg-gray-100 text-[11px] font-extrabold text-gray-500">
                  3
                </span>{' '}
                Review
              </span>
            </nav>

            {heading}

            <section className="w-full">
              <label
                className={fieldLabelClassName}
                htmlFor="destination-country"
              >
                Destination country
              </label>
              <CountryCombobox value={destination} onChange={setDestination} />
            </section>

            <AmountField
              label="You send"
              variant="send"
              value={sendAmountText}
              currency="IDR"
              disabled={!supported}
              active={activeField === 'send'}
              onChange={handleSendChange}
            />

            <div className="mt-[7px] flex h-[34px] items-center">
              <button
                type="button"
                className="grid size-9 place-items-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-control"
                aria-label="Switch active amount field"
                onClick={() =>
                  setActiveField((current) =>
                    current === 'send' ? 'receive' : 'send',
                  )
                }
              >
                <ArrowDownUp size={17} />
              </button>
            </div>

            <AmountField
              label="Recipient gets"
              value={receiveAmountText}
              variant="receive"
              currency={currency}
              status={supported ? 'Rate available' : undefined}
              disabled={!supported}
              active={activeField === 'receive'}
              onChange={handleReceiveChange}
            />

            {destination && !supported && (
              <p className="mt-2 text-[12px] text-red-500" role="status">
                {ratesLoading
                  ? 'Loading exchange rates...'
                  : ratesError
                    ? 'Exchange rates could not be loaded. Please retry.'
                    : 'This destination currency is not supported by the current exchange-rate provider.'}
                {ratesError && (
                  <button type="button" onClick={() => void refetch()}>
                    {' '}
                    Retry
                  </button>
                )}
              </p>
            )}

            <div className="mt-[17px] flex min-h-9 w-full items-center gap-2 rounded-[10px] bg-surface px-[11px] py-[7px] text-[11px] text-gray-400 md:mt-6 md:min-h-[39px] md:px-[13px] md:py-2 md:text-[12px]">
              <RefreshCw size={14} className="shrink-0 text-primary-600" />
              <strong className="font-extrabold text-gray-900">
                {exchangeLabel}
              </strong>
              <span>
                {ratesLoading
                  ? 'Loading rate...'
                  : ratesError
                    ? 'Rate unavailable'
                    : 'Rate from Frankfurter'}
              </span>
              <button
                type="button"
                className="ml-auto border-0 bg-transparent font-bold text-primary-600"
                onClick={() => void refetch()}
                disabled={ratesLoading}
              >
                Refresh
              </button>
            </div>

            <section className="mt-[19px] w-full md:mt-[25px]">
              <label className={fieldLabelClassName}>Transfer speed</label>
              <div
                className="grid grid-cols-2 gap-[5px] rounded-xl bg-surface p-1"
                role="group"
                aria-label="Transfer speed"
              >
                <button
                  type="button"
                  className={speedOptionClassName}
                  aria-pressed={speed === 'instant'}
                  onClick={() => setSpeed('instant')}
                >
                  Instant{' '}
                  <span className="ml-0 block text-[11px] font-medium text-gray-400 md:ml-[7px] md:inline md:text-[12px]">
                    ~30 minutes
                  </span>
                </button>
                <button
                  type="button"
                  className={speedOptionClassName}
                  aria-pressed={speed === 'regular'}
                  onClick={() => setSpeed('regular')}
                >
                  Regular{' '}
                  <span className="ml-0 block text-[11px] font-medium text-gray-400 md:ml-[7px] md:inline md:text-[12px]">
                    1–2 days
                  </span>
                </button>
              </div>
            </section>

            <section className="mt-[19px] w-full md:mt-[25px]">
              <label className={fieldLabelClassName}>Delivery method</label>
              <div
                className="grid grid-cols-1 gap-[7px] md:grid-cols-2 md:gap-[10px]"
                role="group"
                aria-label="Delivery method"
              >
                <button
                  type="button"
                  className={deliveryOptionClassName}
                  aria-pressed={service === 'bank'}
                  onClick={() => setService('bank')}
                >
                  <span className="contents items-center justify-between md:flex">
                    <span className="row-span-2 grid size-8 place-items-center rounded-pill bg-surface-icon text-primary-600">
                      <Building2 size={17} />
                    </span>
                    <span className={deliveryIndicatorClassName} />
                  </span>
                  <strong className="self-end text-[13px] font-extrabold md:self-auto md:text-[14px]">
                    Bank transfer
                  </strong>
                  <small className="self-start text-[11px] text-gray-400 md:self-auto md:text-[12px]">
                    Deposit directly into a bank account
                  </small>
                </button>
                <button
                  type="button"
                  className={deliveryOptionClassName}
                  aria-pressed={service === 'ewallet'}
                  onClick={() => setService('ewallet')}
                >
                  <span className="contents items-center justify-between md:flex">
                    <span className="row-span-2 grid size-8 place-items-center rounded-pill bg-surface-icon text-primary-600">
                      <Smartphone size={17} />
                    </span>
                    <span className={deliveryIndicatorClassName} />
                  </span>
                  <strong className="self-end text-[13px] font-extrabold md:self-auto md:text-[14px]">
                    E-wallet
                  </strong>
                  <small className="self-start text-[11px] text-gray-400 md:self-auto md:text-[12px]">
                    Send to a supported digital wallet
                  </small>
                </button>
              </div>
            </section>

            <section className="mt-[19px] w-full md:mt-[25px]">
              <label className={fieldLabelClassName} htmlFor="provider">
                Receiving provider
              </label>
              <select
                id="provider"
                className="min-h-[45px] w-full rounded-[10px] border border-gray-100 bg-white px-[13px] py-0 text-[13px] text-gray-900 contrast-more:border-gray-700 md:min-h-12 md:text-[14px]"
                value={providerId}
                onChange={(event) => setProviderId(event.target.value)}
              >
                {providers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </section>
          </div>

          <TransferSummary
            sendAmount={sendAmount}
            receiveAmount={receiveAmount}
            fee={fee}
            total={total}
            currency={currency}
            rate={rate}
            supported={supported}
          />

          {errors.sendAmount?.message && (
            <p className="mt-2 text-[12px] text-red-500" role="alert">
              {errors.sendAmount.message}
            </p>
          )}
          <button
            type="button"
            className="order-3 mt-0 flex min-h-[54px] w-full items-center justify-center gap-[10px] rounded-[11px] border-0 bg-primary-600 text-[14px] font-extrabold text-white enabled:hover:bg-primary-hover disabled:opacity-50 md:order-none md:mt-6 md:min-h-[53px] md:w-[268px]"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            Continue <ArrowRight size={18} />
          </button>
          <p className="order-4 mt-[-9px] flex items-center justify-center gap-[7px] text-[11px] text-gray-400 md:order-none md:mt-[13px] md:justify-start md:text-[12px]">
            <ShieldCheck size={14} /> No hidden fees. Fees are calculated before
            you continue.
          </p>
        </div>
      </main>
    </>
  )
}
