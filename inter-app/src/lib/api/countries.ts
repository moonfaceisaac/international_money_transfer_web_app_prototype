import type {
  CountryApiItem,
  CountryApiResponse,
  DestinationCountry,
} from '../types'

const COUNTRIES_API = 'https://api.restcountries.com/countries/v5'
const FLAGS_BASE = 'https://flags.restcountries.com/v5/w640'

function countryHeaders(): HeadersInit {
  const apiKey = import.meta.env.VITE_RESTCOUNTRIES_KEY

  return apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
}

function mapCountry(country: CountryApiItem): DestinationCountry | null {
  const name = country.names?.common ?? country.names?.official

  if (!name) return null

  const alpha2 = country.codes?.alpha_2?.trim().toUpperCase() || null
  const currency = country.currencies?.[0]

  return {
    name,
    alpha2,
    currencyCode: currency?.code?.trim().toUpperCase() || null,
    currencySymbol: currency?.symbol || null,
    flagUrl: alpha2 ? `${FLAGS_BASE}/${alpha2.toLowerCase()}.png` : null,
  }
}

async function requestCountries(url: string, signal?: AbortSignal) {
  const response = await fetch(url, {
    headers: countryHeaders(),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Country service returned ${response.status}`)
  }

  const payload = (await response.json()) as CountryApiResponse
  return (payload.data?.objects ?? [])
    .map(mapCountry)
    .filter((country): country is DestinationCountry => country !== null)
}

export function getInitialCountries(signal?: AbortSignal) {
  return requestCountries(`${COUNTRIES_API}?pretty`, signal)
}

export function searchCountries(query: string, signal?: AbortSignal) {
  const normalizedQuery = query.trim()

  if (!normalizedQuery) {
    return getInitialCountries(signal)
  }

  return requestCountries(
    `${COUNTRIES_API}?q=${encodeURIComponent(normalizedQuery)}`,
    signal,
  )
}
