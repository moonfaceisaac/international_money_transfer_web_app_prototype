import { FormField } from '../ui/FormField'
import { fieldControlClassName, fieldInputClassName } from '../ui/fieldStyles'

type Props = {
  label: string
  value: string
  status?: string
  error?: string
  disabled?: boolean
  active?: boolean
  onChange: (value: string) => void
}

export function AccountNumberField({
  label,
  value,
  status,
  error,
  disabled = false,
  active = false,
  onChange,
}: Props) {
  return (
    <FormField label={label} htmlFor="account-number" className="w-full">
      <div className={fieldControlClassName(active)}>
        <input
          id="account-number"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'account-number-error' : undefined}
          className={fieldInputClassName}
          inputMode="numeric"
          type="text"
          value={value}
          disabled={disabled}
          placeholder="Recipient's Account Number field"
          onChange={(event) => onChange(event.target.value)}
        ></input>
      </div>
      {error && (
        <span
          id="account-number-error"
          className="text-sm font-medium text-red-500"
        >
          {error}
        </span>
      )}

      {status && <span className="font-medium text-green-500">{status}</span>}
    </FormField>
  )
}
