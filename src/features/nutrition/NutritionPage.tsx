import {
  useState,
  type SyntheticEvent,
} from 'react'

import * as Dialog from '@radix-ui/react-dialog'

import {
  Barcode,
  Camera,
  ChevronLeft,
  ChevronRight,
  Flame,
  ImagePlus,
  Pencil,
  Plus,
  ScanLine,
  Sparkles,
  Trash2,
  Utensils,
  X,
} from 'lucide-react'

import {
  parseDateValue,
  toDateValue,
} from '../../lib/date'

import {
  useNutrition,
} from './useNutrition'

import type {
  NutritionDailySummary,
  NutritionLog,
  SetNutritionTargetInput,
  UpdateNutritionLogInput,
} from './nutritionTypes'

type EntryMode =
  | 'manual'
  | 'barcode'
  | 'ai'

function NutritionPage() {
  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    toDateValue(
      new Date(),
    ),
  )

  const [
    entryMode,
    setEntryMode,
  ] =
    useState<EntryMode>(
      'manual',
    )

  const {
    logs,
    dailySummary,
    weekSummary,
    target,
    isLoading,
    error,
    addManualLog,
    saveLog,
    removeLog,
    saveTarget,
  } =
    useNutrition(
      selectedDate,
    )

  const selectedDateObject =
    parseDateValue(
      selectedDate,
    ) ?? new Date()

  const isToday =
    selectedDate ===
    toDateValue(
      new Date(),
    )

  function moveDate(
    amount: number,
  ) {
    const next =
      new Date(
        selectedDateObject,
      )

    next.setDate(
      next.getDate() +
        amount,
    )

    setSelectedDate(
      toDateValue(next),
    )
  }

  function goToday() {
    setSelectedDate(
      toDateValue(
        new Date(),
      ),
    )
  }

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-6xl
        space-y-6
        pb-28
      "
    >
      {/* Header */}
      <header>
        <p
          className="
            mb-1
            text-sm
            font-medium
            text-slate-500
          "
        >
          Fuel the day
        </p>

        <div
          className="
            flex
            flex-wrap
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-slate-100

                sm:text-4xl
              "
            >
              Nutrition
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              Track what you eat
              without turning food
              into homework.
            </p>
          </div>

          <TargetDialog
            selectedDate={
              selectedDate
            }
            target={target}
            onSave={
              saveTarget
            }
          />
        </div>
      </header>

      {/* Date navigator */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-3

          rounded-2xl
          border
          border-slate-800
          bg-slate-900/60

          p-2
        "
      >
        <button
          type="button"
          aria-label="Previous day"
          onClick={() =>
            moveDate(-1)
          }
          className="
            flex size-10
            items-center
            justify-center

            rounded-xl
            text-slate-400

            transition

            hover:bg-slate-800
            hover:text-slate-100
          "
        >
          <ChevronLeft
            size={19}
          />
        </button>

        <button
          type="button"
          onClick={goToday}
          className="
            min-w-0
            flex-1

            rounded-xl
            px-3 py-2

            text-center

            transition

            hover:bg-slate-800
          "
        >
          <span
            className="
              block
              truncate

              text-sm
              font-semibold
              text-slate-200
            "
          >
            {formatSelectedDate(
              selectedDateObject,
            )}
          </span>

          <span
            className="
              mt-0.5
              block

              text-xs
              text-slate-500
            "
          >
            {isToday
              ? 'Today'
              : 'Tap to return to today'}
          </span>
        </button>

        <button
          type="button"
          aria-label="Next day"
          onClick={() =>
            moveDate(1)
          }
          className="
            flex size-10
            items-center
            justify-center

            rounded-xl
            text-slate-400

            transition

            hover:bg-slate-800
            hover:text-slate-100
          "
        >
          <ChevronRight
            size={19}
          />
        </button>
      </div>

      {error && (
        <div
          className="
            rounded-2xl
            border
            border-red-900/40
            bg-red-950/20
            p-4

            text-sm
            text-red-300
          "
        >
          {error}
        </div>
      )}

      {isLoading &&
      !dailySummary ? (
        <NutritionSkeleton />
      ) : (
        <>
          {/* Main summary */}
          <NutritionSummary
            summary={
              dailySummary
            }
          />

          {/* Weekly chart */}
          <WeeklyCaloriesChart
            data={
              weekSummary
            }
            selectedDate={
              selectedDate
            }
            onSelectDate={
              setSelectedDate
            }
          />

          {/* Logging methods */}
          <section
            className="
              overflow-hidden

              rounded-3xl

              border
              border-slate-800

              bg-slate-900/50
            "
          >
            <div
              className="
                border-b
                border-slate-800

                p-4

                sm:p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <div
                  className="
                    flex size-9
                    items-center
                    justify-center

                    rounded-xl

                    bg-sky-400/10
                    text-sky-300
                  "
                >
                  <Plus
                    size={18}
                  />
                </div>

                <div>
                  <h2
                    className="
                      font-semibold
                      text-slate-200
                    "
                  >
                    Add food
                  </h2>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Pick the fastest
                    way to log it.
                  </p>
                </div>
              </div>

              <EntryModeSwitcher
                value={
                  entryMode
                }
                onChange={
                  setEntryMode
                }
              />
            </div>

            <div
              className="
                p-4

                sm:p-5
              "
            >
              {entryMode ===
                'manual' && (
                <ManualEntryForm
                  selectedDate={
                    selectedDate
                  }
                  onAdd={
                    addManualLog
                  }
                />
              )}

              {entryMode ===
                'barcode' && (
                <BarcodePanel />
              )}

              {entryMode ===
                'ai' && (
                <AiPanel />
              )}
            </div>
          </section>

          {/* Food log */}
          <NutritionLogList
            logs={logs}
            onSave={saveLog}
            onDelete={removeLog}
          />
        </>
      )}
    </div>
  )
}

/* ======================================================
   DAILY SUMMARY
====================================================== */

