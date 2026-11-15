import {z} from 'zod'

export const recipientSchema = z.object({
  bank: z.string().min(1, 'Please select a bank'),

  accountNumber: z
    .string()
    .min(1, 'Account number is required')
    .regex(/^\d+$/, 'Account number must contain numbers only'),

  fullName: z.string().min(1, 'Name is required'),

  transferPurpose: z.string().min(1, 'Please select a transfer purpose'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .or(z.literal('')),

  recipientNote: z
    .string()
    .max(255, 'Note cannot exceed 255 characters'),
})

export type RecipientFormValues = z.infer<typeof recipientSchema>