import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import * as Dialog from '@radix-ui/react-dialog'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as Select from '@radix-ui/react-select'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Dumbbell,
  LibraryBig,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'

import { useWorkoutApi } from '../services/workoutApi'
import type { WorkoutCategory } from '../types/workout'

const COLOURS = [
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#f97316',
  '#ec4899',
  '#3b82f6',
  '#ef4444',
]

const inputClass =
  'w-full min-w-0 rounded-xl border border-slate-700 bg-slate-950 ' +
  'px-4 py-3 text-base text-slate-100 outline-none transition ' +
  'placeholder:text-slate-600 focus:border-violet-400 ' +
  'focus:ring-2 focus:ring-violet-500/20 sm:text-sm'

const primaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl ' +
  'bg-violet-500 px-5 py-3 text-sm font-semibold text-white ' +
  'transition hover:bg-violet-400 active:scale-[0.98] ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const subtleButton =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl ' +
  'border border-slate-700 bg-slate-900 px-3 py-2 ' +
  'text-sm font-medium text-slate-300 transition ' +
  'hover:border-slate-600 hover:bg-slate-800 hover:text-white ' +
  'disabled:opacity-50'

const overlayClass = 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm'
const dialogClass =
  'fixed bottom-0 left-0 right-0 z-50 max-h-[90dvh] overflow-y-auto ' +
  'rounded-t-3xl border border-slate-800 bg-slate-950 p-5 shadow-2xl ' +
  'outline-none sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 ' +
  'sm:w-[min(480px,calc(100vw-32px))] sm:-translate-x-1/2 ' +
  'sm:-translate-y-1/2 sm:rounded-3xl sm:p-6'

function getError(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.'
}

type ColourPickerProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function ColourPicker({ value, onChange, disabled }: ColourPickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {COLOURS.map((colour) => (
        <button
          key={colour}
          type="button"
          aria-label={`Choose colour ${colour}`}
          aria-pressed={value.toLowerCase() === colour}
          disabled={disabled}
          onClick={() => onChange(colour)}
          className={`flex size-9 items-center justify-center rounded-xl transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:opacity-50 ${
            value.toLowerCase() === colour ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : ''
          }`}
          style={{ backgroundColor: colour }}
        >
          {value.toLowerCase() === colour && <Check size={17} className="text-white drop-shadow" />}
        </button>
      ))}
      <label
        className="relative flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-slate-600 bg-slate-800"
        title="Custom colour"
      >
        <span className="sr-only">Custom colour</span>
        <input
          type="color"
          aria-label="Custom exercise colour"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
        <Plus size={17} className="pointer-events-none text-slate-200" />
      </label>
    </div>
  )
}

type SortOrder = 'az' | 'za'

