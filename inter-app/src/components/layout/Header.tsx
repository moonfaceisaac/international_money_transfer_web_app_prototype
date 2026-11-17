import { History, Send } from 'lucide-react'

import { useNavigate } from '@tanstack/react-router'

export function Header() {
  const navigate = useNavigate()

  return (
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
          onClick={() => navigate({ to: '/history' })}
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
  )
}
