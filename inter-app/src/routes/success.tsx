import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/layout/Header'
import { TransferStepper } from '../components/layout/TransferStepper'
import { useTransferStore } from '../stores/transfer.store'
import { Check, CheckCircle2, Landmark, Star } from 'lucide-react'
import { useTransferSummary } from '../hooks/useTransferSummary'

export const Route = createFileRoute('/success')({
  component: RouteComponent,
})

function RouteComponent() {
  const recipient = useTransferStore((state) => state.recipient)
  const providerId = useTransferStore((state) => state.providerId)


  const {
    destination,
    rate,
    currency,
    supported,
    providers,
    sendAmount,
    receiveAmount,
    fee,
    total,
  } = useTransferSummary()
 

  // const heading = (
  //   <div className="w-full">
  //     <h1 className="m-0 mb-[15px] text-[25px] leading-[1.22] font-extrabold tracking-[-0.5px] md:mb-1 md:text-[clamp(25px,3vw,31px)] md:leading-[1.2] md:tracking-[-0.7px]">
  //       Money's on the way
  //     </h1>
  //     <p className="m-0 mb-6 hidden text-[15px] leading-[1.55] text-gray-700 md:block">
  //       something something
  //     </p>
  //   </div>
  // )
  return (
    <>
      <Header />
      <main className="mx-auto w-[min(100%-40px,520px)] md:w-[min(100%-40px,1400px)]">
        <section className="flex w-full flex-col items-center text-center">
          <div className="mb-[11px] grid size-[60px] place-items-center rounded-full bg-primary-soft">
            <div className="grid size-[40px] place-items-center rounded-full bg-primary-600 text-white">
              <Check size={23} strokeWidth={2.5} />
            </div>
          </div>

          <span className="mb-[9px] text-[10px] font-extrabold tracking-[0.2px] text-primary-600">
            TRANSFER SENT
          </span>

          <h1 className="mb-[7px] text-[28px] leading-[1.2] font-extrabold tracking-[-0.7px] text-gray-950 md:text-[36px]">
            Money's on the way
          </h1>

          <p className="mb-[21px] max-w-[570px] text-[14px] leading-[1.55] text-gray-700 md:text-[15px]">
            is heading to{' '}
            {recipient?.recipientFullName}'s { recipient?.recipientBankName ?? 'recipient'}{' '}
            account.
          </p>
        </section>

        {/* Transaction details card */}
        <section className="w-full overflow-hidden rounded-[14px] border border-gray-100 bg-white">
          {/* Recipient information */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-[17px] py-[13px]">
            <div className="flex min-w-0 items-center gap-[10px]">
              <div className="grid size-[34px] shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-bold text-primary-600">
                {recipient?.recipientFullName[0].toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-[13px] font-extrabold text-gray-950">
                  {recipient?.recipientFullName}
                </p>
                <p className="truncate text-[11px] text-gray-400">
                  {recipient?.recipientBankName}
                </p>
              </div>
            </div>

            <span className="flex shrink-0 items-center gap-[5px] rounded-full bg-primary-soft px-[10px] py-[5px] text-[10px] font-bold text-primary-600">
              <span className="size-[5px] rounded-full bg-primary-600" />
              In progress
            </span>
          </div>

          {/* Transfer progress */}
          <div className="px-[17px] pt-[13px]">
            <div className="flex items-center rounded-[11px] bg-surface px-[13px] py-[11px]">
              {/* Paid */}
              <div className="flex shrink-0 items-center gap-[6px]">
                <CheckCircle2 size={16} className="fill-green-500 text-white" />
                <span className="text-[10px] font-bold text-gray-700">
                  Paid
                </span>
              </div>

              <div className="mx-[7px] h-[2px] min-w-[10px] flex-1 bg-green-500" />

              {/* Processing */}
              <div className="flex shrink-0 items-center gap-[6px]">
                <span className="grid size-[16px] place-items-center rounded-full bg-primary-600 text-[9px] font-extrabold text-white">
                  2
                </span>
                <span className="text-[10px] font-semibold text-gray-500">
                  Processing
                </span>
              </div>

              <div className="mx-[7px] h-[2px] min-w-[10px] flex-1 bg-gray-100" />

              {/* Delivered */}
              <div className="flex shrink-0 items-center gap-[6px]">
                <span className="grid size-[16px] place-items-center rounded-full bg-gray-100 text-[9px] font-bold text-gray-400">
                  3
                </span>
                <span className="text-[10px] text-gray-400">Delivered</span>
              </div>
            </div>
          </div>

          {/* Transaction summary */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-[13px] px-[17px] py-[16px] sm:grid-cols-3">
            {/* <div>
              <p className="mb-[3px] text-[9px] font-extrabold text-gray-400">
                REFERENCE
              </p>
              <p className="text-[12px] font-extrabold text-gray-950">
                {reference}
              </p>
            </div> */}

            <div>
              <p className="mb-[3px] text-[9px] font-extrabold text-gray-400">
                YOU SENT
              </p>
              <p className="text-[12px] font-extrabold text-gray-950">
                {sendAmount}
              </p>
            </div>

            <div>
              <p className="mb-[3px] text-[9px] font-extrabold text-gray-400">
                FEE
              </p>
              <p className="text-[12px] font-extrabold text-gray-950">
                {fee}
              </p>
            </div>

            <div>
              <p className="mb-[3px] text-[9px] font-extrabold text-gray-400">
                TOTAL PAID
              </p>
              <p className="text-[12px] font-extrabold text-gray-950">
                {total}
              </p>
            </div>

            <div>
              <p className="mb-[3px] text-[9px] font-extrabold text-gray-400">
                RATE
              </p>
              <p className="text-[12px] font-extrabold text-gray-950">
                {rate
                  ? `1 ${currency} = ${rate.toPrecision(6)} ${currency}`
                  : '---'}
              </p>
            </div>

            <div>
              <p className="mb-[3px] text-[9px] font-extrabold text-gray-400">
                RECIPIENT RECEIVES
              </p>
              <p className="text-[12px] font-extrabold text-primary-600">
                {receiveAmount}
              </p>
            </div>
          </div>

          {/* Payment method */}
          <div className="flex items-center gap-[7px] border-t border-gray-100 bg-surface px-[17px] py-[11px]">
            <Landmark size={13} className="shrink-0 text-gray-400" />
            <span className="text-[10px] text-gray-700">{providerId}</span>
          </div>
        </section>

        {/* Transfer feedback */}
        <section className="mt-[20px] flex w-full flex-col gap-[12px] rounded-[14px] bg-surface px-[18px] py-[15px] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-[13px] font-extrabold text-gray-950">
              How was this transfer?
            </h2>
            <p className="text-[10px] text-gray-700">
              Your rating helps us make sending money simpler.
            </p>
          </div>

          <div className="flex items-center gap-[5px]">
            <div
              className="flex items-center gap-[3px]"
              aria-label="4 out of 5 stars"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={23}
                  strokeWidth={2}
                  className={
                    star <= 4
                      ? 'fill-transparent text-yellow-500'
                      : 'fill-transparent text-blue-200'
                  }
                />
              ))}
            </div>

            <span className="ml-[10px] whitespace-nowrap text-[10px] font-bold text-gray-950">
              4 of 5
            </span>
          </div>
        </section>
      </main>
    </>
  )
}

// data needed: transaction details & rating stars
//recipient name, recipient bank, you send, fee, total paid, rate, recipient recieves
//paid with
