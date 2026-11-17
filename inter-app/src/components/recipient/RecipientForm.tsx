import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, ShieldCheck } from 'lucide-react'

import { recipientSchema } from '../../schemas/recipient.schema'
import type { RecipientFormValues } from '../../schemas/recipient.schema'
import { FullNameField } from './FullNameField'
import { BankNameField } from './BankNameField'
import { AccountNumberField } from './AccountNumberField'
import { TransferPurposeField } from './TransferPurposeField'
import { EmailField } from './EmailField'
import { RecipientNoteField } from './RecipientNoteField'
import { useNavigate } from '@tanstack/react-router'
import { useTransferStore } from '../../stores/transfer.store'

export function RecipientForm() {
  const navigate = useNavigate()
  const setRecipient = useTransferStore((state) => state.setRecipient)
  const setRecipientDraft = useTransferStore((state) => state.setRecipientDraft)

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
  useEffect(() => {
    const restore = () => form.reset(useTransferStore.getState().recipientDraft)
    if (useTransferStore.persist.hasHydrated()) restore()
    return useTransferStore.persist.onFinishHydration(restore)
  }, [form.reset])

  const handleFullNameChange = (value: string) => {
    form.setValue('fullName', value, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setRecipientDraft({ fullName: value })
  }
  const handleBankChange = (value: string) => {
    form.setValue('bank', value, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setRecipientDraft({ bank: value })
  }
  const handleAccountNumberChange = (value: string) => {
    form.setValue('accountNumber', value, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setRecipientDraft({ accountNumber: value })
  }

  const handleEmailChange = (value: string) => {
    form.setValue('email', value, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setRecipientDraft({ email: value })
  }
  const handleRecipientNoteField = (value: string) => {
    form.setValue('recipientNote', value, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setRecipientDraft({ recipientNote: value })
  }
  const canContinue = form.formState.isValid

  const onSubmit = (values: RecipientFormValues) => {
    setRecipient({
      recipientFullName: values.fullName,
      recipientBankName: values.bank,
      recipientAccountNumber: values.accountNumber,
      transferPurpose: values.transferPurpose,
      recipientEmail: values.email.trim() || null,
      recipientNote: values.recipientNote.trim() || null,
    })
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
        error={form.formState.errors.bank?.message}
      />
      <AccountNumberField
        label="Account Number"
        value={form.watch('accountNumber')}
        onChange={handleAccountNumberChange}
        error={form.formState.errors.accountNumber?.message}
      />
      <Controller
        name="transferPurpose"
        control={form.control}
        render={({ field, fieldState }) => (
          <TransferPurposeField
            label="Transfer Purpose"
            value={field.value}
            onChange={(value) => {
              field.onChange(value)
              setRecipientDraft({ transferPurpose: value })
            }}
            error={fieldState.error?.message}
            disabled={field.disabled}
          />
        )}
      />
      <EmailField
        label="Email"
        value={form.watch('email')}
        onChange={handleEmailChange}
        error={form.formState.errors.email?.message}
      />
      <RecipientNoteField
        label="Note to Recipient"
        value={form.watch('recipientNote')}
        onChange={handleRecipientNoteField}
        error={form.formState.errors.recipientNote?.message}
      />
      <button
        type="submit"
        className="order-3 mt-0 flex min-h-[54px] w-full items-center justify-center gap-[10px] rounded-[11px] border-0 bg-primary-600 text-[14px] font-extrabold text-white enabled:hover:bg-primary-hover disabled:opacity-50 md:order-none md:mt-6 md:min-h-[53px] md:w-[268px]"
        disabled={!canContinue}
      >
        Continue <ArrowRight size={18} />
      </button>
      <p className="order-4 mt-[-9px] flex items-center justify-center gap-[7px] text-[11px] text-gray-400 md:order-none md:mt-[13px] md:justify-start md:text-[12px]">
        <ShieldCheck size={14} /> No hidden fees. Fees are calculated before you
        continue.
      </p>
    </form>
  )
}