export default function ExerciseLibraryPage() {
  const api = useWorkoutApi()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('sessionId')
  const returnUrl = sessionId
    ? `/workout?sessionId=${encodeURIComponent(sessionId)}`
    : '/workout'

  const [categories, setCategories] = useState<WorkoutCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(COLOURS[0])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOrder>('az')

  const [editing, setEditing] = useState<WorkoutCategory | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState(COLOURS[0])
  const [editError, setEditError] = useState<string | null>(null)
  const [archiveTarget, setArchiveTarget] = useState<WorkoutCategory | null>(null)

  const loadCategories = useCallback(async () => {
    try {
      setError(null)
      setCategories(await api.categories.list())
    } catch (cause) {
      setError(getError(cause))
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    const items = categories.filter((item) =>
      item.name.toLocaleLowerCase().includes(query),
    )

    return items.sort((a, b) =>
      sort === 'az'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    )
  }, [categories, search, sort])

  // When opened from a workout, adding an exercise sends the user
  // back to that exact session, with the new exercise already attached.
  async function addToSession(categoryId: string) {
    if (!sessionId) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await api.sessionExercises.add(sessionId, {
        workoutCategoryId: categoryId,
      })
      navigate(returnUrl)
    } catch (cause) {
      setError(`Could not add the exercise to this workout: ${getError(cause)}`)
    } finally {
      setBusy(false)
    }
  }

  async function createExercise(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = newName.trim()
    if (!name) return

    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const created = await api.categories.create({
        name,
        color: newColor,
      })
      setCategories((current) => [...current, created])
      setNewName('')

      if (sessionId) {
        // A successful creation is not rolled back if attaching fails.
        try {
          await api.sessionExercises.add(sessionId, {
            workoutCategoryId: created.id,
          })
          navigate(returnUrl)
        } catch (cause) {
          setError(
            `${created.name} was saved to your library, but couldn't be added to the workout: ${getError(cause)}. Use its Add button below to retry.`,
          )
        }
      } else {
        setNotice(`${created.name} added to your exercise library.`)
      }
    } catch (cause) {
      setError(getError(cause))
    } finally {
      setBusy(false)
    }
  }

  function openEdit(category: WorkoutCategory) {
    setEditing(category)
    setEditName(category.name)
    setEditColor(category.color ?? COLOURS[0])
    setEditError(null)
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editing || !editName.trim()) return

    setBusy(true)
    setEditError(null)
    setNotice(null)
    try {
      const updated = await api.categories.update(editing.id, {
        name: editName.trim(),
        color: editColor,
      })
      setCategories((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      setEditing(null)
      setNotice(`${updated.name} updated.`)
    } catch (cause) {
      setEditError(getError(cause))
    } finally {
      setBusy(false)
    }
  }

  async function archiveExercise() {
    if (!archiveTarget) return
    const category = archiveTarget
    setArchiveTarget(null)
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await api.categories.archive(category.id)
      setCategories((current) => current.filter((item) => item.id !== category.id))
      setNotice(`${category.name} archived. Previous workout records are unaffected.`)
    } catch (cause) {
      setError(getError(cause))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-28 text-slate-100">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to={returnUrl}
            className="inline-flex items-center gap-2 rounded-lg py-1 text-sm font-medium text-slate-400 transition hover:text-violet-300"
          >
            <ArrowLeft size={16} /> Back to Workout
          </Link>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            Build your training toolkit
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Exercise Library
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
            Your moves, your rules. Create, find and manage exercises you can reuse in every workout.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
            <LibraryBig size={22} />
          </div>
          <div>
            <p className="text-2xl font-black tabular-nums text-white">{categories.length}</p>
            <p className="text-xs text-slate-400">Saved exercises</p>
          </div>
        </div>
      </header>

      {sessionId && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-3">
          <p className="text-sm text-cyan-100">
            <span className="font-semibold">Adding to your workout.</span>{' '}
            Create a new exercise or choose an existing one below; you'll return to your session automatically.
          </p>
          <Link to={returnUrl} className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
            Cancel
          </Link>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.08] px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] px-4 py-3 text-sm text-emerald-200">
          {notice}
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.55fr)]">
        <section className="relative overflow-hidden rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.16] via-slate-900 to-slate-900 p-5 shadow-lg sm:p-6">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="relative">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
              <Plus size={25} />
            </span>
            <div className="mt-4 flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Create an exercise</h2>
              <Sparkles size={17} className="text-amber-300" />
            </div>
            <p className="mt-1.5 text-sm leading-6 text-slate-400">
              Bench Press? Bulgarian Split Squat? Give your move a name and pick its colour.
            </p>

            <form className="mt-6 space-y-5" onSubmit={(event) => void createExercise(event)}>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-300">Exercise name</span>
                <input
                  className={inputClass}
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  maxLength={150}
                  placeholder="e.g. Incline Dumbbell Press"
                  autoComplete="off"
                  required
                  disabled={busy}
                />
              </label>
              <div>
                <p className="mb-3 text-xs font-semibold text-slate-300">Choose a colour</p>
                <ColourPicker value={newColor} onChange={setNewColor} disabled={busy} />
              </div>
              <button type="submit" disabled={busy || !newName.trim()} className={`${primaryButton} w-full`}>
                {busy ? <LoaderCircle size={18} className="animate-spin" /> : <Plus size={18} />}
                {sessionId ? 'Create & add to workout' : 'Create exercise'}
                {!busy && <ArrowRight size={16} />}
              </button>
              <p className="text-center text-xs text-slate-500">No predefined list. Every exercise is yours to customise.</p>
            </form>
          </div>
        </section>

        <section className="min-w-0 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Your moves</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filtered.length === categories.length
                  ? `${categories.length} ${categories.length === 1 ? 'exercise' : 'exercises'}`
                  : `${filtered.length} of ${categories.length} exercises`}
              </p>
            </div>
            <div className="min-w-36">
              <Select.Root value={sort} onValueChange={(value) => setSort(value as SortOrder)}>
                <Select.Trigger
                  aria-label="Sort exercises"
                  className="flex min-h-10 w-full items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-violet-400/40"
                >
                  <Select.Value />
                  <Select.Icon><ChevronDown size={15} /></Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content position="popper" sideOffset={5} className="z-[70] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-1 shadow-2xl">
                    <Select.Viewport>
                      {[{ value: 'az', label: 'Name A–Z' }, { value: 'za', label: 'Name Z–A' }].map((option) => (
                        <Select.Item
                          key={option.value}
                          value={option.value}
                          className="relative flex cursor-pointer items-center gap-2 rounded-lg py-2 pl-8 pr-3 text-sm text-slate-200 outline-none data-[highlighted]:bg-violet-500/20"
                        >
                          <Select.ItemIndicator className="absolute left-2"><Check size={15} /></Select.ItemIndicator>
                          <Select.ItemText>{option.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>

          <label className="relative mt-5 block">
            <span className="sr-only">Search exercises</span>
            <Search size={19} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your exercises..."
              className={`${inputClass} pl-11`}
            />
          </label>

          {loading ? (
            <div className="flex items-center gap-3 py-12 text-sm text-slate-400">
              <LoaderCircle size={18} className="animate-spin" /> Loading your exercises...
            </div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center">
              <Dumbbell size={31} className="mx-auto text-slate-600" />
              <h3 className="mt-4 font-semibold text-slate-200">Your library starts here</h3>
              <p className="mt-1 text-sm text-slate-500">Create your first exercise using the form alongside.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center">
              <Search size={27} className="mx-auto text-slate-600" />
              <p className="mt-3 font-medium text-slate-300">No matching exercises</p>
              <button type="button" className="mt-3 text-sm font-semibold text-violet-300 hover:text-violet-200" onClick={() => setSearch('')}>
                Clear search
              </button>
            </div>
          ) : (
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {filtered.map((category) => (
                <article
                  key={category.id}
                  className="group flex min-w-0 flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-3.5 transition hover:border-slate-700 hover:bg-slate-950/80"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${category.color ?? COLOURS[0]}22`, color: category.color ?? COLOURS[0] }}
                    >
                      <Dumbbell size={20} />
                    </div>
                    <h3 className="min-w-0 flex-1 break-words text-sm font-semibold text-slate-100">{category.name}</h3>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-slate-800/70 pt-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => openEdit(category)}
                        className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-40"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setArchiveTarget(category)}
                        className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-40"
                      >
                        <Trash2 size={14} /> Archive
                      </button>
                    </div>
                    {sessionId && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void addToSession(category.id)}
                        className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-violet-500/15 px-3 text-xs font-semibold text-violet-200 transition hover:bg-violet-500/25 disabled:opacity-40"
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Editing an individual exercise is intentionally a small, focused dialog.
          The full library itself is never trapped inside a modal. */}
      <Dialog.Root
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open && !busy) {
            setEditing(null)
            setEditError(null)
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className={overlayClass} />
          <Dialog.Content className={dialogClass}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Dialog.Title className="text-xl font-bold text-white">Edit exercise</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-slate-400">
                  Update its name or colour. Previous workout sets are preserved.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" disabled={busy} aria-label="Close editor" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
                  <X size={19} />
                </button>
              </Dialog.Close>
            </div>
            <form onSubmit={(event) => void saveEdit(event)} className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-300">Exercise name</span>
                <input
                  className={inputClass}
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  maxLength={150}
                  required
                  disabled={busy}
                />
              </label>
              <div>
                <p className="mb-3 text-xs font-semibold text-slate-300">Colour</p>
                <ColourPicker value={editColor} onChange={setEditColor} disabled={busy} />
              </div>
              {editError && (
                <p role="alert" className="text-sm text-rose-300">{editError}</p>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <button type="submit" disabled={busy || !editName.trim()} className={primaryButton}>
                  <Check size={17} /> Save changes
                </button>
                <Dialog.Close asChild>
                  <button type="button" disabled={busy} className={subtleButton}>Cancel</button>
                </Dialog.Close>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <AlertDialog.Root
        open={archiveTarget !== null}
        onOpenChange={(open) => { if (!open) setArchiveTarget(null) }}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={overlayClass} />
          <AlertDialog.Content className={dialogClass}>
            <AlertDialog.Title className="text-xl font-bold text-white">
              Archive {archiveTarget?.name}?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm leading-6 text-slate-400">
              This exercise disappears from your active library, but stays in your previous workouts and their recorded sets.
            </AlertDialog.Description>
            <div className="mt-7 flex justify-end gap-3">
              <AlertDialog.Cancel asChild>
                <button type="button" className={subtleButton}>Keep exercise</button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-rose-500 px-4 text-sm font-semibold text-white transition hover:bg-rose-400"
                  onClick={() => void archiveExercise()}
                >
                  <Trash2 size={16} /> Archive
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  )
}
