export type DestinationCountry = {
  name: string
  alpha2: string | null
  currencyCode: string | null
  currencySymbol: string | null
  flagUrl: string | null
}

export type CountryApiResponse = {
  data: {
    objects: CountryApiItem[]
  }
}

export type CountryApiItem = {
  names?: {
    common?: string
    official?: string
  }
  codes?: {
    alpha_2?: string
    alpha_3?: string
  }
  currencies?: {
    code?: string
    name?: string
    symbol?: string
  }[]
}

export type ExchangeRate = {
  date: string
  base: string
  quote: string
  rate: number
}

export type TransferSpeed = 'instant' | 'regular'
export type TransferService = 'bank' | 'ewallet'

export type FeeRules = {
  instant: number
  regular: number
}

export type TransferProvider = {
  id: string
  name: string
  logo?: string
  fees: FeeRules
}