function NutritionSummary({
  summary,
}: {
  summary:
    | NutritionDailySummary
    | null
}) {
  if (!summary) {
    return null
  }

  const target =
    summary
      .targetCaloriesKcal

  const calories =
    summary.caloriesKcal

  const remaining =
    target === null
      ? null
      : target -
        calories

  return (
    <section
      className="
        grid
        gap-4

        lg:grid-cols-[1.15fr_1fr]
      "
    >
      {/* Calorie hero */}
      <div
        className="
          relative
          overflow-hidden

          rounded-3xl

          border
          border-slate-800

          bg-slate-900

          p-5

          sm:p-7
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute
            -right-16
            -top-16

            size-48
            rounded-full

            bg-sky-400/5

            blur-2xl
          "
        />

        <div
          className="
            relative

            flex
            flex-col
            gap-6

            sm:flex-row
            sm:items-center
          "
        >
          <CalorieRing
            consumed={
              calories
            }
            target={
              target
            }
          />

          <div className="min-w-0">
            <div
              className="
                flex
                items-center
                gap-2

                text-sm
                font-medium
                text-slate-500
              "
            >
              <Flame
                size={16}
              />

              Calories
            </div>

            <div
              className="
                mt-2
                flex
                flex-wrap
                items-baseline
                gap-x-2
              "
            >
              <span
                className="
                  text-4xl
                  font-black
                  tracking-tight
                  text-slate-100
                "
              >
                {formatNumber(
                  calories,
                )}
              </span>

              <span
                className="
                  text-sm
                  text-slate-500
                "
              >
                {target !==
                null
                  ? `/ ${formatNumber(
                      target,
                    )} kcal`
                  : 'kcal'}
              </span>
            </div>

            {remaining !==
            null ? (
              <p
                className={`
                  mt-2
                  text-sm
                  font-medium

                  ${
                    remaining >=
                    0
                      ? 'text-sky-300'
                      : 'text-amber-300'
                  }
                `}
              >
                {remaining >=
                0
                  ? `${formatNumber(
                      remaining,
                    )} kcal remaining`
                  : `${formatNumber(
                      Math.abs(
                        remaining,
                      ),
                    )} kcal over today's target`}
              </p>
            ) : (
              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                Set a daily target to
                see your remaining
                calories.
              </p>
            )}

            {target !==
              null && (
              <p
                className="
                  mt-4
                  max-w-sm

                  text-xs
                  leading-5
                  text-slate-600
                "
              >
                Your target is a
                reference point, not
                a pass/fail score.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Macros */}
      <div
        className="
          grid
          gap-3

          sm:grid-cols-3
          lg:grid-cols-1
        "
      >
        <MacroCard
          label="Protein"
          shortLabel="P"
          consumed={
            summary
              .proteinGrams
          }
          target={
            summary
              .targetProteinGrams
          }
          accent="sky"
        />

        <MacroCard
          label="Carbs"
          shortLabel="C"
          consumed={
            summary
              .carbsGrams
          }
          target={
            summary
              .targetCarbsGrams
          }
          accent="violet"
        />

        <MacroCard
          label="Fat"
          shortLabel="F"
          consumed={
            summary
              .fatGrams
          }
          target={
            summary
              .targetFatGrams
          }
          accent="amber"
        />
      </div>
    </section>
  )
}

function CalorieRing({
  consumed,
  target,
}: {
  consumed: number
  target: number | null
}) {
  const radius = 52
  const circumference =
    2 *
    Math.PI *
    radius

  const ratio =
    target &&
    target > 0
      ? consumed /
        target
      : 0

  const progress =
    Math.min(
      ratio,
      1,
    )

  const offset =
    circumference *
    (1 -
      progress)

  const over =
    target !== null &&
    consumed >
      target

  return (
    <div
      className="
        relative
        mx-auto
        size-36
        shrink-0

        sm:mx-0
      "
    >
      <svg
        viewBox="0 0 128 128"
        className="
          size-full
          -rotate-90
        "
        aria-hidden="true"
      >
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          className="text-slate-800"
        />

        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={
            circumference
          }
          strokeDashoffset={
            offset
          }
          className={`
            transition-all
            duration-500

            ${
              over
                ? 'text-amber-400'
                : 'text-sky-400'
            }
          `}
        />
      </svg>

      <div
        className="
          absolute
          inset-0

          flex
          flex-col
          items-center
          justify-center
        "
      >
        <span
          className="
            text-2xl
            font-black
            text-slate-100
          "
        >
          {target
            ? `${Math.round(
                ratio *
                  100,
              )}%`
            : '—'}
        </span>

        <span
          className="
            mt-0.5
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-slate-600
          "
        >
          of target
        </span>
      </div>
    </div>
  )
}

type MacroAccent =
  | 'sky'
  | 'violet'
  | 'amber'

function MacroCard({
  label,
  shortLabel,
  consumed,
  target,
  accent,
}: {
  label: string
  shortLabel: string
  consumed: number
  target: number | null
  accent: MacroAccent
}) {
  const progress =
    target &&
    target > 0
      ? Math.min(
          consumed /
            target,
          1,
        )
      : 0

  const accentClasses = {
    sky: {
      bubble:
        'bg-sky-400/10 text-sky-300',
      bar:
        'bg-sky-400',
    },

    violet: {
      bubble:
        'bg-violet-400/10 text-violet-300',
      bar:
        'bg-violet-400',
    },

    amber: {
      bubble:
        'bg-amber-400/10 text-amber-300',
      bar:
        'bg-amber-400',
    },
  }[accent]

  return (
    <div
      className="
        rounded-2xl

        border
        border-slate-800

        bg-slate-900/70

        p-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <div
          className={`
            flex size-9
            shrink-0
            items-center
            justify-center

            rounded-xl

            text-xs
            font-black

            ${accentClasses.bubble}
          `}
        >
          {shortLabel}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              items-baseline
              justify-between
              gap-2
            "
          >
            <span
              className="
                text-sm
                font-medium
                text-slate-400
              "
            >
              {label}
            </span>

            <span
              className="
                text-sm
                font-semibold
                text-slate-200
              "
            >
              {formatNumber(
                consumed,
              )}
              g

              {target !==
                null && (
                <span
                  className="
                    font-normal
                    text-slate-600
                  "
                >
                  {' '}
                  /{' '}
                  {formatNumber(
                    target,
                  )}
                  g
                </span>
              )}
            </span>
          </div>

          <div
            className="
              mt-2
              h-1.5
              overflow-hidden
              rounded-full
              bg-slate-800
            "
          >
            {target !==
              null && (
              <div
                style={{
                  width: `${progress * 100}%`,
                }}
                className={`
                  h-full
                  rounded-full
                  transition-all
                  duration-500

                  ${accentClasses.bar}
                `}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ======================================================
   WEEK CHART
====================================================== */

function WeeklyCaloriesChart({
  data,
  selectedDate,
  onSelectDate,
}: {
  data:
    NutritionDailySummary[]

  selectedDate: string

  onSelectDate: (
    value: string,
  ) => void
}) {
  const maxValue =
    Math.max(
      1,
      ...data.map(
        (day) =>
          Math.max(
            day.caloriesKcal,
            day.targetCaloriesKcal ??
              0,
          ),
      ),
    )

  const total =
    data.reduce(
      (sum, day) =>
        sum +
        day.caloriesKcal,
      0,
    )

  const daysWithData =
    data.filter(
      (day) =>
        day.caloriesKcal >
        0,
    ).length

  const average =
    daysWithData > 0
      ? total /
        daysWithData
      : 0

  return (
    <section
      className="
        rounded-3xl

        border
        border-slate-800

        bg-slate-900/50

        p-4

        sm:p-6
      "
    >
      <div
        className="
          mb-5
          flex
          flex-wrap
          items-end
          justify-between
          gap-3
        "
      >
        <div>
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-slate-600
            "
          >
            This week
          </p>

          <h2
            className="
              mt-1
              text-lg
              font-semibold
              text-slate-200
            "
          >
            Daily calories
          </h2>
        </div>

        <div
          className="
            text-right
          "
        >
          <p
            className="
              text-xs
              text-slate-600
            "
          >
            Average logged day
          </p>

          <p
            className="
              mt-0.5
              font-semibold
              text-slate-300
            "
          >
            {formatNumber(
              average,
            )}{' '}
            kcal
          </p>
        </div>
      </div>

      <div
        className="
          grid
          h-48
          grid-cols-7
          items-end
          gap-2

          sm:gap-3
        "
      >
        {data.map(
          (day) => {
            const barHeight =
              Math.max(
                day.caloriesKcal >
                  0
                  ? 5
                  : 0,
                (day.caloriesKcal /
                  maxValue) *
                  100,
              )

            const targetHeight =
              day.targetCaloriesKcal
                ? (day.targetCaloriesKcal /
                    maxValue) *
                  100
                : null

            const selected =
              day.date ===
              selectedDate

            const over =
              day.targetCaloriesKcal !==
                null &&
              day.caloriesKcal >
                day.targetCaloriesKcal

            return (
              <button
                key={
                  day.date
                }
                type="button"
                onClick={() =>
                  onSelectDate(
                    day.date,
                  )
                }
                className="
                  group
                  flex h-full
                  min-w-0
                  flex-col
                  justify-end

                  rounded-xl

                  outline-none

                  focus-visible:ring-2
                  focus-visible:ring-sky-500/50
                "
              >
                <div
                  className="
                    relative
                    flex-1

                    rounded-xl

                    bg-slate-950/60
                  "
                >
                  {targetHeight !==
                    null && (
                    <div
                      style={{
                        bottom: `${Math.min(
                          targetHeight,
                          100,
                        )}%`,
                      }}
                      className="
                        absolute
                        left-1
                        right-1

                        border-t
                        border-dashed
                        border-slate-600
                      "
                    />
                  )}

                  <div
                    style={{
                      height: `${Math.min(
                        barHeight,
                        100,
                      )}%`,
                    }}
                    className={`
                      absolute
                      bottom-0
                      left-1
                      right-1

                      rounded-lg
                      rounded-b-xl

                      transition-all
                      duration-300

                      ${
                        over
                          ? 'bg-amber-400/70'
                          : selected
                            ? 'bg-sky-400'
                            : 'bg-sky-400/45 group-hover:bg-sky-400/70'
                      }
                    `}
                  />

                  {day.caloriesKcal >
                    0 && (
                    <span
                      className="
                        absolute
                        left-1/2
                        top-2
                        -translate-x-1/2

                        text-[9px]
                        font-semibold
                        text-slate-500

                        sm:text-[10px]
                      "
                    >
                      {Math.round(
                        day.caloriesKcal,
                      )}
                    </span>
                  )}
                </div>

                <div
                  className="
                    pt-2
                    text-center
                  "
                >
                  <span
                    className={`
                      block
                      text-[10px]
                      font-semibold
                      uppercase

                      ${
                        selected
                          ? 'text-sky-300'
                          : 'text-slate-600'
                      }
                    `}
                  >
                    {formatWeekday(
                      day.date,
                    )}
                  </span>

                  <span
                    className={`
                      mt-0.5
                      block
                      text-xs

                      ${
                        selected
                          ? 'font-semibold text-slate-200'
                          : 'text-slate-500'
                      }
                    `}
                  >
                    {formatDayNumber(
                      day.date,
                    )}
                  </span>
                </div>
              </button>
            )
          },
        )}
      </div>

      <div
        className="
          mt-3
          flex
          items-center
          gap-2

          text-[10px]
          text-slate-600
        "
      >
        <span
          className="
            w-5
            border-t
            border-dashed
            border-slate-600
          "
        />

        Daily target
      </div>
    </section>
  )
}

/* ======================================================
   ENTRY MODES
====================================================== */

function EntryModeSwitcher({
  value,
  onChange,
}: {
  value: EntryMode

  onChange: (
    value: EntryMode,
  ) => void
}) {
  const options: {
    value: EntryMode
    label: string
    icon:
      typeof Utensils
  }[] = [
    {
      value: 'manual',
      label: 'Manual',
      icon: Utensils,
    },
    {
      value: 'barcode',
      label: 'Scan',
      icon: ScanLine,
    },
    {
      value: 'ai',
      label: 'AI Photo',
      icon: Sparkles,
    },
  ]

  return (
    <div
      className="
        mt-5

        grid
        grid-cols-3
        gap-1

        rounded-2xl

        bg-slate-950/70

        p-1
      "
    >
      {options.map(
        (option) => {
          const Icon =
            option.icon

          const active =
            option.value ===
            value

          return (
            <button
              key={
                option.value
              }
              type="button"
              onClick={() =>
                onChange(
                  option.value,
                )
              }
              className={`
                flex
                min-w-0
                items-center
                justify-center
                gap-1.5

                rounded-xl

                px-2
                py-2.5

                text-xs
                font-medium

                transition

                ${
                  active
                    ? `
                      bg-slate-800
                      text-slate-100
                      shadow-sm
                    `
                    : `
                      text-slate-500
                      hover:text-slate-300
                    `
                }
              `}
            >
              <Icon
                size={15}
              />

              <span className="truncate">
                {option.label}
              </span>
            </button>
          )
        },
      )}
    </div>
  )
}

/* ======================================================
   MANUAL ENTRY
====================================================== */

function ManualEntryForm({
  selectedDate,
  onAdd,
}: {
  selectedDate: string

  onAdd: (input: {
    foodName: string
    caloriesKcal: number
    carbsGrams: number
    proteinGrams: number
    fatGrams: number
    consumedAt: string
  }) => Promise<unknown>
}) {
  const [
    foodName,
    setFoodName,
  ] = useState('')

  const [
    calories,
    setCalories,
  ] = useState('')

  const [
    protein,
    setProtein,
  ] = useState('')

  const [
    carbs,
    setCarbs,
  ] = useState('')

  const [
    fat,
    setFat,
  ] = useState('')

  const [
    time,
    setTime,
  ] = useState(
    currentLocalTime(),
  )

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    )

  async function handleSubmit(
    event: SyntheticEvent<
      HTMLFormElement,
      SubmitEvent
    >,
  ) {
    event.preventDefault()

    const trimmedName =
      foodName.trim()

    if (!trimmedName) {
      setError(
        'Enter a food name.',
      )
      return
    }

    const calorieValue =
      Number(calories)

    if (
      !Number.isFinite(
        calorieValue,
      ) ||
      calorieValue < 0
    ) {
      setError(
        'Enter valid calories.',
      )
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      await onAdd({
        foodName:
          trimmedName,

        caloriesKcal:
          calorieValue,

        proteinGrams:
          parseOptionalNumber(
            protein,
          ),

        carbsGrams:
          parseOptionalNumber(
            carbs,
          ),

        fatGrams:
          parseOptionalNumber(
            fat,
          ),

        consumedAt:
          createLocalOffsetIso(
            selectedDate,
            time,
          ),
      })

      setFoodName('')
      setCalories('')
      setProtein('')
      setCarbs('')
      setFat('')
    } catch (error) {
      console.error(error)

      setError(
        'Could not add this food.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-4"
    >
      <div
        className="
          grid
          gap-3

          md:grid-cols-[1.5fr_0.6fr]
        "
      >
        <label>
          <span
            className="
              mb-1.5
              block

              text-xs
              font-medium
              text-slate-500
            "
          >
            Food
          </span>

          <input
            value={foodName}
            onChange={(
              event,
            ) =>
              setFoodName(
                event
                  .currentTarget
                  .value,
              )
            }
            maxLength={200}
            placeholder="What did you eat?"
            className={inputClassName}
          />
        </label>

        <label>
          <span
            className="
              mb-1.5
              block

              text-xs
              font-medium
              text-slate-500
            "
          >
            Calories
          </span>

          <div className="relative">
            <input
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={
                calories
              }
              onChange={(
                event,
              ) =>
                setCalories(
                  event
                    .currentTarget
                    .value,
                )
              }
              placeholder="0"
              className={`
                ${inputClassName}
                pr-14
              `}
            />

            <span
              className="
                pointer-events-none

                absolute
                right-3
                top-1/2

                -translate-y-1/2

                text-xs
                text-slate-600
              "
            >
              kcal
            </span>
          </div>
        </label>
      </div>

      <div
        className="
          grid
          grid-cols-3
          gap-3
        "
      >
        <MacroInput
          label="Protein"
          value={protein}
          onChange={
            setProtein
          }
        />

        <MacroInput
          label="Carbs"
          value={carbs}
          onChange={
            setCarbs
          }
        />

        <MacroInput
          label="Fat"
          value={fat}
          onChange={
            setFat
          }
        />
      </div>

      <div
        className="
          flex
          flex-wrap
          items-end
          justify-between
          gap-3
        "
      >
        <label>
          <span
            className="
              mb-1.5
              block

              text-xs
              font-medium
              text-slate-500
            "
          >
            Time
          </span>

          <input
            type="time"
            value={time}
            onChange={(
              event,
            ) =>
              setTime(
                event
                  .currentTarget
                  .value,
              )
            }
            className="
              rounded-xl
              border
              border-slate-800

              bg-slate-950

              px-3
              py-2.5

              text-sm
              text-slate-300

              outline-none

              focus:border-sky-500
              focus:ring-2
              focus:ring-sky-500/20
            "
          />
        </label>

        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2

            rounded-xl

            bg-sky-400

            px-5
            py-2.5

            text-sm
            font-semibold
            text-slate-950

            transition

            hover:bg-sky-300
            active:scale-[0.98]

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Plus
            size={17}
          />

          {isSubmitting
            ? 'Adding...'
            : 'Add food'}
        </button>
      </div>

      {error && (
        <p
          className="
            text-sm
            text-red-300
          "
        >
          {error}
        </p>
      )}
    </form>
  )
}

function MacroInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string

  onChange: (
    value: string,
  ) => void
}) {
  return (
    <label>
      <span
        className="
          mb-1.5
          block

          text-xs
          font-medium
          text-slate-500
        "
      >
        {label}
      </span>

      <div className="relative">
        <input
          type="number"
          min="0"
          step="0.1"
          inputMode="decimal"
          value={value}
          onChange={(
            event,
          ) =>
            onChange(
              event
                .currentTarget
                .value,
            )
          }
          placeholder="0"
          className={`
            ${inputClassName}
            pr-8
          `}
        />

        <span
          className="
            pointer-events-none

            absolute
            right-3
            top-1/2

            -translate-y-1/2

            text-xs
            text-slate-600
          "
        >
          g
        </span>
      </div>
    </label>
  )
}

/* ======================================================
   BARCODE / AI PLACEHOLDERS
====================================================== */

function BarcodePanel() {
  return (
    <div
      className="
        flex
        flex-col
        items-center

        rounded-2xl

        border
        border-dashed
        border-slate-700

        px-6
        py-10

        text-center
      "
    >
      <div
        className="
          flex size-14
          items-center
          justify-center

          rounded-2xl

          bg-violet-400/10
          text-violet-300
        "
      >
        <Barcode
          size={27}
        />
      </div>

      <h3
        className="
          mt-4
          font-semibold
          text-slate-200
        "
      >
        Scan packaged food
      </h3>

      <p
        className="
          mt-2
          max-w-sm

          text-sm
          leading-6
          text-slate-500
        "
      >
        Scan a barcode and
        Trackline will look up
        its nutrition details
        before you add it.
      </p>

      <button
        type="button"
        disabled
        className="
          mt-5

          inline-flex
          min-h-11
          items-center
          gap-2

          rounded-xl

          border
          border-slate-700

          px-4
          py-2.5

          text-sm
          font-medium
          text-slate-500

          opacity-70
        "
      >
        <Camera
          size={17}
        />

        Scanner coming next
      </button>
    </div>
  )
}

function AiPanel() {
  return (
    <div
      className="
        grid
        gap-5

        lg:grid-cols-[0.85fr_1.15fr]
      "
    >
      <div
        className="
          flex
          min-h-52
          flex-col
          items-center
          justify-center

          rounded-2xl

          border
          border-dashed
          border-slate-700

          p-6

          text-center
        "
      >
        <div
          className="
            flex size-14
            items-center
            justify-center

            rounded-2xl

            bg-fuchsia-400/10
            text-fuchsia-300
          "
        >
          <ImagePlus
            size={26}
          />
        </div>

        <p
          className="
            mt-3
            text-sm
            font-medium
            text-slate-300
          "
        >
          Add a food photo
        </p>

        <p
          className="
            mt-1
            text-xs
            text-slate-600
          "
        >
          Camera or image
          upload
        </p>
      </div>

      <div>
        <div
          className="
            flex
            items-center
            gap-2

            text-sm
            font-semibold
            text-slate-200
          "
        >
          <Sparkles
            size={16}
            className="text-fuchsia-300"
          />

          AI food analysis
        </div>

        <p
          className="
            mt-2

            text-sm
            leading-6
            text-slate-500
          "
        >
          Add context if the
          photo alone might be
          ambiguous.
        </p>

        <textarea
          disabled
          rows={3}
          placeholder="e.g. Chicken curry with about one cup of basmati rice..."
          className="
            mt-4
            w-full
            resize-none

            rounded-2xl

            border
            border-slate-800

            bg-slate-950

            px-4
            py-3

            text-sm
            text-slate-400

            outline-none

            placeholder:text-slate-700

            disabled:opacity-70
          "
        />

        <button
          type="button"
          disabled
          className="
            mt-3
            inline-flex
            min-h-11
            w-full
            items-center
            justify-center
            gap-2

            rounded-xl

            bg-fuchsia-400/10

            px-4
            py-2.5

            text-sm
            font-semibold
            text-fuchsia-300

            opacity-70
          "
        >
          <Sparkles
            size={17}
          />

          AI integration coming next
        </button>
      </div>
    </div>
  )
}

/* ======================================================
   LOG LIST
====================================================== */

function NutritionLogList({
  logs,
  onSave,
  onDelete,
}: {
  logs: NutritionLog[]

  onSave: (
    id: number,
    input:
      UpdateNutritionLogInput,
  ) => Promise<unknown>

  onDelete: (
    id: number,
  ) => Promise<void>
}) {
  const [
    deletingId,
    setDeletingId,
  ] =
    useState<number | null>(
      null,
    )

  const [
    editingLog,
    setEditingLog,
  ] =
    useState<NutritionLog | null>(
      null,
    )

  async function handleDelete(
    id: number,
  ) {
    try {
      setDeletingId(id)

      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <section>
        <div
          className="
            mb-3
            flex
            items-end
            justify-between
            gap-3
          "
        >
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-600
              "
            >
              Food log
            </p>

            <h2
              className="
                mt-1
                text-lg
                font-semibold
                text-slate-200
              "
            >
              What you logged
            </h2>
          </div>

          <span
            className="
              text-sm
              text-slate-600
            "
          >
            {logs.length}{' '}
            {logs.length === 1
              ? 'entry'
              : 'entries'}
          </span>
        </div>

        {logs.length === 0 ? (
          <div
            className="
              rounded-3xl
              border
              border-dashed
              border-slate-800
              px-6
              py-12
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                size-12
                items-center
                justify-center
                rounded-2xl
                bg-slate-900
                text-slate-600
              "
            >
              <Utensils
                size={22}
              />
            </div>

            <p
              className="
                mt-4
                text-sm
                font-medium
                text-slate-400
              "
            >
              Nothing logged yet.
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-600
              "
            >
              Add your first food
              above.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map(
              (log) => (
                <article
                  key={
                    log.id
                  }
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900/60
                    p-3
                    transition
                    hover:border-slate-700
                  "
                >
                  <div
                    className="
                      flex
                      size-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-slate-800
                      text-sm
                      font-bold
                      text-slate-400
                    "
                  >
                    {getFoodInitials(
                      log.foodName,
                    )}
                  </div>

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <div
                      className="
                        flex
                        flex-wrap
                        items-baseline
                        gap-x-2
                      "
                    >
                      <h3
                        className="
                          truncate
                          font-medium
                          text-slate-200
                        "
                      >
                        {
                          log.foodName
                        }
                      </h3>

                      <span
                        className="
                          text-xs
                          text-slate-600
                        "
                      >
                        {formatTime(
                          log.consumedAt,
                        )}
                      </span>
                    </div>

                    <div
                      className="
                        mt-1
                        flex
                        flex-wrap
                        gap-x-3
                        gap-y-1
                        text-xs
                        text-slate-500
                      "
                    >
                      <span
                        className="
                          font-semibold
                          text-slate-300
                        "
                      >
                        {formatNumber(
                          log.caloriesKcal,
                        )}{' '}
                        kcal
                      </span>

                      <span>
                        P{' '}
                        {formatNumber(
                          log.proteinGrams,
                        )}
                        g
                      </span>

                      <span>
                        C{' '}
                        {formatNumber(
                          log.carbsGrams,
                        )}
                        g
                      </span>

                      <span>
                        F{' '}
                        {formatNumber(
                          log.fatGrams,
                        )}
                        g
                      </span>
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                    "
                  >
                    <button
                      type="button"
                      aria-label={`Edit ${log.foodName}`}
                      onClick={() =>
                        setEditingLog(
                          log,
                        )
                      }
                      className="
                        flex
                        size-9
                        items-center
                        justify-center
                        rounded-xl
                        text-slate-600
                        transition
                        hover:bg-sky-400/10
                        hover:text-sky-300
                      "
                    >
                      <Pencil
                        size={15}
                      />
                    </button>

                    <button
                      type="button"
                      disabled={
                        deletingId ===
                        log.id
                      }
                      aria-label={`Delete ${log.foodName}`}
                      onClick={() => {
                        void handleDelete(
                          log.id,
                        )
                      }}
                      className="
                        flex
                        size-9
                        items-center
                        justify-center
                        rounded-xl
                        text-slate-600
                        transition
                        hover:bg-rose-400/10
                        hover:text-rose-300
                        disabled:opacity-40
                      "
                    >
                      <Trash2
                        size={15}
                      />
                    </button>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>

      {editingLog && (
        <EditNutritionLogDialog
          log={editingLog}
          open
          onOpenChange={(
            open,
          ) => {
            if (!open) {
              setEditingLog(
                null,
              )
            }
          }}
          onSave={onSave}
        />
      )}
    </>
  )
}

function EditNutritionLogDialog({
  log,
  open,
  onOpenChange,
  onSave,
}: {
  log: NutritionLog

  open: boolean

  onOpenChange: (
    open: boolean,
  ) => void

  onSave: (
    id: number,
    input:
      UpdateNutritionLogInput,
  ) => Promise<unknown>
}) {
  const [
    foodName,
    setFoodName,
  ] = useState(
    log.foodName,
  )

  const [
    calories,
    setCalories,
  ] = useState(
    String(
      log.caloriesKcal,
    ),
  )

  const [
    protein,
    setProtein,
  ] = useState(
    String(
      log.proteinGrams,
    ),
  )

  const [
    carbs,
    setCarbs,
  ] = useState(
    String(
      log.carbsGrams,
    ),
  )

  const [
    fat,
    setFat,
  ] = useState(
    String(
      log.fatGrams,
    ),
  )

  const [
    time,
    setTime,
  ] = useState(
    timeValueFromIso(
      log.consumedAt,
    ),
  )

  const [
    isSaving,
    setIsSaving,
  ] = useState(false)

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    )

  async function handleSubmit(
    event: SyntheticEvent<
      HTMLFormElement,
      SubmitEvent
    >,
  ) {
    event.preventDefault()

    const trimmedName =
      foodName.trim()

    if (!trimmedName) {
      setError(
        'Enter a food name.',
      )

      return
    }

    const calorieValue =
      Number(calories)

    const proteinValue =
      Number(protein)

    const carbsValue =
      Number(carbs)

    const fatValue =
      Number(fat)

    const values = [
      calorieValue,
      proteinValue,
      carbsValue,
      fatValue,
    ]

    if (
      values.some(
        (value) =>
          !Number.isFinite(
            value,
          ) ||
          value < 0,
      )
    ) {
      setError(
        'Nutrition values must be valid numbers.',
      )

      return
    }

    try {
      setIsSaving(true)
      setError(null)

      await onSave(
        log.id,
        {
          foodName:
            trimmedName,

          caloriesKcal:
            calorieValue,

          proteinGrams:
            proteinValue,

          carbsGrams:
            carbsValue,

          fatGrams:
            fatValue,

          consumedAt:
            createLocalOffsetIso(
              log.consumedDate,
              time,
            ),
        },
      )

      onOpenChange(
        false,
      )
    } catch (error) {
      console.error(error)

      setError(
        'Could not update this food.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed
            inset-0
            z-50
            bg-slate-950/70
            backdrop-blur-sm
          "
        />

        <Dialog.Content
          className="
            fixed
            bottom-0
            left-0
            right-0
            z-50
            max-h-[90vh]
            overflow-y-auto

            rounded-t-3xl

            border
            border-slate-800

            bg-slate-950

            p-5

            outline-none

            md:bottom-auto
            md:left-1/2
            md:right-auto
            md:top-1/2

            md:w-[520px]

            md:-translate-x-1/2
            md:-translate-y-1/2

            md:rounded-3xl
            md:p-6
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <Dialog.Title
                className="
                  text-xl
                  font-semibold
                  text-slate-100
                "
              >
                Edit food
              </Dialog.Title>

              <Dialog.Description
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Update the nutrition
                values for this entry.
              </Dialog.Description>
            </div>

            <Dialog.Close
              asChild
            >
              <button
                type="button"
                aria-label="Close"
                className="
                  flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-slate-500
                  transition
                  hover:bg-slate-800
                  hover:text-slate-200
                "
              >
                <X
                  size={17}
                />
              </button>
            </Dialog.Close>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="
              mt-6
              space-y-4
            "
          >
            <label>
              <span
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-slate-500
                "
              >
                Food
              </span>

              <input
                value={
                  foodName
                }
                onChange={(
                  event,
                ) =>
                  setFoodName(
                    event
                      .currentTarget
                      .value,
                  )
                }
                maxLength={
                  200
                }
                className={
                  inputClassName
                }
              />
            </label>

            <label>
              <span
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-slate-500
                "
              >
                Calories
              </span>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    calories
                  }
                  onChange={(
                    event,
                  ) =>
                    setCalories(
                      event
                        .currentTarget
                        .value,
                    )
                  }
                  className={`
                    ${inputClassName}
                    pr-14
                  `}
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-xs
                    text-slate-600
                  "
                >
                  kcal
                </span>
              </div>
            </label>

            <div
              className="
                grid
                grid-cols-3
                gap-3
              "
            >
              <MacroInput
                label="Protein"
                value={
                  protein
                }
                onChange={
                  setProtein
                }
              />

              <MacroInput
                label="Carbs"
                value={
                  carbs
                }
                onChange={
                  setCarbs
                }
              />

              <MacroInput
                label="Fat"
                value={
                  fat
                }
                onChange={
                  setFat
                }
              />
            </div>

            <label
              className="
                block
                max-w-40
              "
            >
              <span
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-slate-500
                "
              >
                Time
              </span>

              <input
                type="time"
                value={time}
                onChange={(
                  event,
                ) =>
                  setTime(
                    event
                      .currentTarget
                      .value,
                  )
                }
                className={
                  inputClassName
                }
              />
            </label>

            <div
              className="
                rounded-xl
                bg-slate-900
                px-3
                py-2.5
                text-xs
                text-slate-500
              "
            >
              Logged for{' '}
              <span
                className="
                  font-medium
                  text-slate-300
                "
              >
                {formatLogDate(
                  log.consumedDate,
                )}
              </span>
            </div>

            {error && (
              <p
                className="
                  text-sm
                  text-red-300
                "
              >
                {error}
              </p>
            )}

            <div
              className="
                flex
                gap-3
                pt-2
              "
            >
              <Dialog.Close
                asChild
              >
                <button
                  type="button"
                  className="
                    min-h-11
                    flex-1
                    rounded-xl
                    border
                    border-slate-800
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-400
                    transition
                    hover:bg-slate-900
                    hover:text-slate-200
                  "
                >
                  Cancel
                </button>
              </Dialog.Close>

              <button
                type="submit"
                disabled={
                  isSaving
                }
                className="
                  min-h-11
                  flex-1
                  rounded-xl
                  bg-sky-400
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-950
                  transition
                  hover:bg-sky-300
                  disabled:opacity-50
                "
              >
                {isSaving
                  ? 'Saving...'
                  : 'Save changes'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/* ======================================================
   TARGET DIALOG
====================================================== */

function TargetDialog({
  selectedDate,
  target,
  onSave,
}: {
  selectedDate: string

  target: {
    dailyCaloriesKcal: number

    dailyProteinGrams:
      | number
      | null

    dailyCarbsGrams:
      | number
      | null

    dailyFatGrams:
      | number
      | null
  } | null

  onSave: (
    input:
      SetNutritionTargetInput,
  ) => Promise<unknown>
}) {
  const [
    open,
    setOpen,
  ] = useState(false)

  const [
    calories,
    setCalories,
  ] = useState('')

  const [
    protein,
    setProtein,
  ] = useState('')

  const [
    carbs,
    setCarbs,
  ] = useState('')

  const [
    fat,
    setFat,
  ] = useState('')

  const [
    isSaving,
    setIsSaving,
  ] = useState(false)

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    )

  function handleOpenChange(
    nextOpen: boolean,
  ) {
    setOpen(nextOpen)

    if (nextOpen) {
      setCalories(
        target
          ? String(
              target.dailyCaloriesKcal,
            )
          : '',
      )

      setProtein(
        target
          ?.dailyProteinGrams !=
        null
          ? String(
              target.dailyProteinGrams,
            )
          : '',
      )

      setCarbs(
        target
          ?.dailyCarbsGrams !=
        null
          ? String(
              target.dailyCarbsGrams,
            )
          : '',
      )

      setFat(
        target
          ?.dailyFatGrams !=
        null
          ? String(
              target.dailyFatGrams,
            )
          : '',
      )

      setError(null)
    }
  }

  async function handleSubmit(
    event: SyntheticEvent<
      HTMLFormElement,
      SubmitEvent
    >,
  ) {
    event.preventDefault()

    const calorieValue =
      Number(calories)

    if (
      !Number.isFinite(
        calorieValue,
      ) ||
      calorieValue <= 0
    ) {
      setError(
        'Enter a valid calorie target.',
      )

      return
    }

    try {
      setIsSaving(true)
      setError(null)

      await onSave({
        dailyCaloriesKcal:
          calorieValue,

        dailyProteinGrams:
          parseNullableNumber(
            protein,
          ),

        dailyCarbsGrams:
          parseNullableNumber(
            carbs,
          ),

        dailyFatGrams:
          parseNullableNumber(
            fat,
          ),

        effectiveFrom:
          selectedDate,
      })

      setOpen(false)
    } catch (error) {
      console.error(error)

      setError(
        'Could not save your target.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={
        handleOpenChange
      }
    >
      <Dialog.Trigger
        asChild
      >
        <button
          type="button"
          className="
            inline-flex
            items-center
            gap-2

            rounded-xl

            border
            border-slate-800

            bg-slate-900

            px-3
            py-2.5

            text-sm
            font-medium
            text-slate-300

            transition

            hover:border-slate-700
            hover:bg-slate-800
          "
        >
          <Pencil
            size={15}
          />

          {target
            ? 'Edit targets'
            : 'Set targets'}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed
            inset-0
            z-50

            bg-slate-950/70
            backdrop-blur-sm
          "
        />

        <Dialog.Content
          className="
            fixed
            bottom-0
            left-0
            right-0
            z-50

            rounded-t-3xl

            border
            border-slate-800

            bg-slate-950

            p-5

            outline-none

            md:bottom-auto
            md:left-1/2
            md:right-auto
            md:top-1/2

            md:w-[480px]

            md:-translate-x-1/2
            md:-translate-y-1/2

            md:rounded-3xl
            md:p-6
          "
        >
          <div
            className="
              mb-5
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <Dialog.Title
                className="
                  text-xl
                  font-semibold
                  text-slate-100
                "
              >
                Nutrition targets
              </Dialog.Title>

              <Dialog.Description
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Calories are
                required. Macro
                targets are optional.
              </Dialog.Description>
            </div>

            <Dialog.Close
              asChild
            >
              <button
                type="button"
                aria-label="Close"
                className="
                  flex size-9
                  items-center
                  justify-center

                  rounded-full

                  text-slate-500

                  hover:bg-slate-800
                  hover:text-slate-200
                "
              >
                <X
                  size={17}
                />
              </button>
            </Dialog.Close>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >
            <TargetInput
              label="Daily calories"
              unit="kcal"
              value={calories}
              onChange={
                setCalories
              }
              required
            />

            <div
              className="
                grid
                grid-cols-3
                gap-3
              "
            >
              <TargetInput
                label="Protein"
                unit="g"
                value={protein}
                onChange={
                  setProtein
                }
              />

              <TargetInput
                label="Carbs"
                unit="g"
                value={carbs}
                onChange={
                  setCarbs
                }
              />

              <TargetInput
                label="Fat"
                unit="g"
                value={fat}
                onChange={
                  setFat
                }
              />
            </div>

            <div
              className="
                rounded-xl

                bg-slate-900

                px-3
                py-2.5

                text-xs
                text-slate-500
              "
            >
              New targets take
              effect from{' '}
              <span
                className="
                  font-medium
                  text-slate-300
                "
              >
                {selectedDate}
              </span>
              .
            </div>

            {error && (
              <p
                className="
                  text-sm
                  text-red-300
                "
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={
                isSaving
              }
              className="
                w-full

                rounded-xl

                bg-sky-400

                px-4
                py-3

                text-sm
                font-semibold
                text-slate-950

                transition

                hover:bg-sky-300

                disabled:opacity-50
              "
            >
              {isSaving
                ? 'Saving...'
                : 'Save targets'}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function TargetInput({
  label,
  unit,
  value,
  onChange,
  required = false,
}: {
  label: string
  unit: string
  value: string

  onChange: (
    value: string,
  ) => void

  required?: boolean
}) {
  return (
    <label>
      <span
        className="
          mb-1.5
          block

          text-xs
          font-medium
          text-slate-500
        "
      >
        {label}

        {!required && (
          <span className="text-slate-700">
            {' '}
            · optional
          </span>
        )}
      </span>

      <div className="relative">
        <input
          type="number"
          min="0"
          step="0.1"
          required={required}
          value={value}
          onChange={(
            event,
          ) =>
            onChange(
              event
                .currentTarget
                .value,
            )
          }
          className={`
            ${inputClassName}
            pr-12
          `}
        />

        <span
          className="
            pointer-events-none

            absolute
            right-3
            top-1/2

            -translate-y-1/2

            text-xs
            text-slate-600
          "
        >
          {unit}
        </span>
      </div>
    </label>
  )
}

/* ======================================================
   SKELETON
====================================================== */

function NutritionSkeleton() {
  return (
    <div className="space-y-4">
      <div
        className="
          h-52
          animate-pulse
          rounded-3xl
          bg-slate-900
        "
      />

      <div
        className="
          h-64
          animate-pulse
          rounded-3xl
          bg-slate-900
        "
      />
    </div>
  )
}

/* ======================================================
   HELPERS
====================================================== */

const inputClassName = `
  w-full
  min-w-0

  rounded-xl

  border
  border-slate-800

  bg-slate-950

  px-3
  py-2.5

  text-base
  text-slate-200

  outline-none

  placeholder:text-slate-700

  transition

  focus:border-sky-500
  focus:ring-2
  focus:ring-sky-500/20

  sm:text-sm
`

function formatNumber(
  value: number,
) {
  return new Intl.NumberFormat(
    'en-IE',
    {
      maximumFractionDigits: 1,
    },
  ).format(value)
}

function formatSelectedDate(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    'en-IE',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    },
  ).format(date)
}

function formatWeekday(
  value: string,
) {
  const date =
    parseDateValue(
      value,
    )

  if (!date) {
    return ''
  }

  return new Intl.DateTimeFormat(
    'en-IE',
    {
      weekday: 'short',
    },
  ).format(date)
}

function formatDayNumber(
  value: string,
) {
  const date =
    parseDateValue(
      value,
    )

  return date
    ? String(
        date.getDate(),
      )
    : ''
}

function formatTime(
  value: string,
) {
  const date =
    new Date(value)

  return new Intl.DateTimeFormat(
    'en-IE',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date)
}

function currentLocalTime() {
  const now =
    new Date()

  const hours =
    String(
      now.getHours(),
    ).padStart(
      2,
      '0',
    )

  const minutes =
    String(
      now.getMinutes(),
    ).padStart(
      2,
      '0',
    )

  return `${hours}:${minutes}`
}

function createLocalOffsetIso(
  dateValue: string,
  timeValue: string,
) {
  const [
    year,
    month,
    day,
  ] =
    dateValue
      .split('-')
      .map(Number)

  const [
    hour,
    minute,
  ] =
    timeValue
      .split(':')
      .map(Number)

  const localDate =
    new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      0,
    )

  const offsetMinutes =
    -localDate
      .getTimezoneOffset()

  const sign =
    offsetMinutes >= 0
      ? '+'
      : '-'

  const absoluteOffset =
    Math.abs(
      offsetMinutes,
    )

  const offsetHours =
    String(
      Math.floor(
        absoluteOffset /
          60,
      ),
    ).padStart(
      2,
      '0',
    )

  const offsetMins =
    String(
      absoluteOffset %
        60,
    ).padStart(
      2,
      '0',
    )

  return (
    `${dateValue}` +
    `T${timeValue}:00` +
    `${sign}` +
    `${offsetHours}:` +
    `${offsetMins}`
  )
}

function parseOptionalNumber(
  value: string,
) {
  if (
    value.trim() === ''
  ) {
    return 0
  }

  const parsed =
    Number(value)

  return Number.isFinite(
    parsed,
  ) &&
    parsed >= 0
    ? parsed
    : 0
}

function timeValueFromIso(
  value: string,
) {
  const date =
    new Date(value)

  const hours =
    String(
      date.getHours(),
    ).padStart(
      2,
      '0',
    )

  const minutes =
    String(
      date.getMinutes(),
    ).padStart(
      2,
      '0',
    )

  return `${hours}:${minutes}`
}

function formatLogDate(
  value: string,
) {
  const date =
    parseDateValue(
      value,
    )

  if (!date) {
    return value
  }

  return new Intl.DateTimeFormat(
    'en-IE',
    {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    },
  ).format(date)
}

function parseNullableNumber(
  value: string,
) {
  if (
    value.trim() === ''
  ) {
    return null
  }

  const parsed =
    Number(value)

  return Number.isFinite(
    parsed,
  ) &&
    parsed >= 0
    ? parsed
    : null
}

function getFoodInitials(
  value: string,
) {
  const parts =
    value
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  if (
    parts.length === 0
  ) {
    return '?'
  }

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    parts[0][0] +
    parts[1][0]
  ).toUpperCase()
}

export default NutritionPage