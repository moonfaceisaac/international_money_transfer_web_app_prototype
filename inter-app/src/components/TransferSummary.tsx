import { formatAmount } from '../lib/utils/money'

type Props = {
  sendAmount: number
  receiveAmount: number
  fee: number
  total: number
  currency: string
  rate: number | undefined
  supported: boolean
}

export function TransferSummary({
  sendAmount,
  receiveAmount,
  fee,
  total,
  currency,
  rate,
  supported,
}: Props) {
  return (
    <aside
      className="static top-[24px] w-full rounded-[16px] bg-navy-800 px-[18px] py-[19px] text-gray-50 md:sticky md:w-auto md:rounded-[17px] md:px-[26px] md:py-[25px]"
      aria-label="Transfer summary"
    >
      <p className="m-0 mb-[13px] text-[10px] font-extrabold tracking-[0.3px] text-blue-300 md:mb-[16px] md:text-[11px]">
        TRANSFER SUMMARY
      </p>
      <span className="mb-[3px] block text-[12px] text-blue-300">You send</span>
      <p className="m-0 mb-[16px] text-[31px] leading-[1.15] font-black">
        IDR {formatAmount(sendAmount)}
      </p>
      <div className="my-[13px] h-[1px] bg-blue-200/24 md:my-[16px]" />
      <div className="mt-[10px] flex justify-between gap-[14px] text-[12px] text-blue-300 md:mt-[12px]">
        <span>Transfer fee (Bank Admin + Speed Admin)</span>
        <strong className="text-right text-[12px] font-extrabold text-gray-50">
          IDR {formatAmount(fee)}
        </strong>
    </div>
      <div className="mt-[10px] flex justify-between gap-[14px] text-[12px] text-blue-300 md:mt-[12px]">
        <span>Total to pay (What you send + Transfer Fee)</span>
        <strong className="text-right text-[12px] font-extrabold text-gray-50">
          IDR {formatAmount(total)}
        </strong>
      </div>
      <div className="mt-[10px] flex justify-between gap-[14px] text-[12px] text-blue-300 md:mt-[12px]">
        <span>Rate applied</span>
        <strong className="text-right text-[12px] font-extrabold text-gray-50">
          {rate ? `1 IDR = ${rate.toPrecision(6)} ${currency}` : 'Unavailable'}
        </strong>
      </div>
      <div className="my-[13px] h-[1px] bg-blue-200/24 md:my-[16px]" />
      <span className="mb-[3px] block text-[12px] text-blue-300">
        Recipient gets
      </span>
      <p className="m-0 mt-[3px] text-[23px] leading-[1.15] font-black text-primary-500 md:text-[26px]">
        {supported
          ? `${currency} ${formatAmount(receiveAmount)}`
          : 'Not supported'}
      </p>
      {!supported && (
        <p className="mt-[17px] hidden rounded-pill bg-gray-50/10 px-[12px] py-[10px] text-[11px] text-gray-50 md:block">
          This destination currency is not currently supported by the rate
          provider.
        </p>
      )}
    </aside>
  )
}
