import { create } from 'zustand'
import type {
  DestinationCountry,
  RecipientInfo,
  TransferService,
  TransferSpeed,
} from '../lib/types'

type LastEdited = 'send' | 'receive'

type TransferState = {
  destination: DestinationCountry | null
  speed: TransferSpeed
  service: TransferService
  providerId: string
  sendAmount: string
  receiveAmount: string
  lastEdited: LastEdited
  recipient: RecipientInfo | null
  setDestination: (country: DestinationCountry | null) => void
  setSpeed: (speed: TransferSpeed) => void
  setService: (service: TransferService) => void
  setProviderId: (providerId: string) => void
  setSendAmount: (amount: string) => void
  setReceiveAmount: (amount: string) => void
  setDerivedAmount: (field: LastEdited, amount: string) => void
  setRecipient: (recipient: RecipientInfo | null) => void
}

export const useTransferStore = create<TransferState>((set) => ({
  destination: null,
  speed: 'instant',
  service: 'bank',
  providerId: 'bca',
  sendAmount: '1000000',
  receiveAmount: '',
  lastEdited: 'send',
  recipient: null,
  setDestination: (destination) =>
    set({ destination, receiveAmount: '', lastEdited: 'send' }),
  setSpeed: (speed) => set({ speed }),
  setService: (service) =>
    set({
      service,
      providerId: service === 'bank' ? 'bca' : 'gopay',
    }),
  setProviderId: (providerId) => set({ providerId }),
  setRecipient: (recipient) => set({ recipient }),
  setSendAmount: (sendAmount) => set({ sendAmount, lastEdited: 'send' }),
  setReceiveAmount: (receiveAmount) =>
    set({ receiveAmount, lastEdited: 'receive' }),
  setDerivedAmount: (field, amount) =>
    set(field === 'send' ? { receiveAmount: amount } : { sendAmount: amount }),
}))
