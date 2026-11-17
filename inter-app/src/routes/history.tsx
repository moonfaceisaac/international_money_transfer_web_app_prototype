import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Header } from '../components/layout/Header'

import { Plus, CheckCircle2, Circle, ChevronDown } from 'lucide-react'

import { useTransactionStore } from '../stores/transaction.store'
import type { Transaction, TransactionStatus } from '../lib/types'

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

type Filter = 'all' | TransactionStatus

const filters: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
]

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function getStatusLabel(status: TransactionStatus) {
  switch (status) {
    case 'in_progress':
      return 'In progress'
    case 'completed':
      return 'Completed'
    case 'failed':
      return 'Failed'
  }
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles: Record<TransactionStatus, string> = {
    in_progress: 'bg-primary-soft text-primary-600',
    completed: 'bg-green-50 text-green-700',
    failed: 'bg-red-50 text-red-500',
  }

  return (
    <span
      className={`inline-flex items-center gap-[5px] whitespace-nowrap rounded-full px-[10px] py-[5px] text-[10px] font-extrabold ${styles[status]}`}
    >
      <span className="size-[5px] rounded-full bg-current" />
      {getStatusLabel(status)}
    </span>
  )
}

function TransferProgress({ status }: { status: TransactionStatus }) {
  if (status === 'failed') {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-[11px] font-bold text-red-500">
        This transfer could not be completed.
      </p>
    )
  }

  const completed = status === 'completed'

  return (
    <div className="flex items-center rounded-[11px] bg-surface px-3 py-3">
      <div className="flex shrink-0 items-center gap-1.5">
        <CheckCircle2 size={16} className="fill-green-500 text-white" />
        <span className="text-[10px] font-bold text-gray-700">Paid</span>
      </div>

      <div className="mx-2 h-[2px] min-w-2 flex-1 bg-green-500" />

      <div className="flex shrink-0 items-center gap-1.5">
        {completed ? (
          <CheckCircle2 size={16} className="fill-green-500 text-white" />
        ) : (
          <span className="grid size-4 place-items-center rounded-full bg-primary-600 text-[9px] font-bold text-white">
            2
          </span>
        )}
        <span className="text-[10px] font-semibold text-gray-500">
          Processing
        </span>
      </div>

      <div
        className={`mx-2 h-[2px] min-w-2 flex-1 ${
          completed ? 'bg-green-500' : 'bg-gray-100'
        }`}
      />

      <div className="flex shrink-0 items-center gap-1.5">
        {completed ? (
          <CheckCircle2 size={16} className="fill-green-500 text-white" />
        ) : (
          <Circle size={16} className="text-gray-200" />
        )}
        <span className="text-[10px] text-gray-400">Delivered</span>
      </div>
    </div>
  )
}

function TransactionCard({
  transaction,
  expanded,
  onToggle,
}: {
  transaction: Transaction
  expanded: boolean
  onToggle: () => void
}) {
  const initials = transaction.recipientName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <article
      className={`overflow-hidden border-b border-gray-100 last:border-b-0 ${
        expanded ? 'bg-surface-selected' : 'bg-white'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-surface md:grid-cols-[minmax(0,2fr)_minmax(105px,0.8fr)_minmax(100px,0.7fr)_minmax(120px,1fr)] md:px-5"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-[36px] shrink-0 place-items-center rounded-full bg-surface text-[11px] font-extrabold text-gray-500">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[12px] font-extrabold text-gray-950">
              {transaction.recipientName}
            </p>
            <p className="truncate text-[10px] text-gray-400">
              {transaction.bankName} · {transaction.accountNumber}
            </p>
            <div className="mt-2 md:hidden">
              <StatusBadge status={transaction.status} />
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <StatusBadge status={transaction.status} />
        </div>

        <p className="hidden text-[11px] text-gray-700 md:block">
          {formatDate(transaction.createdAt)}
        </p>

        <div className="flex items-center justify-end gap-2">
          <div className="text-right">
            <p className="whitespace-nowrap text-[12px] font-extrabold text-gray-950">
              −{formatMoney(transaction.sendAmount, transaction.sendCurrency)}
            </p>
            <p className="text-[10px] text-gray-400">
              {transaction.status === 'failed'
                ? 'Refunded'
                : formatMoney(
                    transaction.receiveAmount,
                    transaction.receiveCurrency,
                  )}
            </p>
          </div>

          <ChevronDown
            size={15}
            className={`shrink-0 text-gray-400 transition-transform md:hidden ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </div>

        <p className="col-span-2 pl-[48px] text-[10px] text-gray-400 md:hidden">
          {formatDate(transaction.createdAt)}
        </p>
      </button>

      {expanded && (
        <div className="px-4 pb-4 md:px-[60px]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-bold text-gray-900">
              Transfer {transaction.reference}
              <span className="font-medium text-gray-400">
                {' '}
                · {transaction.speed} transfer
              </span>
            </p>
          </div>

          <TransferProgress status={transaction.status} />

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-3">
            <Detail
              label="YOU SENT"
              value={formatMoney(
                transaction.sendAmount,
                transaction.sendCurrency,
              )}
            />

            <Detail
              label="FEE"
              value={formatMoney(transaction.fee, transaction.sendCurrency)}
            />

            <Detail
              label="TOTAL PAID"
              value={formatMoney(
                transaction.totalPaid,
                transaction.sendCurrency,
              )}
            />

            <Detail
              label="RATE"
              value={`1 ${transaction.sendCurrency} = ${transaction.exchangeRate} ${transaction.receiveCurrency}`}
            />

            <Detail label="PAID WITH" value={transaction.paymentMethod} />

            <Detail label="PURPOSE" value={transaction.purpose} />
          </div>
        </div>
      )}
    </article>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-[3px] text-[9px] font-extrabold text-gray-400">
        {label}
      </p>
      <p className="break-words text-[11px] font-extrabold text-gray-900">
        {value}
      </p>
    </div>
  )
}

