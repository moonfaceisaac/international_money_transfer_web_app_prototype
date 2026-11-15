import { FormField } from "../ui/FormField"

type Props = {
    label: string
    value: string
    status?: string
    error?: string
    disabled?: boolean
    active?: boolean
    onChange: (value: string) => void
    
}

export function TransferPurposeField({
    label,
    value,
    status,
    error,
    disabled = false,
    active = false,
    onChange,
}: Props) {
    return (
        <FormField
            label={label}
            htmlFor="transfer-purpose"
            className="w-full"
        >
        <div
        className={`flex h-[63px] items-center gap-3 rounded-control-mobile pr-[13px] focus-within:border-primary-500 md:h-[70px] md:rounded-control md:pr-[14px] ${
          active
            ? 'border-2 border-primary-500 pl-3 md:pl-[18px]'
            : 'border-[1.5px] border-gray-100 pl-[13px] contrast-more:border-gray-700 md:pl-[19px]'
        }`}
        >
            <input
                id="account-number"
                className="w-full min-w-0 border-0 bg-transparent text-[24px] font-extrabold tracking-[-0.5px] text-gray-900 outline-none focus-visible:outline-none md:text-[28px]"
                inputMode="text"
                type="text"
                value={value}
                disabled={disabled}
                placeholder="Transfer Purpose"
                onChange={(event) => onChange(event.target.value)}
            >
            </input>
        </div>
         {error &&(
        <span className='text-sm font-medium text-red-500'>
            {error}
        </span>)}
        {status && <span className="font-medium text-green-500">{status}</span>}
        </FormField>
    )
}