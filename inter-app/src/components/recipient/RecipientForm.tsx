import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

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
import { useNavigate } from '@tanstack/react-router'

export function RecipientForm() {
  const navigate = useNavigate()
  const form = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientSchema),
    mode: 'onChange',
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
  const canContinue = form.formState.isValid

  const onSubmit = (values: RecipientFormValues) =>{
    console.log(values)
    navigate({ to: '/review' })

  }
  const handleContinue = form.handleSubmit(onSubmit)

  return (
    <form onSubmit={handleContinue}>
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
      <button
            type="submit"
            className="order-3 mt-0 flex min-h-[54px] w-full items-center justify-center gap-[10px] rounded-[11px] border-0 bg-primary-600 text-[14px] font-extrabold text-white enabled:hover:bg-primary-hover disabled:opacity-50 md:order-none md:mt-6 md:min-h-[53px] md:w-[268px]"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            Continue <ArrowRight size={18} />
          </button>
          <p className="order-4 mt-[-9px] flex items-center justify-center gap-[7px] text-[11px] text-gray-400 md:order-none md:mt-[13px] md:justify-start md:text-[12px]">
            <ShieldCheck size={14} /> No hidden fees. Fees are calculated before
            you continue.
          </p>
    </form>

  )
}
