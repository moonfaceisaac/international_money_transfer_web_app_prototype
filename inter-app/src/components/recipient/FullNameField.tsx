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

export function FullNameField({
  label,
  value,
  status,
  error,
  disabled = false,
  active = false,
  onChange,
}: Props) {
  return (
    <FormField label={label} htmlFor="recipient-full-name" className="w-full">
      <div className={fieldControlClassName(active)}>
        <input
          id="recipient-full-name"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'recipient-full-name-error' : undefined}
          className={fieldInputClassName}
          inputMode="text"
          type="text"
          value={value}
          disabled={disabled}
          placeholder="Recipient's full name"
          onChange={(event) => onChange(event.target.value)}
        ></input>
      </div>
      {error && (
        <span
          id="recipient-full-name-error"
          role="alert"
          className="text-sm font-medium text-red-500"
        >
          {error}
        </span>
      )}

      {status && <span className="font-medium text-green-500">{status}</span>}
    </FormField>
  )
}
