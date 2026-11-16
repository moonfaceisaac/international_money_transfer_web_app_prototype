
import { useRouterState } from '@tanstack/react-router'
import { transferSteps } from '../../config/transferSteps'

export function TransferStepper() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const activeIndex = transferSteps.findIndex(
    (step) => step.to === pathname,
  )

  const currentStep = transferSteps[activeIndex]
  const progress = ((activeIndex + 1) / transferSteps.length) * 100

  if (!currentStep) return null

  return (
    <nav aria-label="Transfer progress">
      {/* Desktop Stepper */}
      <div className="mb-6 hidden items-center gap-[10px] text-gray-400 md:flex">
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
      </div>

      {/* Mobile Stepper */}
      <div
        className="mb-5 md:hidden"
        aria-label={`Step ${activeIndex + 1} of ${transferSteps.length}: ${currentStep.label}`}
      >
        <div className="mb-2 flex justify-between text-[12px] text-gray-400">
          <span>
            Step {activeIndex + 1} of {transferSteps.length}
          </span>

          <strong className="text-primary-600">
            {currentStep.label}
          </strong>
        </div>

        <div
          className="h-1 overflow-hidden rounded-[99px] bg-gray-100"
          role="progressbar"
          aria-valuenow={activeIndex + 1}
          aria-valuemin={1}
          aria-valuemax={transferSteps.length}
          aria-label="Transfer progress"
        >
          <div
            className="h-full rounded-[inherit] bg-primary-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </nav>
  )
}
