import type { ReactNode } from 'react'

type Props = {
  label: string
  htmlFor: string
  children: ReactNode
  description?: string
  error?: string
  className?: string
}

export function FormField({
  label,
  htmlFor,
  children,
  description,
  error,
  className,
}: Props) {
  return (
    <section className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-[6px] flex items-center justify-between gap-3 text-[12px] font-extrabold text-gray-900 md:mb-[7px] md:text-[13px]"
      >
        {label}
      </label>
      {children}
      {description && <p>{description}</p>}
      {error && <p role="alert">{error}</p>}
    </section>
  )
}
