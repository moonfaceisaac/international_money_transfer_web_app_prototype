import * as Dialog from '@radix-ui/react-dialog'
import {
  History, 
  Send,
} from 'lucide-react'
import { useState, useRef} from 'react'

export function Header(){
    const [historyOpen, setHistoryOpen] = useState(false)
    const historyTriggerRef = useRef<HTMLButtonElement | null>(null)
    return(
        <>
        <header className="h-[73px] border-b border-gray-100 md:block">
        <div className="mx-auto grid h-full w-[min(100%-40px,1254px)] grid-cols-3 items-center">
          <a
            className="inline-flex items-center gap-[9px] text-[21px] font-black text-gray-900 no-underline"
            href="/"
            aria-label="Inter home"
          >
            <span className="grid size-[33px] place-items-center rounded-[11px] bg-primary-500 text-white">
              <Send size={19} />
            </span>
            Inter
          </a>
          <button
            type="button"
            className="inline-flex items-center gap-2 justify-self-center border-0 bg-transparent p-2 text-gray-700 hover:text-primary-600"
            onClick={(event) => {
              historyTriggerRef.current = event.currentTarget
              setHistoryOpen(true)
            }}
          >
            <History size={16} /> History
          </button>
          <div
            className="flex items-center gap-3 justify-self-end"
            aria-label="Sending currency"
          >
            <span className="shrink-0 rounded-pill border border-gray-100 bg-white px-3 py-2 text-[12px] font-extrabold text-gray-700">
              IDR · Indonesia
            </span>
          </div>
        </div>
      </header>
      <Dialog.Root open={historyOpen} onOpenChange={setHistoryOpen}>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/45" />
                <Dialog.Content
                  className="fixed top-1/2 left-1/2 z-[81] w-[min(100%-40px,420px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-[22px]"
                  onCloseAutoFocus={(event) => {
                    event.preventDefault()
                    historyTriggerRef.current?.focus()
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Dialog.Title>Recent transfers</Dialog.Title>
                    <Dialog.Close asChild>
                      <button type="button" aria-label="Close history">
                        ✕
                      </button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="font-medium text-gray-400">
                    Local demonstration data only.
                  </Dialog.Description>
                  <p>History is a mock feature in this take-home milestone.</p>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
        </>
        

    )
}