function RouteComponent() {
  const transactions = useTransactionStore((state) => state.transactions)

  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [expandedId, setExpandedId] = useState<string | null>('txn-001')

  // Hydrate persisted history after the component mounts.
  useEffect(() => {
    void useTransactionStore.persist.rehydrate()
  }, [])

  const sortedTransactions = useMemo(
    () =>
      [...transactions].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [transactions],
  )

  const filteredTransactions = sortedTransactions.filter(
    (transaction) =>
      activeFilter === 'all' || transaction.status === activeFilter,
  )

  const filterCounts: Record<Filter, number> = {
    all: transactions.length,
    in_progress: transactions.filter((item) => item.status === 'in_progress')
      .length,
    completed: transactions.filter((item) => item.status === 'completed')
      .length,
    failed: transactions.filter((item) => item.status === 'failed').length,
  }

  return (
    <>
      <Header />

      <main className="mx-auto w-[min(100%-32px,1400px)] py-7 md:w-[min(100%-96px,1400px)] md:py-9">
        {/* Heading */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[25px] leading-tight font-extrabold tracking-[-0.5px] text-gray-950 md:text-[28px]">
              Your transfers
            </h1>
            <p className="mt-1 text-[13px] text-gray-700">
              Every transfer you've made with Inter, newest first.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[11px] bg-primary-600 px-4 text-[12px] font-extrabold text-white transition-colors hover:bg-primary-hover sm:w-auto"
          >
            <Plus size={16} />
            New transfer
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const active = activeFilter === filter.value

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-[7px] text-[10px] font-bold transition-colors ${
                  active
                    ? 'border-gray-950 bg-gray-950 text-white'
                    : 'border-gray-100 bg-white text-gray-700 hover:bg-surface'
                }`}
              >
                {filter.label}
                <span className={active ? 'text-gray-300' : 'text-gray-400'}>
                  {filterCounts[filter.value]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Transaction list */}
        <section className="overflow-hidden rounded-[14px] border border-gray-100 bg-white">
          {/* Desktop column headings */}
          <div className="hidden grid-cols-[minmax(0,2fr)_minmax(105px,0.8fr)_minmax(100px,0.7fr)_minmax(120px,1fr)] bg-surface px-5 py-3 text-[9px] font-extrabold text-gray-400 md:grid">
            <span>RECIPIENT</span>
            <span>STATUS</span>
            <span>DATE</span>
            <span className="text-right">AMOUNT</span>
          </div>

          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                expanded={expandedId === transaction.id}
                onToggle={() =>
                  setExpandedId((current) =>
                    current === transaction.id ? null : transaction.id,
                  )
                }
              />
            ))
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-[13px] font-bold text-gray-700">
                No transactions found
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                There are no transfers in this category yet.
              </p>
            </div>
          )}
        </section>

        <p className="mt-4 text-[11px] text-gray-400">
          Showing {filteredTransactions.length} of {transactions.length}{' '}
          transfers
        </p>
      </main>
    </>
  )
}
