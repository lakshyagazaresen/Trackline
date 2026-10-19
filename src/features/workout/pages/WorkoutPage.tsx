import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Link, useSearchParams } from 'react-router'
import * as Select from '@radix-ui/react-select'
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  BarChart3,
  Copy,
  Flag,
  Pencil,
  RotateCcw,
  ChevronDown,
  Dumbbell,
  Library,
  Plus,
} from 'lucide-react'

import { useWorkoutApi } from '../services/workoutApi'
import RestTimer from '../components/RestTimer'
import { findLastLoggedSet, useWorkoutHistory } from '../hooks/useWorkoutHistory'
import type {
  WorkoutCategory,
  WorkoutSession,
  WorkoutSessionDetail,
  WorkoutSet,
  WorkoutSetType,
  UpdateWorkoutSetRequest,
} from '../types/workout'

const inputClass =
  'w-full min-w-0 rounded-xl border border-slate-800 bg-slate-950 ' +
  'px-3 py-2.5 text-base text-slate-100 outline-none transition ' +
  'placeholder:text-slate-600 focus:border-violet-500 ' +
  'focus:ring-2 focus:ring-violet-500/20 sm:text-sm'

const primaryButton =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl ' +
  'bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white ' +
  'transition hover:bg-violet-400 active:scale-[0.98] ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const secondaryButton =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl ' +
  'border border-slate-700 bg-slate-900 px-3 py-2.5 ' +
  'text-sm font-medium text-slate-200 transition ' +
  'hover:border-slate-600 hover:bg-slate-800 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const panelClass = 'rounded-3xl border border-slate-800 bg-slate-900/65 p-5 sm:p-6'

const overlayClass =
  'fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm ' +
  'data-[state=open]:animate-in data-[state=closed]:animate-out'

const modalClass =
  'fixed bottom-0 left-0 right-0 z-50 max-h-[90dvh] overflow-y-auto ' +
  'rounded-t-3xl border border-slate-800 bg-slate-950 p-5 shadow-2xl ' +
  'outline-none sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 ' +
  'sm:w-[min(560px,calc(100vw-32px))] sm:-translate-x-1/2 ' +
  'sm:-translate-y-1/2 sm:rounded-3xl sm:p-6'

