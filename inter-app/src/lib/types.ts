export type DestinationCountry = {
  name: string
  alpha2: string | null
  currencyCode: string | null
  currencySymbol: string | null
  flagUrl: string | null
}

export type RecipientInfo = {
  recipientFullName: string
  recipientBankName: string
  recipientAccountNumber: string
  transferPurpose: string
  recipientEmail: string | null
  recipientNote: string | null
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

export type RecipientBank = {
  id: string
  name: string
} 


// transaction.ts

export type TransactionStatus =
  | 'in_progress'
  | 'completed'
  | 'failed'

export type Transaction = {
  id: string
  reference: string
  recipientName: string
  bankName: string
  accountNumber: string
  status: TransactionStatus
  createdAt: string
  sendAmount: number
  sendCurrency: string
  fee: number
  totalPaid: number
  exchangeRate: number
  receiveAmount: number
  receiveCurrency: string
  paymentMethod: string
  purpose: string
  speed: string
}
