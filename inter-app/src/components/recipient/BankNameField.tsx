import * as Popover from '@radix-ui/react-popover'
import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { banks } from '../../mock/recipientBank'

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

export function BankNameField({
  label,
  value,
  status,
  error,
  disabled = false,
  active = false,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeBankId, setActiveBankId] = useState<string | null>(null)

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(search.toLowerCase()),
  )

  const activeBank = filteredBanks.find((bank) => bank.id === activeBankId)

  const handleSelect = (bank: string) => {
    onChange(bank)
    setSearch('')
    setActiveBankId(null)
    setOpen(false)
  }

  return (
    <FormField label={label} htmlFor="bank-name" className="w-full">
      <Popover.Root
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) setActiveBankId(null)
        }}
      >
        <Popover.Anchor asChild>
          <div className={fieldControlClassName(active)}>
            <input
              id="bank-name"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls="bank-name-listbox"
              aria-haspopup="listbox"
              aria-activedescendant={
                open && activeBank
                  ? `bank-name-option-${activeBank.id}`
                  : undefined
              }
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'bank-name-error' : undefined}
              className={`${fieldInputClassName} disabled:cursor-not-allowed disabled:opacity-50`}
              type="text"
              value={open ? search : value}
              disabled={disabled}
              placeholder="Recipient's bank name"
              onFocus={() => {
                setSearch('')
                setActiveBankId(null)
                setOpen(true)
              }}
              onChange={(event) => {
                setSearch(event.target.value)
                setActiveBankId(null)
                setOpen(true)
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault()
                  if (!open) {
                    setSearch('')
                    setActiveBankId(
                      event.key === 'ArrowDown'
                        ? (banks[0]?.id ?? null)
                        : (banks[banks.length - 1]?.id ?? null),
                    )
                    setOpen(true)
                  } else if (filteredBanks.length > 0) {
                    const index = filteredBanks.findIndex(
                      (bank) => bank.id === activeBankId,
                    )
                    const nextIndex =
                      event.key === 'ArrowDown'
                        ? (index + 1) % filteredBanks.length
                        : index === -1
                          ? filteredBanks.length - 1
                          : (index - 1 + filteredBanks.length) %
                            filteredBanks.length
                    setActiveBankId(filteredBanks[nextIndex].id)
                  }
                } else if (event.key === 'Enter' && open && activeBank) {
                  event.preventDefault()
                  handleSelect(activeBank.name)
                } else if (event.key === 'Escape') {
                  setOpen(false)
                  setSearch('')
                  setActiveBankId(null)
                }
              }}
            />

            <Popover.Trigger asChild>
              <button
                type="button"
                disabled={disabled}
                aria-label="Show bank options"
                className="shrink-0 text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed"
              >
                <ChevronDown
                  size={20}
                  className={`transition-transform ${open ? 'rotate-180' : ''}`}
                />
              </button>
            </Popover.Trigger>
          </div>
        </Popover.Anchor>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="z-50 w-[var(--radix-popover-trigger-width)] rounded-xl border border-gray-100 bg-white p-2 shadow-lg outline-none"
          >
            <div
              id="bank-name-listbox"
              role="listbox"
              aria-label="Available banks"
              className="max-h-60 overflow-y-auto"
            >
              {filteredBanks.length > 0 ? (
                filteredBanks.map((bank) => (
                  <button
                    key={bank.id}
                    id={`bank-name-option-${bank.id}`}
                    type="button"
                    role="option"
                    aria-selected={value === bank.name}
                    onClick={() => handleSelect(bank.name)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none"
                  >
                    {bank.name}

                    {value === bank.name && (
                      <Check size={16} className="text-primary-500" />
                    )}
                  </button>
                ))
              ) : (
                <p className="px-3 py-4 text-center text-sm text-gray-400">
                  No banks available.
                </p>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error && (
        <span id="bank-name-error" className="text-sm font-medium text-red-500">
          {error}
        </span>
      )}
      {status && <span className="font-medium text-green-500">{status}</span>}
    </FormField>
  )
}
