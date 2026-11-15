import { z } from 'zod'

const amountString = z
  .string()
  .trim()
  .min(1, 'Enter an amount')
  .refine((value) => {
    const parsed = Number(value.replaceAll(',', ''))
    return Number.isFinite(parsed) && parsed > 0
  }, 'Amount must be greater than zero')

export const transferSchema = z.object({
  sendAmount: amountString,
  receiveAmount: z.string(),
})

export type TransferFormValues = z.infer<typeof transferSchema>


