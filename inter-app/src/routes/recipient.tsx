import { createFileRoute } from '@tanstack/react-router'
// import * as Dialog from '@radix-ui/react-dialog'
// import { useEffect, useRef, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { RecipientForm } from '#/components/recipient/RecipientForm'
// import { TransferSummary } from '../components/calculator/TransferSummary'
import {Header} from "../components/layout/Header"
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

   const heading = (
    <div className="w-full">
      <h1 className="m-0 mb-[15px] text-[25px] leading-[1.22] font-extrabold tracking-[-0.5px] md:mb-1 md:text-[clamp(25px,3vw,31px)] md:leading-[1.2] md:tracking-[-0.7px]">
        Who are you sending to?
      </h1>
      <p className="m-0 mb-6 hidden text-[15px] leading-[1.55] text-gray-700 md:block">
        Their details must match the bank account exactly</p>
    </div>
  )

  return (
    <>
    <Header/>
    {heading}
    </>
    

)

}
