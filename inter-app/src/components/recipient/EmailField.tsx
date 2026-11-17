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

export function EmailField({
  label,
  value,
  status,
  error,
  disabled = false,
  active = false,
  onChange,
}: Props) {
  return (
    <FormField label={label} htmlFor="recipient-email" className="w-full">
      <div className={fieldControlClassName(active)}>
        <input
          id="recipient-email"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'recipient-email-error' : undefined}
          className={fieldInputClassName}
          inputMode="email"
          type="email"
          value={value}
          disabled={disabled}
          placeholder="Recipient's email adress"
          onChange={(event) => onChange(event.target.value)}
        ></input>
      </div>
      {error && (
        <span
          id="recipient-email-error"
          className="text-sm font-medium text-red-500"
        >
          {error}
        </span>
      )}

      {status && <span className="font-medium text-green-500">{status}</span>}
    </FormField>
  )
}
