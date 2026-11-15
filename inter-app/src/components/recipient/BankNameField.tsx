import * as Popover from '@radix-ui/react-popover'
import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { banks } from '../../mock/recipientBank'

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

  const filteredBanks = banks.filter((banks) =>
    banks.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSelect = (bank: string) => {
    onChange(bank)
    setSearch('')
    setOpen(false)
  }

  return (
    <FormField
      label={label}
      htmlFor="bank-name"
      className="w-full"
    >
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Anchor asChild>
          <div
            className={`flex h-[63px] items-center gap-3 rounded-control-mobile pr-[13px] focus-within:border-primary-500 md:h-[70px] md:rounded-control md:pr-[14px] ${
              active
                ? 'border-2 border-primary-500 pl-3 md:pl-[18px]'
                : 'border-[1.5px] border-gray-100 pl-[13px] contrast-more:border-gray-700 md:pl-[19px]'
            }`}
          >
            <input
              id="bank-name"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls="bank-name-listbox"
              aria-haspopup="listbox"
              className="w-full min-w-0 border-0 bg-transparent text-[24px] font-extrabold tracking-[-0.5px] text-gray-900 outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[28px]"
              type="text"
              value={open ? search : value}
              disabled={disabled}
              placeholder="Recipient's bank name"
              onFocus={() => {
                setSearch(value)
                setOpen(true)
              }}
              onChange={(event) => {
                setSearch(event.target.value)
                setOpen(true)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setOpen(false)
                  setSearch('')
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
                filteredBanks.map((banks) => (
                  <button
                    key={banks.id}
                    type="button"
                    role="option"
                    aria-selected={value === banks.name}
                    onClick={() => handleSelect(banks.name)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none"
                  >
                    {banks.name}

                    {value === banks.name && (
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
        
      {error &&(
        <span className='text-sm font-medium text-red-500'>
            {error}
        </span>
      )}
      {status && (
        <span className="font-medium text-green-500">{status}</span>
      )}
    </FormField>
  )
}