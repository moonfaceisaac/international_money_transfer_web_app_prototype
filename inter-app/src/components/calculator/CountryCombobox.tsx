import * as Popover from '@radix-ui/react-popover'
import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useInitialCountries, useCountrySearch } from '../../hooks/useCountries'
import type { DestinationCountry } from '../../lib/types'

type Props = {
  value: DestinationCountry | null
  onChange: (country: DestinationCountry) => void
}

const flagClassName =
  'grid h-[32px] w-[32px] flex-[0_0_32px] place-items-center overflow-hidden rounded-[50%] bg-surface-icon text-[18px] text-gray-400 md:h-[36px] md:w-[36px] md:basis-[36px]'

function Flag({ country }: { country: DestinationCountry | null }) {
  const [failed, setFailed] = useState(false)

  if (!country?.flagUrl || failed) {
    return (
      <span className={flagClassName} aria-hidden="true">
        ◎
      </span>
    )
  }

  return (
    <span className={flagClassName}>
      <img
        className="h-full w-full object-cover"
        src={country.flagUrl}
        alt=""
        onError={() => setFailed(true)}
      />
    </span>
  )
}

export function CountryCombobox({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [search])

  const initialQuery = useInitialCountries(open)
  const searchQuery = useCountrySearch(debouncedSearch, open)
  const activeQuery = debouncedSearch ? searchQuery : initialQuery
  const searchPending = search.trim() !== debouncedSearch
  const loading = searchPending || (activeQuery.isFetching && !activeQuery.data)
  const error = loading ? null : activeQuery.error
  const countries = loading || error ? [] : (activeQuery.data ?? [])
  const visibleActiveIndex = Math.min(activeIndex, countries.length - 1)
  const activeOptionId =
    visibleActiveIndex >= 0
      ? `${listboxId}-option-${visibleActiveIndex}`
      : undefined

  useEffect(() => {
    if (open && activeOptionId) {
      document.getElementById(activeOptionId)?.scrollIntoView({
        block: 'nearest',
      })
    }
  }, [open, activeOptionId, countries])

  useEffect(() => {
    if (open) {
      window.requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      setSearch('')
      setDebouncedSearch('')
      setActiveIndex(0)
    }
  }, [open])

  const selectCountry = (country: DestinationCountry) => {
    onChange(country)
    setOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (countries.length > 0) {
        setActiveIndex(Math.min(visibleActiveIndex + 1, countries.length - 1))
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(Math.max(visibleActiveIndex - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (visibleActiveIndex >= 0) {
        selectCountry(countries[visibleActiveIndex])
      }
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex min-h-[57px] w-full items-center gap-[12px] rounded-control-mobile border border-gray-100 bg-gray-50 px-[12px] py-[8px] text-left text-gray-900 hover:border-primary-500 contrast-more:border-gray-700 md:min-h-[64px] md:rounded-control md:px-[16px] md:py-[10px]"
          id="destination-country"
          aria-label={`Destination country: ${value?.name ?? 'Select destination country'}`}
        >
          <Flag country={value} />
          <span className="grid min-w-0 flex-1 gap-[1px]">
            <strong className="text-[14px] font-extrabold md:text-[15px]">
              {value?.name ?? 'Select destination country'}
            </strong>
            <small className="text-[12px] text-gray-400">
              {value
                ? (value.currencyCode ?? 'Currency unavailable')
                : 'Choose where the money will be received'}
            </small>
          </span>
          <span aria-hidden="true">⌄</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="page1-country-popover z-50 overflow-hidden rounded-control border border-gray-100 bg-gray-50 shadow-popover"
          sideOffset={6}
          align="start"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <input
            ref={inputRef}
            className="h-[46px] w-full border-0 border-b border-gray-100 px-[13px] py-0 outline-0"
            aria-label="Search countries"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            aria-autocomplete="list"
            placeholder="Search country..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleKeyDown}
          />
          <div
            id={listboxId}
            className="max-h-[290px] overflow-y-auto p-[5px]"
            role="listbox"
            aria-label="Countries"
          >
            {loading && (
              <div
                className="px-[13px] py-[18px] text-center text-[13px] text-gray-400"
                role="status"
              >
                Loading countries...
              </div>
            )}
            {error && (
              <div
                className="px-[13px] py-[18px] text-center text-[13px] text-gray-400"
                role="alert"
              >
                Couldn't load countries.{' '}
                <button
                  type="button"
                  onClick={() => void activeQuery.refetch()}
                >
                  Try again
                </button>
              </div>
            )}
            {!loading && !error && countries.length === 0 && (
              <div className="px-[13px] py-[18px] text-center text-[13px] text-gray-400">
                No countries found.
              </div>
            )}
            {!loading &&
              !error &&
              countries.map((country, index) => (
                <button
                  type="button"
                  role="option"
                  id={`${listboxId}-option-${index}`}
                  data-active={index === visibleActiveIndex}
                  aria-selected={
                    value?.alpha2 === country.alpha2 &&
                    value.name === country.name
                  }
                  className="flex w-full items-center gap-[10px] rounded-[8px] border-0 bg-gray-50 p-[9px] text-left text-gray-900 hover:bg-surface-option aria-selected:bg-surface-option data-[active=true]:bg-surface-option"
                  key={`${country.alpha2 ?? country.name}-${country.currencyCode ?? 'none'}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectCountry(country)}
                >
                  <Flag country={country} />
                  <span className="flex-1">
                    {country.name}
                    <small className="block text-[11px] text-gray-400">
                      {country.currencyCode ?? 'Currency not listed'}
                    </small>
                  </span>
                  {value?.alpha2 === country.alpha2 &&
                  value.name === country.name
                    ? '✓'
                    : ''}
                </button>
              ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
