import { createFileRoute } from '@tanstack/react-router'
import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RecipientForm } from '#/components/recipient/RecipientForm'
import { TransferSummary } from '../components/TransferSummary'
import { useTransferSummary } from '#/hooks/useTransferSummary'
import { Header } from '../components/layout/Header'
import { TransferStepper } from '#/components/layout/TransferStepper'
export const Route = createFileRoute('/recipient')({
  component: RecipientPage,
})

function RecipientPage() {
  // const canContinue = Boolean(
  //   destination && supported
  // )
  // const handleContinue = () => {
  //   if (!canContinue) return
  //   window.alert(
  //     'Page 2 recipient is ready. further pages is are outside of this milestone'
  //   )
  // }
  const { rate, currency, supported, sendAmount, receiveAmount, fee, total } =
    useTransferSummary()

  const heading = (
    <div className="w-full">
      <h1 className="m-0 mb-[15px] text-[25px] leading-[1.22] font-extrabold tracking-[-0.5px] md:mb-1 md:text-[clamp(25px,3vw,31px)] md:leading-[1.2] md:tracking-[-0.7px]">
        Who are you sending to?
      </h1>
      <p className="m-0 mb-6 hidden text-[15px] leading-[1.55] text-gray-700 md:block">
        Their details must match the bank account exactly
      </p>
    </div>
  )

  return (
    <>
      <Header />
      <main className="mx-auto w-[min(100%-40px,520px)] md:w-[min(100%-40px,1400px)]">
        <div className="mb-5 md:hidden">
          <div className="mb-2 flex justify-between text-[12px] text-gray-400">
            <span>Step 2 of 3</span>
            <strong className="text-primary-600">Recipient</strong>
          </div>
          <div className="h-1 overflow-hidden rounded-[99px] bg-gray-100">
            <div className="h-full w-[33.333%] rounded-[inherit] bg-primary-600" />
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-[19px] pt-0 pb-7 md:grid md:grid-cols-[minmax(0,1fr)_382px] md:items-start md:gap-[52px] md:pt-[38px] md:pb-14">
          <div className="contents min-w-0 md:block">
            <TransferStepper/>
            {heading}
            <RecipientForm />
          </div>

          <TransferSummary
            sendAmount={sendAmount}
            receiveAmount={receiveAmount}
            fee={fee}
            total={total}
            currency={currency}
            rate={rate}
            supported={supported}
          />
          
        </div>
      </main>
    </>
  )
}
