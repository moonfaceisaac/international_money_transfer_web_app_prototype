import * as Popover from '@radix-ui/react-popover'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useInitialCountries, useCountrySearch } from '../../hooks/useCountries'
import type { DestinationCountry } from '../../lib/types'

type Props = {
  value: DestinationCountry | null
  onChange: (country: DestinationCountry) => void
}

function Flag({ country }: { country: DestinationCountry }) {
  const [failed, setFailed] = useState(false)

  if (!country.flagUrl || failed) {
    return <span className="country-flag" aria-hidden="true">◎</span>
  }

  return (
    <span className="country-flag">
      <img
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
  const queryClient = useQueryClient()

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [search])

  const initialQuery = useInitialCountries()
  const searchQuery = useCountrySearch(debouncedSearch, open)
  const countries = useMemo(
    () => (debouncedSearch ? searchQuery.data : initialQuery.data) ?? [],
    [debouncedSearch, initialQuery.data, searchQuery.data],
  )
  const loading = debouncedSearch
    ? searchQuery.isFetching
    : initialQuery.isLoading
  const error = debouncedSearch ? searchQuery.error : initialQuery.error

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
      setActiveIndex((current) => Math.min(current + 1, countries.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const country = countries[activeIndex]
      if (country) selectCountry(country)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const refreshInitial = () => {
    void queryClient.invalidateQueries({ queryKey: ['countries', 'initial'] })
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="country-trigger" aria-label="Choose destination country">
          {value ? (
            <>
              <Flag country={value} />
              <span className="country-copy">
                <strong>{value.name}</strong>
                <small>{value.currencyCode ?? 'Currency unavailable'}{value.currencyCode ? ` · ${value.currencyCode}` : ''}</small>
              </span>
            </>
          ) : (
            <>
              <span className="country-flag" aria-hidden="true">◎</span>
              <span className="country-copy">
                <strong>Select destination country</strong>
                <small>Choose where the money will be received</small>
              </span>
            </>
          )}
          <span aria-hidden="true">⌄</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="popover-content"
          sideOffset={6}
          align="start"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <input
            ref={inputRef}
            className="country-search"
            role="combobox"
            aria-expanded={open}
            aria-controls="country-options"
            aria-autocomplete="list"
            placeholder="Search country..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleKeyDown}
          />
          <div id="country-options" className="country-options" role="listbox" aria-label="Countries">
            {loading && <div className="popover-state" role="status">Loading countries...</div>}
            {error && (
              <div className="popover-state" role="alert">
                Couldn't load countries. <button type="button" onClick={refreshInitial}>Try again</button>
              </div>
            )}
            {!loading && !error && countries.length === 0 && (
              <div className="popover-state">No countries found.</div>
            )}
            {!loading && !error && countries.map((country, index) => (
              <button
                type="button"
                role="option"
                aria-selected={value?.alpha2 === country.alpha2 && value?.name === country.name}
                className="country-option"
                key={`${country.alpha2 ?? country.name}-${country.currencyCode ?? 'none'}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectCountry(country)}
              >
                <Flag country={country} />
                <span className="country-option-text">
                  {country.name}
                  <small>{country.currencyCode ?? 'Currency not listed'}</small>
                </span>
                {value?.alpha2 === country.alpha2 && value?.name === country.name ? '✓' : ''}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
