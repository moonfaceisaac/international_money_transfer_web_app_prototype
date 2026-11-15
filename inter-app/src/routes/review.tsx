import { createFileRoute } from '@tanstack/react-router'
import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RecipientForm } from '#/components/recipient/RecipientForm'
import { TransferSummary } from '../components/TransferSummary'
import { useTransferSummary } from '#/hooks/useTransferSummary'
import { useTransferStore } from '../stores/transfer.store'
import { Header } from '../components/layout/Header'
import { TransferStepper } from '#/components/layout/TransferStepper'
export const Route = createFileRoute('/review')({
  component: ReviewPage,
})

function ReviewPage() {
  const providerId = useTransferStore((state) => state.providerId)
  const setProviderId = useTransferStore((state) => state.setProviderId)

  const { rate, currency, supported,providers, sendAmount, receiveAmount, fee, total } =
    useTransferSummary()

  const heading = (
    <div className="w-full">
      <h1 className="m-0 mb-[15px] text-[25px] leading-[1.22] font-extrabold tracking-[-0.5px] md:mb-1 md:text-[clamp(25px,3vw,31px)] md:leading-[1.2] md:tracking-[-0.7px]">
        Check before you send!
      </h1>
      <p className="m-0 mb-6 hidden text-[15px] leading-[1.55] text-gray-700 md:block">
        One last look. Your transfer starts as soon as you confirm and pay. this
        step can't be undone.
      </p>
    </div>
  )

  return (
    <>
      <Header />
      <main className="mx-auto w-[min(100%-40px,520px)] md:w-[min(100%-40px,1400px)]">
        <div className="mb-5 md:hidden">
          <div className="mb-2 flex justify-between text-[12px] text-gray-400">
            <span>Step 3 of 3</span>
            <strong className="text-primary-600">Review</strong>
          </div>
          <div className="h-1 overflow-hidden rounded-[99px] bg-gray-100">
            <div className="h-full w-[33.333%] rounded-[inherit] bg-primary-600" />
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-[19px] pt-0 pb-7 md:grid md:grid-cols-[minmax(0,1fr)_382px] md:items-start md:gap-[52px] md:pt-[38px] md:pb-14">
          <div className="contents min-w-0 md:block">
            <TransferStepper />
            {heading}
            <section className="w-full">
              <p className="mb-[6px] flex items-center justify-between gap-3 text-[12px] font-extrabold text-gray-900 md:mb-[7px] md:text-[13px]">
                Transfer Details
              </p>
              <div>
                <div className="flex flex-row justify-between">
                  <div>
                    <p>You send</p>
                    <p>Transfer fee</p>
                    <p>Exchange Rate</p>
                  </div>
                  <div>
                    <p>{sendAmount}</p>
                    <p>{fee}</p>
                    <p>{rate}</p>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <p>Total to Pay</p>
                  <h1>{currency}{total}</h1>
                </div>
              </div>
            </section>
            <section className="w-full">
              <p className="mb-[6px] flex items-center justify-between gap-3 text-[12px] font-extrabold text-gray-900 md:mb-[7px] md:text-[13px]">
                Recipient
              </p>
              <div>
                <div className="flex flex-row justify-between">
                  <div>
                    <p>Account Number</p>
                    <p>Transfer Purpose</p>
                    <p>Email</p>
                    <p>Note</p>
                  </div>
                  <div>
                    <p>xx</p>
                    <p>xx</p>
                    <p>xx</p>
                    <p>xx</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-[19px] w-full md:mt-[25px]">
              <label
                className="mb-[6px] flex items-center justify-between gap-3 text-[12px] font-extrabold text-gray-900 md:mb-[7px] md:text-[13px]"
                htmlFor="provider"
              >
                Pay From
              </label>
              <select
                id="provider"
                className="min-h-[45px] w-full rounded-[10px] border border-gray-100 bg-white px-[13px] py-0 text-[13px] text-gray-900 contrast-more:border-gray-700 md:min-h-12 md:text-[14px]"
                value={providerId}
                onChange={(event) => setProviderId(event.target.value)}
              >
                {providers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
