import * as RadixSelect from '@radix-ui/react-select'
import {
  Check,
  ChevronDown,
} from 'lucide-react'

import Pill from './Pill'
import type { PillVariant } from './Pill'

export type PillSelectOption<T extends string> = {
  value: T
  label: string
  variant: PillVariant
}

type PillSelectProps<T extends string> = {
  value: T
  options: PillSelectOption<T>[]
  onValueChange: (value: T) => void
  disabled?: boolean
}

function PillSelect<T extends string>({
  value,
  options,
  onValueChange,
  disabled = false,
}: PillSelectProps<T>) {
  const selectedOption =
    options.find(
      (option) =>
        option.value === value,
    )

  return (
    <RadixSelect.Root
      value={value}
      onValueChange={(newValue) =>
        onValueChange(newValue as T)
      }
      disabled={disabled}
    >
      <RadixSelect.Trigger
        className="
          inline-flex items-center gap-1
          rounded-full
          outline-none
          transition-transform
          hover:scale-[1.03]
          focus-visible:ring-2
          focus-visible:ring-slate-500
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {selectedOption && (
          <Pill
            variant={
              selectedOption.variant
            }
          >
            <span className="flex items-center gap-1">
              {selectedOption.label}

              <ChevronDown
                size={13}
                strokeWidth={2.5}
              />
            </span>
          </Pill>
        )}
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={8}
          className="
            z-50 min-w-44
            overflow-hidden
            rounded-xl
            border border-slate-700
            bg-slate-900
            p-1.5
            shadow-2xl
          "
        >
          <RadixSelect.Viewport>
            {options.map(
              (option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className="
                    relative flex
                    cursor-pointer
                    select-none
                    items-center
                    rounded-lg
                    px-2 py-2
                    pr-8
                    outline-none
                    transition-colors
                    data-[highlighted]:bg-slate-800
                  "
                >
                  <RadixSelect.ItemText>
                    <Pill
                      variant={
                        option.variant
                      }
                    >
                      {option.label}
                    </Pill>
                  </RadixSelect.ItemText>

                  <RadixSelect.ItemIndicator
                    className="
                      absolute right-2
                      text-slate-300
                    "
                  >
                    <Check size={15} />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ),
            )}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

export default PillSelect