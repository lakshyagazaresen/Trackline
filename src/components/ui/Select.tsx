import * as RadixSelect from '@radix-ui/react-select'
import {
  Check,
  ChevronDown,
} from 'lucide-react'

export type SelectOption<T extends string> = {
  value: T
  label: string
}

type SelectProps<T extends string> = {
  value: T
  options: SelectOption<T>[]
  onValueChange: (value: T) => void
  placeholder?: string
  disabled?: boolean
}

function Select<T extends string>({
  value,
  options,
  onValueChange,
  placeholder = 'Select...',
  disabled = false,
}: SelectProps<T>) {
  return (
    <RadixSelect.Root
      value={value}
      onValueChange={(newValue) =>
        onValueChange(newValue as T)
      }
      disabled={disabled}
    >
      <RadixSelect.Trigger
        className="inline-flex min-w-36 items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none hover:border-slate-600 focus:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RadixSelect.Value
          placeholder={placeholder}
        />

        <RadixSelect.Icon>
          <ChevronDown size={16} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl"
        >
          <RadixSelect.Viewport>
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm text-slate-300 outline-none data-[highlighted]:bg-slate-800 data-[highlighted]:text-white"
              >
                <RadixSelect.ItemIndicator
                  className="absolute left-2"
                >
                  <Check size={14} />
                </RadixSelect.ItemIndicator>

                <RadixSelect.ItemText>
                  {option.label}
                </RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

export default Select