function localToday(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(value: string): string {
  const date = new Date(`${value}T12:00:00`)
  return new Intl.DateTimeFormat('en-IE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function errorMessage(value: unknown): string {
  return value instanceof Error ? value.message : 'Something went wrong.'
}

type ConfirmActionProps = {
  title: string
  description: string
  confirmLabel: string
  triggerLabel: string
  triggerClassName?: string
  disabled?: boolean
  onConfirm: () => Promise<void> | void
  tone?: 'danger' | 'primary'
}

function ConfirmAction({
  title,
  description,
  confirmLabel,
  triggerLabel,
  triggerClassName,
  disabled,
  onConfirm,
  tone = 'danger',
}: ConfirmActionProps) {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={triggerClassName ?? 'text-xs font-medium text-rose-400 hover:text-rose-300 disabled:opacity-40'}
        >
          {triggerLabel}
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={overlayClass} />
        <AlertDialog.Content className={modalClass}>
          <AlertDialog.Title className="text-xl font-semibold text-white">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-6 text-slate-400">
            {description}
          </AlertDialog.Description>
          <div className="mt-7 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button type="button" className={secondaryButton}>
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                disabled={disabled}
                className={`min-h-10 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-40 ${
                  tone === 'primary' ? 'bg-violet-500 hover:bg-violet-400' : 'bg-rose-500 hover:bg-rose-400'
                }`}
                onClick={() => void onConfirm()}
              >
                {confirmLabel}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

type RadixSelectProps = {
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string; color?: string | null }[]
  placeholder: string
  disabled?: boolean
  ariaLabel: string
}

function RadixSelect({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  ariaLabel,
}: RadixSelectProps) {
  return (
    <Select.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Select.Trigger
        aria-label={ariaLabel}
        className="flex min-h-11 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-left text-sm text-slate-200 outline-none transition hover:border-slate-600 focus:ring-2 focus:ring-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown size={16} className="text-slate-400" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-[70] max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-1 shadow-2xl"
        >
          <Select.Viewport>
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center gap-2 rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-200 outline-none data-[highlighted]:bg-violet-500/20 data-[highlighted]:text-white"
              >
                <Select.ItemIndicator className="absolute left-3 text-violet-300">
                  <Check size={15} />
                </Select.ItemIndicator>
                {option.color && (
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: option.color }} />
                )}
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

type SetEditorProps = {
  set: WorkoutSet
  busy: boolean
  readOnly: boolean
  onSave: (setId: string, data: UpdateWorkoutSetRequest) => Promise<boolean>
  onDelete: (setId: string) => Promise<void>
  onLogged: () => void
}

function SetEditor({ set, busy, readOnly, onSave, onDelete, onLogged }: SetEditorProps) {
  const [reps, setReps] = useState(set.reps?.toString() ?? '')
  const [weight, setWeight] = useState(set.weightKg?.toString() ?? '')
  const [setType, setSetType] = useState<WorkoutSetType>(set.setType)
  const [editingCompleted, setEditingCompleted] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    setReps(set.reps?.toString() ?? '')
    setWeight(set.weightKg?.toString() ?? '')
    setSetType(set.setType)
  }, [set.reps, set.weightKg, set.setType])

  async function save(isCompleted: boolean) {
    const parsedReps = reps.trim() === '' ? null : Number(reps)
    const parsedWeight = weight.trim() === '' ? null : Number(weight)

    if (
      (parsedReps !== null && (!Number.isInteger(parsedReps) || parsedReps < 0)) ||
      (parsedWeight !== null &&
        (!Number.isFinite(parsedWeight) || parsedWeight < 0 || parsedWeight > 999999.99 ||
          Number(parsedWeight.toFixed(2)) !== parsedWeight))
    ) {
      setValidationError('Enter valid reps and a weight with up to 2 decimal places.')
      return
    }

    if (isCompleted && (parsedReps === null || parsedReps <= 0)) {
      setValidationError('Enter your repetitions before logging this set.')
      return
    }

    setValidationError(null)
    const saved = await onSave(set.id, {
      reps: parsedReps,
      weightKg: parsedWeight,
      setType,
      isCompleted,
      notes: set.notes,
    })
    if (saved) {
      setEditingCompleted(false)
      if (isCompleted && !set.isCompleted) onLogged()
    }
  }

  // Completed sets are compact, read-only by default.
  if ((set.isCompleted && !editingCompleted) || readOnly) {
    return (
      <div className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
        set.isCompleted
          ? 'border-emerald-500/25 bg-emerald-500/[0.07]'
          : 'border-slate-800 bg-slate-950/60'
      }`}>
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
            set.isCompleted ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-500'
          }`}>
            {set.isCompleted ? <CheckCircle2 size={20} /> : <span className="text-xs font-bold">{set.setNumber}</span>}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-100">
              Set {set.setNumber} · {set.weightKg === null ? 'Bodyweight / no weight' : `${set.weightKg} kg`} × {set.reps ?? '—'} reps
            </p>
            <p className={`mt-0.5 text-xs ${set.isCompleted ? 'text-emerald-300/85' : 'text-slate-500'}`}>
              {set.isCompleted ? 'Logged' : 'Not logged'}{set.setType !== 'Normal' ? ` · ${set.setType}` : ''}
            </p>
          </div>
        </div>
        {!readOnly && (
          <button
            type="button"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            disabled={busy}
            onClick={() => setEditingCompleted(true)}
          >
            <Pencil size={14} /> Edit
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/65 p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Set {set.setNumber}</span>
        {set.isCompleted && <span className="text-xs font-medium text-emerald-300">Editing logged set</span>}
      </div>
      <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_130px]">
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-slate-400">Reps</span>
          <input
            type="number" min="0" step="1" inputMode="numeric"
            aria-label={`Set ${set.setNumber} reps`} className={inputClass}
            value={reps} disabled={busy} onChange={(event) => setReps(event.target.value)}
          />
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-slate-400">Weight (kg)</span>
          <input
            type="number" min="0" step="0.01" inputMode="decimal"
            aria-label={`Set ${set.setNumber} weight`} className={inputClass}
            placeholder="Optional" value={weight} disabled={busy}
            onChange={(event) => setWeight(event.target.value)}
          />
        </label>
        <div className="col-span-2 sm:col-span-1">
          <span className="mb-1.5 block text-xs font-medium text-slate-400">Type</span>
          <RadixSelect
            ariaLabel={`Set ${set.setNumber} type`} value={setType}
            onValueChange={(value) => setSetType(value as WorkoutSetType)}
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'Warmup', label: 'Warmup' },
              { value: 'Dropset', label: 'Dropset' },
            ]}
            placeholder="Select type" disabled={busy}
          />
        </div>
      </div>

      {validationError && <p role="alert" className="mt-2 text-xs text-rose-300">{validationError}</p>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3">
        <div className="flex items-center gap-3">
          <ConfirmAction
            title={`Delete set ${set.setNumber}?`}
            description="This set will be permanently removed from the workout."
            confirmLabel="Delete set" triggerLabel="Delete"
            disabled={busy} onConfirm={() => onDelete(set.id)}
          />
          {set.isCompleted && (
            <button type="button" disabled={busy} className="text-xs font-medium text-slate-400 hover:text-slate-200"
              onClick={() => { setEditingCompleted(false); setValidationError(null) }}>
              Cancel
            </button>
          )}
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <button type="button" className={secondaryButton} disabled={busy} onClick={() => void save(false)}>
            Save draft
          </button>
          <button type="button" className={primaryButton} disabled={busy} onClick={() => void save(true)}>
            <Check size={17} /> {set.isCompleted ? 'Save & log' : 'Log set'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WorkoutPage() {
  const api = useWorkoutApi()
  const history = useWorkoutHistory(15)
  const [searchParams] = useSearchParams()

  const [categories, setCategories] = useState<WorkoutCategory[]>([])
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get('sessionId'),
  )
  const [detail, setDetail] = useState<WorkoutSessionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [sessionName, setSessionName] = useState('')
  const [sessionDate, setSessionDate] = useState(localToday())
  const [sessionNotes, setSessionNotes] = useState('')

  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [restPreset, setRestPreset] = useState(90)
  const [restDeadline, setRestDeadline] = useState<number | null>(null)

  const loadOverview = useCallback(async () => {
    try {
      const [loadedCategories, loadedSessions] = await Promise.all([
        api.categories.list(),
        api.sessions.list(),
      ])
      setCategories(loadedCategories)
      setSessions(loadedSessions)
      setSelectedId((previous) => {
        if (previous && loadedSessions.some((session) => session.id === previous)) {
          return previous
        }
        return loadedSessions[0]?.id ?? null
      })
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    void loadOverview()
  }, [loadOverview])

  const refreshDetail = useCallback(async () => {
    if (!selectedId) {
      setDetail(null)
      setDetailError(null)
      return
    }

    setDetailLoading(true)
    setDetailError(null)
    try {
      const result = await api.getSessionDetail(selectedId)
      setDetail(result)
      setSessions((current) => current.map((session) =>
        session.id === result.id ? {
          ...session,
          status: result.status,
          startedAt: result.startedAt,
          completedAt: result.completedAt,
          updatedAt: result.updatedAt,
        } : session,
      ))
    } catch (cause) {
      setDetail(null)
      setDetailError(errorMessage(cause))
    } finally {
      setDetailLoading(false)
    }
  }, [api, selectedId])

  useEffect(() => {
    setDetail(null)
    setRestDeadline(null)
    void refreshDetail()
  }, [refreshDetail])

  async function runMutation(
    operation: () => Promise<void>,
    refresh: 'detail' | 'none' = 'detail',
  ): Promise<boolean> {
    setBusy(true)
    setError(null)
    try {
      await operation()
      if (refresh === 'detail') await refreshDetail()
      return true
    } catch (cause) {
      setError(errorMessage(cause))
      return false
    } finally {
      setBusy(false)
    }
  }

  async function createSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!sessionName.trim() || !sessionDate) return

    await runMutation(async () => {
      const created = await api.sessions.create({
        name: sessionName.trim(),
        workoutDate: sessionDate,
        notes: sessionNotes.trim() || null,
      })
      setSessions(await api.sessions.list())
      setSelectedId(created.id)
      setSessionName('')
      setSessionNotes('')
    }, 'none')
  }

  async function addExercise(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedId || !selectedCategoryId) return

    await runMutation(async () => {
      await api.sessionExercises.add(selectedId, {
        workoutCategoryId: selectedCategoryId,
      })
      setSelectedCategoryId('')
    })
  }

  async function addSet(entryId: string, previous?: WorkoutSet, categoryId?: string) {
    if (!selectedId) return
    const suggested = previous ?? (categoryId ? findLastLoggedSet(history.completed, categoryId) : undefined)
    await runMutation(async () => {
      await api.sets.create(selectedId, entryId, {
        reps: suggested?.reps ?? null,
        weightKg: suggested?.weightKg ?? null,
        setType: suggested?.setType ?? 'Normal',
        isCompleted: false,
      })
    })
  }

  // One tap: log the most recently completed set for this exercise.
  async function quickLogLastTime(entryId: string, categoryId: string) {
    if (!selectedId) return
    const last = findLastLoggedSet(history.completed, categoryId)
    if (!last || !last.reps || last.reps <= 0) return
    const saved = await runMutation(async () => {
      await api.sets.create(selectedId, entryId, {
        reps: last.reps,
        weightKg: last.weightKg,
        setType: last.setType,
        isCompleted: true,
      })
    })
    if (saved) onSetLogged()
  }

  async function saveSet(
    entryId: string,
    setId: string,
    data: UpdateWorkoutSetRequest,
  ): Promise<boolean> {
    if (!selectedId) return false
    return runMutation(async () => {
      await api.sets.update(selectedId, entryId, setId, data)
    })
  }

  async function deleteSet(entryId: string, setId: string) {
    if (!selectedId) return
    await runMutation(async () => {
      await api.sets.remove(selectedId, entryId, setId)
    })
  }

  async function removeExercise(entryId: string) {
    if (!selectedId) return
    await runMutation(async () => {
      await api.sessionExercises.remove(selectedId, entryId)
    })
  }

  async function finishSession() {
    if (!selectedId) return
    await runMutation(async () => {
      await api.sessions.finish(selectedId)
    })
  }

  async function reopenSession() {
    if (!selectedId) return
    await runMutation(async () => {
      await api.sessions.reopen(selectedId)
    })
  }

  async function repeatSession() {
    if (!detail || busy) return
    const source = detail
    await runMutation(async () => {
      const repeated = await api.sessions.repeat(source.id, {
        name: source.name, workoutDate: localToday(), notes: source.notes,
      })
      setSessions(await api.sessions.list())
      setSelectedId(repeated.id)
    }, 'none')
  }

  function onSetLogged() {
    setRestDeadline(Date.now() + restPreset * 1000)
  }

  async function deleteSession() {
    if (!selectedId) return
    await runMutation(async () => {
      await api.sessions.remove(selectedId)
      setDetail(null)
      setSelectedId(null)
      setSessions(await api.sessions.list())
      // loadOverview will pick the next available session.
      await loadOverview()
    }, 'none')
  }

  const totalSetCount = detail?.exercises.reduce((sum, entry) => sum + entry.sets.length, 0) ?? 0
  const completedSetCount = detail?.exercises.reduce(
    (sum, entry) => sum + entry.sets.filter((set) => set.isCompleted).length,
    0,
  ) ?? 0

  const isCompleted = detail?.status === 'Completed'
  const remainingSetCount = totalSetCount - completedSetCount
  const totalVolume = detail?.exercises.reduce(
    (sum, entry) => sum + entry.sets.reduce(
      (exerciseSum, set) => exerciseSum + (
        set.isCompleted ? (set.reps ?? 0) * (set.weightKg ?? 0) : 0
      ),
      0,
    ),
    0,
  ) ?? 0

  const workoutDuration = detail?.startedAt && detail.completedAt
    ? Math.max(0, Math.round((
        new Date(detail.completedAt).getTime() - new Date(detail.startedAt).getTime()
      ) / 60000))
    : null

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-24 text-slate-100">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-violet-300">Move, lift, repeat</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Workout</h1>
          <p className="mt-2 text-sm text-slate-400">Plan your sessions and log each set, your way.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/workout/exercises" className={primaryButton}>
            <Plus size={17} /> Create exercise
          </Link>
          <Link to="/workout/exercises" className={secondaryButton}>
            <Library size={17} /> Exercise library
          </Link>
          <Link to="/workout/insights" className={secondaryButton}>
            <BarChart3 size={17} /> Progress insights
          </Link>
        </div>
      </header>

      {error && (
        <div role="alert" className="rounded-2xl border border-rose-900/50 bg-rose-950/25 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: 'Workouts', value: sessions.length, icon: CalendarDays },
          { label: 'My exercises', value: categories.length, icon: Dumbbell },
          { label: 'Completed workouts', value: sessions.filter((session) => session.status === 'Completed').length, icon: CheckCircle2 },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400">{stat.label}</span>
                <Icon size={17} className="text-violet-400" />
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className={panelClass}>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/15 p-2.5 text-violet-300"><Plus size={19} /></div>
              <div>
                <h2 className="font-semibold text-white">New workout</h2>
                <p className="text-xs text-slate-500">Make a plan for any day.</p>
              </div>
            </div>
            <form onSubmit={(event) => void createSession(event)} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-400">Workout name</span>
                <input className={inputClass} value={sessionName} maxLength={150} required placeholder="e.g. Push Day" onChange={(event) => setSessionName(event.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-400">Date</span>
                <input className={inputClass} type="date" value={sessionDate} required onChange={(event) => setSessionDate(event.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-400">Notes (optional)</span>
                <textarea className={inputClass} rows={2} placeholder="Session notes..." value={sessionNotes} onChange={(event) => setSessionNotes(event.target.value)} />
              </label>
              <button type="submit" className={`${primaryButton} w-full`} disabled={busy}>
                <Plus size={16} /> Create workout
              </button>
            </form>
          </section>

          <section className={panelClass}>
            <h2 className="text-base font-semibold text-white">Your sessions</h2>
            {loading ? (
              <p className="mt-4 text-sm text-slate-500">Loading sessions...</p>
            ) : sessions.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No workouts yet. Create your first one above.</p>
            ) : (
              <div className="mt-4 max-h-[460px] space-y-2 overflow-y-auto">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => setSelectedId(session.id)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                      selectedId === session.id
                        ? 'border-violet-500/60 bg-violet-500/10'
                        : 'border-slate-800 bg-slate-950/45 hover:border-slate-700 hover:bg-slate-800/70'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate text-sm font-semibold text-slate-100">{session.name}</span>
                      <ArrowRight size={15} className="shrink-0 text-slate-500" />
                    </span>
                    <span className="mt-1 flex items-center justify-between text-xs text-slate-500">
                      <span>{formatDate(session.workoutDate)}</span>
                      <span className={session.status === 'Completed' ? 'text-emerald-300' : session.status === 'InProgress' ? 'text-violet-300' : ''}>
                        {session.status === 'InProgress' ? 'In progress' : session.status}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </aside>

        <section className={panelClass}>
          {!selectedId ? (
            <div className="py-16 text-center">
              <Dumbbell size={30} className="mx-auto text-slate-600" />
              <h2 className="mt-3 font-semibold text-slate-200">Your next session starts here</h2>
              <p className="mt-1 text-sm text-slate-500">Create or choose a workout to get started.</p>
            </div>
          ) : detailLoading && !detail ? (
            <p className="py-20 text-center text-sm text-slate-400">Loading workout...</p>
          ) : detailError ? (
            <div className="py-14 text-center">
              <p className="text-sm text-rose-300">Could not load this workout: {detailError}</p>
              <button type="button" className={`${secondaryButton} mt-4`} onClick={() => void refreshDetail()}>
                Retry
              </button>
            </div>
          ) : !detail || detail.id !== selectedId ? (
            <p className="py-20 text-center text-sm text-slate-500">Loading selected session...</p>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Selected session</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">{detail.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">{formatDate(detail.workoutDate)} · {detail.status}</p>
                  {detail.notes && <p className="mt-2 text-sm text-slate-500">{detail.notes}</p>}
                </div>
                {!isCompleted && <div className="flex flex-wrap items-center gap-3">
                  {detail.exercises.length > 0 && (
                    <button type="button" className={secondaryButton} disabled={busy} onClick={() => void repeatSession()}>
                      <Copy size={16} /> Repeat workout
                    </button>
                  )}
                  <ConfirmAction
                    title="Delete this workout?"
                    description="The workout, its exercises and all its sets will be permanently deleted."
                    confirmLabel="Delete workout" triggerLabel="Delete workout"
                    disabled={busy} onConfirm={deleteSession}
                  />
                </div>}
              </div>

              <div className="flex flex-wrap gap-5 rounded-2xl border border-violet-500/15 bg-violet-500/10 px-4 py-3">
                <div><strong className="text-lg text-white">{detail.exercises.length}</strong><span className="ml-2 text-xs text-slate-400">Exercises</span></div>
                <div><strong className="text-lg text-white">{totalSetCount}</strong><span className="ml-2 text-xs text-slate-400">Sets</span></div>
                <div><strong className="text-lg text-white">{completedSetCount}</strong><span className="ml-2 text-xs text-slate-400">Completed</span></div>
              </div>

              {isCompleted ? (
                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="rounded-xl bg-emerald-500/15 p-2.5 text-emerald-300"><CheckCircle2 size={23} /></span>
                      <div>
                        <h3 className="font-semibold text-white">Workout finished</h3>
                        <p className="mt-0.5 text-xs text-emerald-200/70">Great work. Your session is read-only.</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className={primaryButton} disabled={busy} onClick={() => void repeatSession()}>
                        <Copy size={16} /> Repeat workout
                      </button>
                      <button type="button" className={secondaryButton} disabled={busy} onClick={() => void reopenSession()}>
                        <RotateCcw size={16} /> Reopen workout
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-950/50 p-3">
                      <p className="text-xs text-slate-400">Sets logged</p>
                      <p className="mt-1 text-xl font-bold text-white">{completedSetCount}/{totalSetCount}</p>
                    </div>
                    <div className="rounded-xl bg-slate-950/50 p-3">
                      <p className="text-xs text-slate-400">Training volume</p>
                      <p className="mt-1 text-xl font-bold text-white">{new Intl.NumberFormat('en-IE', { maximumFractionDigits: 1 }).format(totalVolume)} <span className="text-xs font-normal text-slate-400">kg</span></p>
                    </div>
                    <div className="col-span-2 rounded-xl bg-slate-950/50 p-3 sm:col-span-1">
                      <p className="flex items-center gap-1 text-xs text-slate-400"><Clock3 size={13} /> Duration</p>
                      <p className="mt-1 text-xl font-bold text-white">{workoutDuration === null ? '—' : `${Math.floor(workoutDuration / 60)}h ${workoutDuration % 60}m`}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-violet-500/25 bg-violet-500/[0.07] p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                        {detail.status === 'Planned' ? 'Ready when you are' : 'Workout in progress'}
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        {detail.status === 'Planned'
                          ? 'Add your first set to start automatically.'
                          : `${completedSetCount} of ${totalSetCount} sets logged`}
                      </p>
                    </div>
                    {detail.status === 'InProgress' && completedSetCount > 0 && (
                      remainingSetCount > 0 ? (
                        <ConfirmAction
                          title="Finish this workout?"
                          description={`${remainingSetCount} ${remainingSetCount === 1 ? 'set is' : 'sets are'} still not logged. You can finish anyway and reopen later to make changes.`}
                          confirmLabel="Finish anyway" triggerLabel="Finish workout"
                          triggerClassName={primaryButton} tone="primary"
                          disabled={busy} onConfirm={finishSession}
                        />
                      ) : (
                        <button type="button" className={primaryButton} disabled={busy} onClick={() => void finishSession()}>
                          <Flag size={16} /> Finish workout
                        </button>
                      )
                    )}
                  </div>
                  {detail.status === 'InProgress' && (
                    <>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-violet-400 transition-all duration-300" style={{ width: `${totalSetCount ? completedSetCount / totalSetCount * 100 : 0}%` }} />
                      </div>
                      {completedSetCount === 0 && (
                        <p className="mt-2 text-xs text-slate-400">Log at least one set to unlock Finish workout.</p>
                      )}
                    </>
                  )}
                </div>
              )}

              {detail.status === 'InProgress' && (
                <RestTimer deadline={restDeadline} onDeadlineChange={setRestDeadline} preset={restPreset} onPresetChange={setRestPreset} />
              )}

              {!isCompleted && <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-white">Exercises in this workout</h3>
                  <Link
                    to={`/workout/exercises?sessionId=${encodeURIComponent(selectedId ?? '')}`}
                    className={secondaryButton}
                  >
                    <Plus size={16} /> Create or browse exercises
                  </Link>
                </div>
                {categories.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/35 px-5 py-7 text-center">
                    <Dumbbell size={25} className="mx-auto text-slate-500" />
                    <p className="mt-3 font-medium text-slate-200">Your exercise library is empty</p>
                    <p className="mt-1 text-sm text-slate-500">Create an exercise like Bench Press or Squats, then add sets.</p>
                    <Link
                      to={`/workout/exercises?sessionId=${encodeURIComponent(selectedId ?? '')}`}
                      className={`${primaryButton} mt-4`}
                    >
                      <Plus size={16} /> Create your first exercise
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={(event) => void addExercise(event)} className="flex flex-col gap-2 sm:flex-row">
                    <div className="min-w-0 flex-1">
                      <RadixSelect
                        ariaLabel="Choose an exercise"
                        value={selectedCategoryId}
                        onValueChange={setSelectedCategoryId}
                        placeholder="Select an exercise..."
                        options={categories.map((category) => ({
                          value: category.id,
                          label: category.name,
                          color: category.color,
                        }))}
                        disabled={busy}
                      />
                    </div>
                    <button type="submit" className={`${primaryButton} shrink-0`} disabled={busy || !selectedCategoryId}>
                      <Plus size={16} /> Add exercise
                    </button>
                  </form>
                )}
              </div>}

              {detail.exercises.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 px-5 py-9 text-center text-sm text-slate-500">
                  No exercises in this workout yet.
                </div>
              ) : (
                <div className="space-y-5">
                  {detail.exercises.map((exercise) => (
                    <article key={exercise.id} className="rounded-2xl border border-slate-800 bg-slate-950/35 p-4 sm:p-5">
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="size-3.5 shrink-0 rounded-full" style={{ backgroundColor: exercise.exerciseColor ?? '#8b5cf6' }} />
                          <div>
                            <h4 className="font-semibold text-white">{exercise.exerciseName}</h4>
                            <p className="mt-0.5 text-xs text-slate-500">{exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}</p>
                            {!isCompleted && (() => {
                              const last = findLastLoggedSet(history.completed, exercise.workoutCategoryId)
                              return last ? (
                                <p className="mt-1 text-xs font-medium text-cyan-300">
                                  Last time: {last.weightKg === null ? 'bodyweight' : `${last.weightKg} kg`} × {last.reps ?? '—'} reps
                                </p>
                              ) : history.isLoading ? <p className="mt-1 text-xs text-slate-500">Checking past sets...</p> : null
                            })()}
                          </div>
                        </div>
                        {!isCompleted && (
                          <ConfirmAction
                            title={`Remove ${exercise.exerciseName}?`}
                            description="This exercise will be removed from the session along with all its logged sets. It will stay in your exercise library."
                            confirmLabel="Remove exercise" triggerLabel="Remove"
                            disabled={busy} onConfirm={() => removeExercise(exercise.id)}
                          />
                        )}
                      </div>
                      <div className="space-y-3">
                        {exercise.sets.map((set) => (
                          <SetEditor
                            key={set.id}
                            set={set}
                            busy={busy}
                            readOnly={isCompleted}
                            onSave={(setId, data) => saveSet(exercise.id, setId, data)}
                            onDelete={(setId) => deleteSet(exercise.id, setId)}
                            onLogged={onSetLogged}
                          />
                        ))}
                      </div>
                      {!isCompleted && (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <button type="button" className={`${secondaryButton} w-full`} disabled={busy}
                            onClick={() => void addSet(exercise.id, exercise.sets[exercise.sets.length - 1], exercise.workoutCategoryId)}>
                            <Plus size={15} /> {exercise.sets.length ? 'Add next set' : 'Add first set'}
                          </button>
                          {(() => {
                            const last = findLastLoggedSet(history.completed, exercise.workoutCategoryId)
                            return last?.reps && last.reps > 0 ? (
                              <button type="button" className={`${primaryButton} w-full`} disabled={busy}
                                title="Records your previous weight and reps as a completed new set"
                                onClick={() => void quickLogLastTime(exercise.id, exercise.workoutCategoryId)}>
                                <Check size={16} /> Quick log {last.weightKg === null ? 'bodyweight' : `${last.weightKg} kg`} × {last.reps}
                              </button>
                            ) : <span className="hidden sm:block text-center text-xs text-slate-500 self-center">New set copies your last entry</span>
                          })()}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

    </div>
  )
}
