import { useRouterState } from '@tanstack/react-router'
import { transferSteps } from '../../config/transferSteps'

export function TransferStepper() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const activeIndex = transferSteps.findIndex(
    (step) => step.to === pathname,
  )

  return (
    <nav
      className="mb-6 hidden items-center gap-[10px] text-gray-400 md:flex"
      aria-label="Transfer progress"
    >
      {transferSteps.map((step, index) => {
        const isActive = index === activeIndex

        return (
          <div key={step.id} className="contents">
            <span
              aria-current={isActive ? 'step' : undefined}
              className={`inline-flex items-center gap-2 rounded-[99px] py-1 pr-[10px] pl-1 text-[13px] whitespace-nowrap ${
                isActive
                  ? 'border border-primary-500 text-primary-600'
                  : 'text-gray-400'
              }`}
            >
              <span
                className={`grid size-[22px] place-items-center rounded-full text-[11px] font-extrabold ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {index + 1}
              </span>

              {step.label}
            </span>

            {index < transferSteps.length - 1 && (
              <span className="h-px w-[22px] bg-blue-200" />
            )}
          </div>
        )
      })}
    </nav>
  )
}