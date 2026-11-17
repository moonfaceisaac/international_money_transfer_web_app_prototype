import * as Select from '@radix-ui/react-select'
import { FormField } from '../ui/FormField'
import { transferPurposes } from '#/config/transferPurposes'

type Props = {
  label: string
  value: string
  status?: string
  error?: string
  disabled?: boolean
  active?: boolean
  onChange: (value: string) => void
}

export function TransferPurposeField({
  label,
  value,
  status,
  error,
  disabled = false,
  active = false,
  onChange,
}: Props) {
  return (
    <FormField label={label} htmlFor="transfer-purpose" className="w-full">
      <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
        <Select.Trigger
          id="transfer-purpose"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'transfer-purpose-error' : undefined}
          className={`flex h-[63px] w-full items-center justify-between gap-3 rounded-control-mobile pr-[13px] text-left outline-none focus-visible:border-primary-500 md:h-[70px] md:rounded-control md:pr-[14px] ${
            active
              ? 'border-2 border-primary-500 pl-3 md:pl-[18px]'
              : 'border-[1.5px] border-gray-100 pl-[13px] contrast-more:border-gray-700 md:pl-[19px]'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <Select.Value placeholder="Select transfer purpose" />

          <Select.Icon className="shrink-0 text-gray-500">
            <span aria-hidden="true" className="text-lg">
              ▾
            </span>
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={5}
            className="z-50 max-h-60 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-control border border-gray-100 bg-white shadow-popover"
          >
            <Select.Viewport className="p-1">
              {transferPurposes.map((purpose) => (
                <Select.Item
                  key={purpose.value}
                  value={purpose.value}
                  className="relative flex cursor-pointer select-none items-center rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 outline-none data-[highlighted]:bg-primary-soft data-[highlighted]:text-primary-600 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Select.ItemText>{purpose.label}</Select.ItemText>

                  <Select.ItemIndicator className="ml-auto text-primary-600">
                    ✓
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {error && (
        <span
          id="transfer-purpose-error"
          className="text-sm font-medium text-red-500"
        >
          {error}
        </span>
      )}

      {status && <span className="font-medium text-green-500">{status}</span>}
    </FormField>
  )
}
