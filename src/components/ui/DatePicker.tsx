import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import {
  CalendarDays,
  X,
} from 'lucide-react'
import {
  DayPicker,
  getDefaultClassNames,
} from 'react-day-picker'

import 'react-day-picker/style.css'

import {
  formatDate,
  parseDateValue,
  toDateValue,
} from '../../lib/date'

type DatePickerProps = {
  value: string | null
  onChange: (
    value: string | null,
  ) => void
  placeholder?: string
  disabled?: boolean
  compact?: boolean
}

function DatePicker({
  value,
  onChange,
  placeholder = 'No due date',
  disabled = false,
  compact = false,
}: DatePickerProps) {
  const [open, setOpen] =
    useState(false)

  const selectedDate =
    parseDateValue(value)

  const defaultClassNames =
    getDefaultClassNames()

  const today = new Date()

  const startMonth =
    new Date(
      today.getFullYear() - 5,
      0,
      1,
    )

  const endMonth =
    new Date(
      today.getFullYear() + 15,
      11,
      1,
    )

  function getRelativeDate(
    days: number,
  ) {
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + days,
    )
  }

  function selectDate(
    date: Date,
  ) {
    onChange(toDateValue(date))
    setOpen(false)
  }

  function handleSelect(
    date: Date | undefined,
  ) {
    if (!date) {
      return
    }

    selectDate(date)
  }

  function handleClear() {
    onChange(null)
    setOpen(false)
  }

  return (
    <div
      className={`
        inline-flex
        items-center
        border
        transition-all

        ${
          compact
            ? `
              rounded-full
              border-slate-700
              bg-slate-800
              text-xs
              font-medium
              text-slate-300
            `
            : `
              min-h-10
              rounded-xl
              border-slate-700
              bg-slate-900
              text-sm
              text-slate-200
            `
        }

        ${
          disabled
            ? 'opacity-50'
            : `
              hover:border-slate-600
              hover:bg-slate-800
            `
        }
      `}
    >
      <Popover.Root
        open={open}
        onOpenChange={setOpen}
      >
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`
              inline-flex
              items-center
              gap-1.5
              outline-none

              ${
                compact
                  ? `
                    px-2.5 py-1
                    ${
                      value
                        ? 'pr-1.5'
                        : ''
                    }
                  `
                  : `
                    px-3 py-2
                    ${
                      value
                        ? 'pr-2'
                        : ''
                    }
                  `
              }

              active:scale-95
              disabled:cursor-not-allowed
            `}
          >
            <CalendarDays
              size={
                compact
                  ? 13
                  : 16
              }
            />

            <span>
              {value
                ? formatDate(value)
                : placeholder}
            </span>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            sideOffset={8}
            align="start"
            className="
              z-50
              w-[340px]
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              p-3
              text-slate-200
              shadow-2xl
            "
          >
            <div className="mb-3 flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() =>
                  selectDate(today)
                }
                className="
                  rounded-full
                  bg-slate-800
                  px-3 py-1.5
                  text-xs
                  text-slate-200
                  transition
                  hover:bg-slate-700
                "
              >
                Today
              </button>

              <button
                type="button"
                onClick={() =>
                  selectDate(
                    getRelativeDate(
                      1,
                    ),
                  )
                }
                className="
                  rounded-full
                  bg-slate-800
                  px-3 py-1.5
                  text-xs
                  text-slate-200
                  transition
                  hover:bg-slate-700
                "
              >
                Tomorrow
              </button>

              <button
                type="button"
                onClick={() =>
                  selectDate(
                    getRelativeDate(
                      7,
                    ),
                  )
                }
                className="
                  rounded-full
                  bg-slate-800
                  px-3 py-1.5
                  text-xs
                  text-slate-200
                  transition
                  hover:bg-slate-700
                "
              >
                +1 week
              </button>

              <button
                type="button"
                onClick={
                  handleClear
                }
                className="
                  rounded-full
                  px-3 py-1.5
                  text-xs
                  text-slate-500
                  transition
                  hover:bg-slate-800
                  hover:text-slate-200
                "
              >
                No due date
              </button>
            </div>

            <DayPicker
              mode="single"
              selected={
                selectedDate
              }
              onSelect={
                handleSelect
              }
              defaultMonth={
                selectedDate ??
                today
              }
              weekStartsOn={1}
              fixedWeeks
              showOutsideDays
              captionLayout="dropdown"
              navLayout="after"
              startMonth={
                startMonth
              }
              endMonth={
                endMonth
              }
              animate
              classNames={{
                root: `
                  ${defaultClassNames.root}
                  w-full
                `,

                dropdowns: `
                  ${defaultClassNames.dropdowns}
                  flex gap-2
                `,

                dropdown: `
                  ${defaultClassNames.dropdown}
                  cursor-pointer
                  rounded-lg
                  border
                  border-slate-700
                  bg-slate-800
                  px-2 py-1
                  text-sm
                  text-slate-200
                  outline-none
                `,

                weekday: `
                  ${defaultClassNames.weekday}
                  text-xs
                  font-medium
                  text-slate-500
                `,

                day_button: `
                  ${defaultClassNames.day_button}
                  rounded-lg
                  transition
                  hover:bg-slate-800
                `,

                selected: `
                  ${defaultClassNames.selected}
                  rounded-lg
                  bg-sky-500
                  font-semibold
                  text-slate-950
                `,

                today: `
                  ${defaultClassNames.today}
                  font-semibold
                  text-sky-300
                `,

                outside: `
                  ${defaultClassNames.outside}
                  text-slate-600
                `,

                chevron: `
                  ${defaultClassNames.chevron}
                  fill-slate-400
                `,
              }}
            />

            <Popover.Arrow
              className="fill-slate-700"
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear due date"
          title="Clear due date"
          className={`
            flex
            shrink-0
            items-center
            justify-center
            text-slate-500
            outline-none
            transition

            hover:text-slate-200
            active:scale-90

            ${
              compact
                ? `
                  mr-1
                  size-5
                  rounded-full
                  hover:bg-slate-700
                `
                : `
                  mr-1.5
                  size-7
                  rounded-lg
                  hover:bg-slate-700
                `
            }
          `}
        >
          <X
            size={
              compact
                ? 12
                : 14
            }
            strokeWidth={2.5}
          />
        </button>
      )}
    </div>
  )
}

export default DatePicker