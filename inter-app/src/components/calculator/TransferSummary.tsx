import { formatAmount } from '../../lib/utils/money'

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
    <aside className="summary-card" aria-label="Transfer summary">
      <p className="summary-eyebrow">TRANSFER SUMMARY</p>
      <span className="summary-label">You send</span>
      <p className="summary-send">IDR {formatAmount(sendAmount)}</p>
      <div className="summary-divider" />
      <div className="summary-line">
        <span>Transfer fee</span>
        <strong>IDR {formatAmount(fee)}</strong>
      </div>
      <div className="summary-line">
        <span>Total to pay</span>
        <strong>IDR {formatAmount(total)}</strong>
      </div>
      <div className="summary-line">
        <span>Rate applied</span>
        <strong>{rate ? `1 IDR = ${rate.toPrecision(6)} ${currency}` : 'Unavailable'}</strong>
      </div>
      <div className="summary-divider" />
      <span className="summary-label">Recipient gets</span>
      <p className="summary-receive">
        {supported ? `${currency} ${formatAmount(receiveAmount)}` : 'Not supported'}
      </p>
      {!supported && (
        <p className="summary-note">This destination currency is not currently supported by the rate provider.</p>
      )}
    </aside>
  )
}
