const controlBase =
  'flex h-[63px] items-center gap-3 rounded-control-mobile pr-[13px] focus-within:border-primary-500 md:h-[70px] md:rounded-control md:pr-[14px]'
const controlActive = 'border-2 border-primary-500 pl-3 md:pl-[18px]'
const controlInactive =
  'border-[1.5px] border-gray-100 pl-[13px] contrast-more:border-gray-700 md:pl-[19px]'

export const fieldInputClassName =
  'w-full min-w-0 border-0 bg-transparent text-[24px] font-extrabold tracking-[-0.5px] text-gray-900 outline-none focus-visible:outline-none md:text-[28px]'

export function fieldControlClassName(active: boolean) {
  return `${controlBase} ${active ? controlActive : controlInactive}`
}
