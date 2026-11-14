type Props = {
  label: string
  value: string
  currency: string
  balance?: string
  status?: string
  disabled?: boolean
  active?: boolean
  onChange: (value: string) => void
}

export function AmountField({
  label,
  value,
  currency,
  balance,
  status,
  disabled = false,
  active = false,
  onChange,
}: Props) {
  return (
    <section className="amount-section">
      <label className="field-label">
        <span>{label}</span>
        {balance ? <span className="muted">{balance}</span> : null}
        {status ? <span className="muted status-success">{status}</span> : null}
      </label>
      <div className={`amount-control ${active ? 'active' : ''} ${label === 'Recipient gets' ? 'receive-control' : ''}`}>
        <input
          aria-label={`${label} in ${currency}`}
          inputMode="decimal"
          type="text"
          value={value}
          disabled={disabled}
          placeholder="0.00"
          onChange={(event) => onChange(event.target.value)}
        />
        <span className={`currency-pill ${label === 'Recipient gets' ? 'neutral' : ''}`}>
          {currency}
        </span>
      </div>
    </section>
  )
}
