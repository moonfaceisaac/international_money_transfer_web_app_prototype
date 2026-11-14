import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, ArrowDownUp, Building2, History, RefreshCw, Send, ShieldCheck, Smartphone } from 'lucide-react'
import { CountryCombobox } from '../components/calculator/CountryCombobox'
import { AmountField } from '../components/calculator/AmountField'
import { TransferSummary } from '../components/calculator/TransferSummary'
import { useExchangeRates } from '../hooks/useExchangeRates'
import { banks, ewallets, calculateFee } from '../mock/providers'
import { transferSchema, type TransferFormValues } from '../schemas/transfer.schema'
import { useTransferStore } from '../stores/transfer.store'
import { convertAmount, formatAmount, formatInputAmount, parseAmount } from '../lib/utils/money'
import type { TransferService, TransferSpeed } from '../lib/types'

export const Route = createFileRoute('/')({ component: CalculatorPage })

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

  const { data: rates, isLoading: ratesLoading, isError: ratesError, refetch } = useExchangeRates()
  const rate = destination?.currencyCode ? rates?.[destination.currencyCode] : undefined
  const supported = Boolean(destination?.currencyCode && rate)
  const providers = service === 'bank' ? banks : ewallets
  const provider = providers.find((item) => item.id === providerId) ?? providers[0]
  const sendAmount = parseAmount(sendAmountText)
  const receiveAmount = parseAmount(receiveAmountText)
  const fee = calculateFee(provider, speed, sendAmount)
  const total = sendAmount + fee

  const { setValue, formState: { errors } } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: { sendAmount: sendAmountText, receiveAmount: receiveAmountText },
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
  }, [destination?.currencyCode, lastEdited, rate, sendAmount, receiveAmount, setDerivedAmount])

  useEffect(() => {
    setValue('sendAmount', sendAmountText, { shouldValidate: true })
    setValue('receiveAmount', receiveAmountText, { shouldValidate: true })
  }, [sendAmountText, receiveAmountText, setValue])

  const [activeField, setActiveField] = useState<'send' | 'receive'>('send')
  const [historyOpen, setHistoryOpen] = useState(false)
  const canContinue = Boolean(destination && supported && sendAmount > 0 && provider)

  const handleSendChange = (value: string) => {
    const formatted = formatInputAmount(value)
    setActiveField('send')
    setValue('sendAmount', formatted, { shouldValidate: true, shouldDirty: true })
    setSendAmount(formatted)
  }

  const handleReceiveChange = (value: string) => {
    const formatted = formatInputAmount(value)
    setActiveField('receive')
    setValue('receiveAmount', formatted, { shouldValidate: true, shouldDirty: true })
    setReceiveAmount(formatted)
  }

  const currency = destination?.currencyCode ?? '---'
  const exchangeLabel = rate
    ? `1 IDR = ${rate.toPrecision(6)} ${currency}`
    : 'Select a supported destination'

  const handleContinue = () => {
    if (!canContinue) return
    window.alert('Page 1 calculator is ready. Recipient and review pages are outside this milestone.')
  }

  const heading = (
    <div className="page-heading">
      <h1 className="page-title">How much are you sending?</h1>
      <p className="page-subtitle">
        Enter an amount in rupiah and we’ll show exactly what lands in your recipient’s account, fees included.
      </p>
    </div>
  )

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <a className="brand" href="/" aria-label="Inter home">
            <span className="brand-mark"><Send size={19} /></span>
            Inter
          </a>
          <button type="button" className="header-history" onClick={() => setHistoryOpen(true)}>
            <History size={16} /> History
          </button>
          <div className="header-right" aria-label="Sending currency">
            <span className="currency-pill neutral">IDR · Indonesia</span>
          </div>
        </div>
      </header>

      <main className="page-shell">
        <div className="mobile-header">
          <button type="button" className="icon-button" aria-label="Back" onClick={() => window.history.back()}>
            <ArrowLeft size={18} />
          </button>
          <h2>Send money</h2>
          <button type="button" className="icon-button" aria-label="History" onClick={() => setHistoryOpen(true)}>
            <History size={18} />
          </button>
        </div>

        <div className="mobile-progress">
          <div className="mobile-progress-top"><span>Step 1 of 3</span><strong>Amount</strong></div>
          <div className="progress-track"><div className="progress-fill" /></div>
        </div>

        <div className="calculator-grid">
          <div className="calculator-main">
            <nav className="steps" aria-label="Transfer progress">
              <span className="step active"><span className="step-number">1</span> Amount</span>
              <span className="step-line" />
              <span className="step"><span className="step-number">2</span> Recipient</span>
              <span className="step-line" />
              <span className="step"><span className="step-number">3</span> Review</span>
            </nav>

            {heading}

            <section className="country-block">
              <label className="field-label">Destination country</label>
              <CountryCombobox value={destination} onChange={setDestination} />
            </section>

            <AmountField
              label="You send"
              value={sendAmountText}
              currency="IDR"
              balance={undefined}
              disabled={!supported}
              active={activeField === 'send'}
              onChange={handleSendChange}
            />

            <div className="swap-row">
              <button
                type="button"
                className="swap-button"
                aria-label="Switch active amount field"
                onClick={() => setActiveField((current) => current === 'send' ? 'receive' : 'send')}
              >
                <ArrowDownUp size={17} />
              </button>
            </div>

            <AmountField
              label="Recipient gets"
              value={receiveAmountText}
              currency={currency}
              status={supported ? 'Rate available' : undefined}
              disabled={!supported}
              active={activeField === 'receive'}
              onChange={handleReceiveChange}
            />

            {destination && !supported && (
              <p className="status-message" role="status">
                {ratesLoading ? 'Loading exchange rates...' : ratesError ? 'Exchange rates could not be loaded. Please retry.' : 'This destination currency is not supported by the current exchange-rate provider.'}
                {ratesError && <button type="button" onClick={() => void refetch()}> Retry</button>}
              </p>
            )}

            <div className="rate-strip">
              <RefreshCw size={14} color="#1970f0" />
              <strong>{exchangeLabel}</strong>
              <span>{ratesLoading ? 'Loading rate...' : ratesError ? 'Rate unavailable' : 'Rate from Frankfurter'}</span>
              <button type="button" onClick={() => void refetch()} disabled={ratesLoading}>Refresh</button>
            </div>

            <section className="option-section">
              <label className="field-label">Transfer speed</label>
              <div className="segmented" role="group" aria-label="Transfer speed">
                <button type="button" aria-pressed={speed === 'instant'} onClick={() => setSpeed('instant' as TransferSpeed)}>
                  Instant <span>~30 minutes</span>
                </button>
                <button type="button" aria-pressed={speed === 'regular'} onClick={() => setSpeed('regular' as TransferSpeed)}>
                  Regular <span>1–2 days</span>
                </button>
              </div>
            </section>

            <section className="option-section">
              <label className="field-label">Delivery method</label>
              <div className="service-grid" role="group" aria-label="Delivery method">
                <button type="button" className={`service-card ${service === 'bank' ? 'selected' : ''}`} aria-pressed={service === 'bank'} onClick={() => setService('bank' as TransferService)}>
                  <span className="service-card-top">
                    <span className="service-icon"><Building2 size={17} /></span>
                    <span className="radio-indicator" />
                  </span>
                  <strong>Bank transfer</strong>
                  <small>Deposit directly into a bank account</small>
                </button>
                <button type="button" className={`service-card ${service === 'ewallet' ? 'selected' : ''}`} aria-pressed={service === 'ewallet'} onClick={() => setService('ewallet' as TransferService)}>
                  <span className="service-card-top">
                    <span className="service-icon"><Smartphone size={17} /></span>
                    <span className="radio-indicator" />
                  </span>
                  <strong>E-wallet</strong>
                  <small>Send to a supported digital wallet</small>
                </button>
              </div>
            </section>

            <section className="option-section">
              <label className="field-label" htmlFor="provider">Receiving provider</label>
              <select
                id="provider"
                className="provider-select"
                value={providerId}
                onChange={(event) => setProviderId(event.target.value)}
              >
                {providers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
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

          {errors.sendAmount?.message && <p className="status-message" role="alert">{errors.sendAmount.message}</p>}
          <button type="button" className="continue-button" disabled={!canContinue} onClick={handleContinue}>
            Continue <ArrowRight size={18} />
          </button>
          <p className="fee-note"><ShieldCheck size={14} /> No hidden fees. Fees are calculated before you continue.</p>
        </div>
      </main>

      {historyOpen && (
        <div role="presentation" onClick={() => setHistoryOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgb(0 0 0 / 45%)', display: 'grid', placeItems: 'center', padding: 20 }}>
          <section role="dialog" aria-modal="true" aria-labelledby="history-title" style={{ width: 'min(100%, 420px)', borderRadius: 16, background: 'white', padding: 22 }} onClick={(event) => event.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 id="history-title">Recent transfers</h2>
              <button type="button" onClick={() => setHistoryOpen(false)} aria-label="Close history">✕</button>
            </div>
            <p className="muted">Local demonstration data only.</p>
            <p>History is a mock feature in this take-home milestone.</p>
          </section>
        </div>
      )}
    </>
  )
}
