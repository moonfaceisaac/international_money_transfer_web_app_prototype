import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { useTransferSummary } from '#/hooks/useTransferSummary'
import { useTransferStore } from '../stores/transfer.store'
import { useTransactionStore } from '../stores/transaction.store'
import type { Transaction } from '../lib/types'
import { Header } from '../components/layout/Header'
import { TransferStepper } from '#/components/layout/TransferStepper'

import * as Checkbox from '@radix-ui/react-checkbox'
import {
  allowSuccessForTransaction,
  requireRecipient,
} from '../lib/route-guards'
import { Check, ShieldCheck, X, ArrowRight, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/review')({
  ssr: false,
  beforeLoad: requireRecipient,
  component: ReviewPage,
})

function ReviewPage() {
  const providerId = useTransferStore((state) => state.providerId)
  const setProviderId = useTransferStore((state) => state.setProviderId)
  const recipient = useTransferStore((state) => state.recipient)

  const {
    rate,
    currency,
    supported,
    ratesLoading,
    ratesError,
    refetch,
    providers,
    provider,
    sendAmount,
    receiveAmount,
    fee,
    total,
  } = useTransferSummary()
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAgreed, setIsAgreed] = useState(false)

  const addTransaction = useTransactionStore((state) => state.addTransaction)

  const speed = useTransferStore((state) => state.speed)
  const handleConfirmTransfer = () => {
    if (!isAgreed || !recipient || !supported || !rate) return

    const id = crypto.randomUUID()

    const transaction: Transaction = {
      id,
      reference: `INTER-${id.slice(0, 8).toUpperCase()}`,
      recipientName: recipient.recipientFullName,
      bankName: recipient.recipientBankName,
      accountNumber: recipient.recipientAccountNumber,
      status: 'completed',
      createdAt: new Date().toISOString(),
      sendAmount,
      sendCurrency: 'IDR',
      fee: fee,
      totalPaid: total,
      exchangeRate: rate,
      receiveAmount: receiveAmount,
      receiveCurrency: currency,
      paymentMethod: provider.name,
      purpose: recipient.transferPurpose,
      speed: speed,
    }
    addTransaction(transaction)
    allowSuccessForTransaction(id)

    setIsDialogOpen(false)
    navigate({ to: '/success' })
  }

  const rateStatus = ratesLoading
    ? 'Loading exchange rates...'
    : ratesError
      ? supported
        ? 'Could not refresh exchange rates. Using the last available rate.'
        : 'Exchange rates could not be loaded. Please retry.'
      : !supported
        ? 'This destination currency is not supported by the current exchange-rate provider.'
        : null

  const rateNotice = rateStatus && (
    <p className="text-sm text-red-600" role="status">
      {rateStatus}
      {!ratesLoading && (
        <button
          type="button"
          className="ml-2 font-semibold underline"
          onClick={() => void refetch()}
        >
          Retry
        </button>
      )}
    </p>
  )

  const heading = (
    <div className="w-full">
      <h1 className="m-0 mb-[15px] text-[25px] leading-[1.22] font-extrabold tracking-[-0.5px] md:mb-1 md:text-[clamp(25px,3vw,31px)] md:leading-[1.2] md:tracking-[-0.7px]">
        Check before you send!
      </h1>
      <p className="m-0 mb-6 hidden text-[15px] leading-[1.55] text-gray-700 md:block">
        One last look. Your transfer starts as soon as you confirm and pay. this
        step can't be undone.
      </p>
    </div>
  )

  return (
    <>
      <Header />
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <main className="mx-auto w-[min(100%-40px,520px)] md:w-[min(100%-40px,1400px)]">
          <div className="mx-auto w-full max-w-[720px]">
            <TransferStepper />

            {heading}

            {/* --- TRANSFER DETAILS --- */}
            <section className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Transfer details
                </h2>
              </div>
              <div className="overflow-hidden rounded-[13px] border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">You send</span>
                    <span className="font-semibold">{sendAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transfer fee</span>
                    <span className="font-semibold">{fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Exchange rate</span>
                    <span className="font-semibold">
                      {supported ? rate : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Arrives</span>
                    <span className="font-semibold text-right">Today</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 bg-[#f5f8fc] p-4">
                  <span className="font-bold">Total to pay</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold">{total}</span>
                    <span className="hidden items-center gap-1 rounded-full bg-[#eaf4ff] px-2 py-0.5 text-[10px] font-bold text-[#1970f0] md:flex">
                      <Check size={10} strokeWidth={3} /> No hidden fees
                    </span>
                  </div>
                </div>
              </div>
            </section>
            {rateNotice}

            {/* --- RECIPIENT --- */}
            <section className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Recipient</h2>
              </div>
              <div className="rounded-[13px] border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf4ff] text-sm font-bold text-[#1970f0]">
                      MS
                    </div>
                    <div>
                      <div className="font-semibold">
                        {recipient?.recipientFullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {recipient?.recipientBankName}
                      </div>
                      <div className="mt-1 text-[10px] font-medium text-gray-400 md:hidden">
                        {recipient?.recipientBankName} ·{' '}
                        {recipient?.recipientAccountNumber}
                      </div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-[#e8f5e9] px-2 py-1 text-[10px] font-bold text-[#34a353]">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-4 text-sm">
                  <div className="hidden justify-between md:flex">
                    <span className="text-gray-500">Account number</span>
                    <span className="font-semibold">
                      {recipient?.recipientAccountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purpose</span>
                    <span className="font-semibold">
                      {recipient?.transferPurpose}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-semibold">
                      {recipient?.recipientEmail}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Note</span>
                    <span className="text-right font-semibold">
                      {recipient?.recipientNote}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 bg-[#f5f8fc] p-4">
                    <span className="font-bold">
                      Total will be sent to recipient
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold">
                        {currency} {receiveAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* --- PAY FROM --- */}
            <section className="mb-8">
              <div className="flex flex-col gap-3">
                {/* Emirates NBD (Selected) */}
                <section className="mt-[19px] w-full md:mt-[25px]">
                  <label
                    className="mb-[6px] flex items-center justify-between gap-3 text-[12px] font-extrabold text-gray-900 md:mb-[7px] md:text-[13px]"
                    htmlFor="provider"
                  >
                    Pay From
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
            </section>

            {/* --- CONTINUE BUTTON --- */}
            <div className="mb-8 flex flex-col gap-3">
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-[13px] bg-[#1970f0] font-semibold text-white transition-colors hover:bg-[#125fd2] md:w-auto md:self-start md:px-8"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </Dialog.Trigger>
              <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500 md:justify-start">
                <ShieldCheck size={14} /> You'll confirm the payment with a
                one-time code from your bank
              </p>
            </div>
          </div>
        </main>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-white p-6 shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf4ff] text-[#1970f0]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-bold text-gray-900">
                    Confirm your transfer
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-gray-500">
                    This can't be cancelled later
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close
                aria-label="Close confirmation dialog"
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </Dialog.Close>
            </div>

            <div className="mb-6 flex flex-col gap-4 rounded-xl bg-[#f5f8fc] p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">You send</span>
                <span className="font-semibold">{sendAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transfer fee</span>
                <span className="font-semibold">{fee}</span>
              </div>
              <div className="h-px w-full bg-gray-200"></div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-900">
                  Total to pay
                </span>
                <span className="font-bold text-[#1970f0]">{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Recipient</span>
                <span className="font-semibold">
                  {recipient?.recipientFullName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pay from</span>
                <span className="font-semibold">{provider.name}</span>
              </div>
            </div>

            {rateNotice}

            <div className="mb-6 flex items-start gap-3">
              <Checkbox.Root
                id="terms"
                checked={isAgreed}
                onCheckedChange={(checked) => setIsAgreed(checked === true)}
                className="mt-0.5 flex h-5 w-5 shrink-0 appearance-none items-center justify-center rounded border border-gray-300 bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#1970f0] focus-visible:ring-offset-1 data-[state=checked]:border-[#1970f0] data-[state=checked]:bg-[#1970f0]"
              >
                <Checkbox.Indicator className="text-white">
                  <Check size={14} strokeWidth={3} />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label
                htmlFor="terms"
                className="cursor-pointer text-sm text-gray-600 select-none"
              >
                I understand this transfer can't be cancelled
              </label>
            </div>

            <div className="flex gap-3">
              <Dialog.Close asChild>
                <button className="flex h-11 flex-1 items-center justify-center rounded-[11px] border border-gray-200 font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleConfirmTransfer}
                disabled={!isAgreed || !supported}
                className="flex h-11 flex-[1.5] items-center justify-center gap-2 rounded-[11px] bg-[#1970f0] font-semibold text-white transition-colors hover:bg-[#125fd2] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Yes, send money <ArrowRight size={16} />
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
