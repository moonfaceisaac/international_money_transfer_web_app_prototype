import { useQuery } from '@tanstack/react-query'
import {
  getInitialCountries,
  searchCountries,
} from '../lib/api/countries'

export function useInitialCountries() {
  return useQuery({
    queryKey: ['countries', 'initial'],
    queryFn: ({ signal }) => getInitialCountries(signal),
    staleTime: 30 * 60 * 1000,
  })
}

export function useCountrySearch(query: string, enabled: boolean) {
  const normalizedQuery = query.trim()

  return useQuery({
    queryKey: ['countries', 'search', normalizedQuery.toLowerCase()],
    queryFn: ({ signal }) => searchCountries(normalizedQuery, signal),
    enabled: enabled && normalizedQuery.length > 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
