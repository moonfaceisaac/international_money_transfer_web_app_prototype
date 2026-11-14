import { FormField } from '../ui/FormField'

type Props = {
  label: string
  value: string
  currency: string
  variant: 'send' | 'receive'
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
  variant,
  status,
  disabled = false,
  active = false,
  onChange,
}: Props) {
  const isRecipient = variant === 'receive'

  return (
    <FormField label={label} htmlFor={`amount-${currency}`} className="w-full">
      <div
        className={`flex h-[63px] items-center gap-3 rounded-control-mobile pr-[13px] focus-within:border-primary-500 md:h-[70px] md:rounded-control md:pr-[14px] ${
          active
            ? 'border-2 border-primary-500 pl-3 md:pl-[18px]'
            : 'border-[1.5px] border-gray-100 pl-[13px] contrast-more:border-gray-700 md:pl-[19px]'
        } ${isRecipient ? 'bg-surface' : 'bg-white'}`}
      >
        <input
          id={`amount-${currency}`}
          className="w-full min-w-0 border-0 bg-transparent text-[24px] font-extrabold tracking-[-0.5px] text-gray-900 outline-none focus-visible:outline-none md:text-[28px]"
          inputMode="decimal"
          type="text"
          value={value}
          disabled={disabled}
          placeholder="0.00"
          onChange={(event) => onChange(event.target.value)}
        />

        <span
          className={`shrink-0 rounded-pill px-[11px] py-[7px] text-[12px] font-extrabold md:px-3 md:py-2 ${
            isRecipient
              ? 'border border-gray-100 bg-white text-gray-700'
              : 'bg-primary-soft text-primary-600'
          }`}
        >
          {currency}
        </span>
      </div>

      {status && <span className="font-medium text-green-500">{status}</span>}
    </FormField>
  )
}
