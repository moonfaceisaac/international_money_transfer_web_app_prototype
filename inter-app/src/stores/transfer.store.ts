import { create } from 'zustand'
import type {
  DestinationCountry,
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
  setDestination: (country: DestinationCountry | null) => void
  setSpeed: (speed: TransferSpeed) => void
  setService: (service: TransferService) => void
  setProviderId: (providerId: string) => void
  setSendAmount: (amount: string) => void
  setReceiveAmount: (amount: string) => void
  setDerivedAmount: (field: LastEdited, amount: string) => void
}

export const useTransferStore = create<TransferState>((set) => ({
  destination: null,
  speed: 'instant',
  service: 'bank',
  providerId: 'bca',
  sendAmount: '1000000',
  receiveAmount: '',
  lastEdited: 'send',
  setDestination: (destination) =>
    set({ destination, receiveAmount: '', lastEdited: 'send' }),
  setSpeed: (speed) => set({ speed }),
  setService: (service) =>
    set({
      service,
      providerId: service === 'bank' ? 'bca' : 'gopay',
    }),
  setProviderId: (providerId) => set({ providerId }),
  setSendAmount: (sendAmount) =>
    set({ sendAmount, lastEdited: 'send' }),
  setReceiveAmount: (receiveAmount) =>
    set({ receiveAmount, lastEdited: 'receive' }),
  setDerivedAmount: (field, amount) =>
    set(
      field === 'send'
        ? { receiveAmount: amount }
        : { sendAmount: amount },
    ),
}))
