import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { RecipientFormValues } from '../schemas/recipient.schema'
import type {
  DestinationCountry,
  RecipientInfo,
  TransferService,
  TransferSpeed,
} from '../lib/types'

type LastEdited = 'send' | 'receive'

const emptyRecipientDraft: RecipientFormValues = {
  bank: '',
  accountNumber: '',
  fullName: '',
  transferPurpose: '',
  email: '',
  recipientNote: '',
}

type TransferState = {
  destination: DestinationCountry | null
  speed: TransferSpeed
  service: TransferService
  providerId: string
  sendAmount: string
  receiveAmount: string
  lastEdited: LastEdited
  recipient: RecipientInfo | null
  recipientDraft: RecipientFormValues
  setDestination: (country: DestinationCountry | null) => void
  setSpeed: (speed: TransferSpeed) => void
  setService: (service: TransferService) => void
  setProviderId: (providerId: string) => void
  setSendAmount: (amount: string) => void
  setReceiveAmount: (amount: string) => void
  setDerivedAmount: (field: LastEdited, amount: string) => void
  setRecipient: (recipient: RecipientInfo | null) => void
  setRecipientDraft: (field: Partial<RecipientFormValues>) => void
}

export const useTransferStore = create<TransferState>()(
  persist(
    (set) => ({
      destination: null,
      speed: 'instant',
      service: 'bank',
      providerId: '',
      sendAmount: '0',
      receiveAmount: '',
      lastEdited: 'send',
      recipient: null,
      recipientDraft: emptyRecipientDraft,
      setDestination: (destination) =>
        set((state) => ({
          destination,
          receiveAmount: '',
          lastEdited: 'send',
          recipient:
            state.destination?.name === destination?.name
              ? state.recipient
              : null,
          recipientDraft:
            state.destination?.name === destination?.name
              ? state.recipientDraft
              : emptyRecipientDraft,
        })),
      setSpeed: (speed) => set({ speed }),
      setService: (service) =>
        set({
          service,
          providerId: service === 'bank' ? 'bca' : 'gopay',
        }),
      setProviderId: (providerId) => set({ providerId }),
      setRecipient: (recipient) => set({ recipient }),
      setRecipientDraft: (field) =>
        set((state) => ({
          recipientDraft: { ...state.recipientDraft, ...field },
          recipient: null,
        })),
      setSendAmount: (sendAmount) => set({ sendAmount, lastEdited: 'send' }),
      setReceiveAmount: (receiveAmount) =>
        set({ receiveAmount, lastEdited: 'receive' }),
      setDerivedAmount: (field, amount) =>
        set((state) => {
          if (field === 'send') {
            return state.receiveAmount === amount
              ? state
              : { receiveAmount: amount }
          }
          return state.sendAmount === amount ? state : { sendAmount: amount }
        }),
    }),
    {
      name: 'inter-transfer-draft',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        destination: state.destination,
        speed: state.speed,
        service: state.service,
        providerId: state.providerId,
        sendAmount: state.sendAmount,
        receiveAmount: state.receiveAmount,
        lastEdited: state.lastEdited,
        recipient: state.recipient,
        recipientDraft: state.recipientDraft,
      }),
    },
  ),
)
