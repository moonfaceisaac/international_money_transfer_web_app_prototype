
import { FormField } from '../ui/FormField'

type Props = {
  label: string
  value: string
  status?: string
  error?: string
  disabled?: boolean
  active?: boolean
  onChange: (value: string) => void
}

export function RecipientNoteField({
  label,
  value,
  status,
  error,
  disabled = false,
  active = false,
  onChange,
}: Props) {
  const characterCounter = value.length

  return (
    <FormField
      label={label}
      htmlFor="recipient-note"
      className="w-full"
    >
      <div
        className={`relative rounded-control-mobile md:rounded-control ${
          active
            ? 'border-2 border-primary-500'
            : 'border-[1.5px] border-gray-100 contrast-more:border-gray-700'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <textarea
          id="recipient-note"
          className="min-h-[120px] w-full resize-none border-0 bg-transparent px-[13px] pt-[13px] pb-[34px] text-[15px] leading-relaxed font-semibold tracking-[-0.2px] text-gray-900 outline-none placeholder:font-medium placeholder:text-gray-400 focus-visible:outline-none md:min-h-[140px] md:px-[19px] md:pt-[17px] md:text-[16px]"
          value={value}
          disabled={disabled}
          maxLength={255}
          rows={3}
          placeholder="Write a note to your recipient..."
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? 'recipient-note-error recipient-note-counter'
              : 'recipient-note-counter'
          }
          onChange={(event) => onChange(event.target.value)}
        />

        <span
          id="recipient-note-counter"
          className="pointer-events-none absolute right-[13px] bottom-[10px] text-[11px] font-semibold tabular-nums text-gray-400 md:right-[19px] md:bottom-[12px]"
          aria-live="polite"
        >
          {characterCounter}/255
        </span>
      </div>

      {error && (
        <span
          id="recipient-note-error"
          className="text-sm font-medium text-red-500"
        >
          {error}
        </span>
      )}

      {status && (
        <span className="font-medium text-green-500">
          {status}
        </span>
      )}
    </FormField>
  )
}
