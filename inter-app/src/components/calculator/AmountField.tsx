import { FormField } from '../ui/FormField'
import { fieldControlClassName, fieldInputClassName } from '../ui/fieldStyles'

type Props = {
  label: string
  value: string
  currency: string
  variant: 'send' | 'receive'

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
        className={`${fieldControlClassName(active)} ${isRecipient ? 'bg-surface' : 'bg-white'}`}
      >
        <input
          id={`amount-${currency}`}
          className={fieldInputClassName}
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
