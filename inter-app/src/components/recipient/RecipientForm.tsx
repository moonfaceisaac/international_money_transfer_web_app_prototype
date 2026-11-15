import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'


import {
  recipientSchema,
  type RecipientFormValues,
} from '../../schemas/recipient.schema'
import { FullNameField } from './FullNameField'
import { BankNameField } from './BankNameField'
import { AccountNumberField } from './AccountNumberField'
import { TransferPurposeField } from './TransferPurposeField'
import { EmailField } from './EmailField'
import { RecipientNoteField } from './RecipientNoteField'

export function RecipientForm() {
  const form = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      bank: '',
      accountNumber: '',
      fullName: '',
      transferPurpose: '',
      email: '',
      recipientNote: '',
    },
  })
  const handleFullNameChange = (value: string) => {
    form.setValue('fullName', value, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }
  const handleBankChange = (value: string) => {
    form.setValue('bank',value, {
        shouldValidate: true,
        shouldDirty: true,
    })
  }
  const handleAccountNumberChange = (value: string) => {
    form.setValue('accountNumber', value, {
        shouldValidate: true,
        shouldDirty: true,
    })
  }
  const handleTranferPurposeChange = (value: string) => {
    form.setValue('transferPurpose', value, {
        shouldValidate: true,
        shouldDirty: true,
    })
  }
  const handleEmailChange = (value: string) => {
    form.setValue('email', value, {
        shouldValidate: true,
        shouldDirty: true,
    })
  }
  const handleRecipientNoteField = (value: string) => {
    form.setValue('recipientNote', value, {
        shouldValidate: true,
        shouldDirty: true,
    })
  }

  const onSubmit = (values: RecipientFormValues) => {
    console.log(values)
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FullNameField
        label="Full Name"
        value={form.watch('fullName')}
        onChange={handleFullNameChange}
        error={form.formState.errors.fullName?.message}
      />
      <BankNameField
        label="Bank Name"
        value={form.watch('bank')}
        onChange={handleBankChange}
        status={undefined}
        error={form.formState.errors.bank?.message}
      />
      <AccountNumberField
        label="Account Number"
        value={form.watch('accountNumber')}
        onChange={handleAccountNumberChange}
        status={undefined}
        error={form.formState.errors.accountNumber?.message}
      />
      <TransferPurposeField
        label="Transfer Purpose"
        value={form.watch('transferPurpose')}
        onChange={handleTranferPurposeChange}
        status={undefined}
        error={form.formState.errors.transferPurpose?.message}
      />
      <EmailField
        label="Email"
        value={form.watch("email")}
        onChange={handleEmailChange}
        status={undefined}
        error={form.formState.errors.email?.message}
      />
      <RecipientNoteField
        label="Note to Recipient"
        value={form.watch("recipientNote")}
        onChange={handleRecipientNoteField}
        status={undefined}
        error={form.formState.errors.recipientNote?.message}
      />
      <button type="submit">Continue</button>
    </form>

  )
}
