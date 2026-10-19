import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import * as Select from '@radix-ui/react-select'
import { Activity, ArrowLeft, Award, BarChart3, Check, ChevronDown, Dumbbell, TrendingUp } from 'lucide-react'
import { useWorkoutHistory } from '../hooks/useWorkoutHistory'

type ExerciseSummary = {
  id: string
  name: string
  color: string | null
  maxWeight: number
  maxSetVolume: number
  loggedSets: number
  sessions: { date: string; weight: number }[]
}

function compact(value: number) {
  return new Intl.NumberFormat('en-IE', { maximumFractionDigits: 1 }).format(value)
}

const panel = 'rounded-3xl border border-slate-800 bg-slate-900/65 p-5 sm:p-6'

export default function WorkoutInsightsPage() {
  const { sessions, completed, isLoading, error, failedCount } = useWorkoutHistory(30)
  const [selectedExerciseId, setSelectedExerciseId] = useState('')

  const summary = useMemo(() => {
    const exerciseMap = new Map<string, ExerciseSummary>()
    const sessionsWithVolume = completed.map((session) => {
      let volume = 0
      let logged = 0
      const inSession = new Map<string, number>()
      for (const exercise of session.exercises) {
        let stats = exerciseMap.get(exercise.workoutCategoryId)
        if (!stats) {
          stats = {
            id: exercise.workoutCategoryId, name: exercise.exerciseName,
            color: exercise.exerciseColor, maxWeight: 0, maxSetVolume: 0,
            loggedSets: 0, sessions: [],
          }
          exerciseMap.set(exercise.workoutCategoryId, stats)
        }
        for (const set of exercise.sets) {
          if (!set.isCompleted) continue
          logged += 1
          stats.loggedSets += 1
          const weight = set.weightKg ?? 0
          const setVolume = weight * (set.reps ?? 0)
          volume += setVolume
          stats.maxWeight = Math.max(stats.maxWeight, weight)
          stats.maxSetVolume = Math.max(stats.maxSetVolume, setVolume)
          inSession.set(stats.id, Math.max(inSession.get(stats.id) ?? 0, weight))
        }
      }
      for (const [id, weight] of inSession) {
        exerciseMap.get(id)?.sessions.push({ date: session.workoutDate, weight })
      }
      return { id: session.id, name: session.name, date: session.workoutDate, volume, logged }
    })
    const exercises = [...exerciseMap.values()].sort((a, b) => a.name.localeCompare(b.name))
    for (const exercise of exercises) {
      exercise.sessions.sort((a, b) => a.date.localeCompare(b.date))
    }
    const completedCount = sessions.filter((session) => session.status === 'Completed').length
    return {
      exercises,
      completedCount,
      volume: sessionsWithVolume.reduce((sum, session) => sum + session.volume, 0),
      logged: sessionsWithVolume.reduce((sum, session) => sum + session.logged, 0),
      timeline: sessionsWithVolume.sort((a, b) => a.date.localeCompare(b.date)).slice(-10),
    }
  }, [completed, sessions])

  const selectedExercise = summary.exercises.find((item) => item.id === selectedExerciseId) ?? summary.exercises[0]
  const maxSessionVolume = Math.max(1, ...summary.timeline.map((session) => session.volume))
  const strengthSeries = selectedExercise?.sessions.slice(-12) ?? []
  const maxStrength = Math.max(1, ...strengthSeries.map((item) => item.weight))

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-28 text-slate-100">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/workout" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16} /> Back to Workout</Link>
          <p className="text-sm font-semibold text-violet-300">Small wins add up</p>
          <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">Progress Insights</h1>
          <p className="mt-2 text-sm text-slate-400">Your strength and training trends from completed workouts.</p>
        </div>
        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-200">Your last 30 completed sessions</span>
      </header>

      {error && <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">{error}</div>}
      {isLoading ? (
        <div className={`${panel} animate-pulse text-sm text-slate-400`}>Loading your training history...</div>
      ) : completed.length === 0 ? (
        <div className={`${panel} text-center`}>
          <Dumbbell size={30} className="mx-auto text-violet-400" />
          <h2 className="mt-3 text-lg font-semibold text-white">Your first milestone is ahead</h2>
          <p className="mt-2 text-sm text-slate-400">Finish a workout with at least one logged set to start tracking your progress.</p>
          <Link to="/workout" className="mt-5 inline-flex rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white">Go to Workout</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Finished workouts', value: compact(summary.completedCount), icon: Check },
              { label: 'Logged sets', value: compact(summary.logged), icon: Activity },
              { label: 'Training volume', value: `${compact(summary.volume)} kg`, icon: BarChart3 },
              { label: 'Exercises trained', value: compact(summary.exercises.length), icon: Award },
            ].map((stat) => {
              const Icon = stat.icon
              return <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/65 p-4">
                <Icon className="text-violet-300" size={20} />
                <p className="mt-4 text-2xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
              </div>
            })}
          </div>

          <section className={panel}>
            <div className="flex items-center gap-2"><TrendingUp size={19} className="text-violet-300" /><h2 className="text-lg font-semibold text-white">Training volume by workout</h2></div>
            <p className="mt-1 text-xs text-slate-500">Only completed, weighted sets count towards volume (weight × reps). Bodyweight sets remain in logged-set totals.</p>
            <div className="mt-6 flex h-52 items-end gap-2 rounded-xl bg-slate-950/45 p-3 sm:gap-4">
              {summary.timeline.map((item) => (
                <div key={item.id} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2" title={`${item.name} · ${compact(item.volume)} kg · ${item.date}`}>
                  <span className="text-[10px] text-slate-400">{compact(item.volume)}</span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-cyan-400 transition-all group-hover:brightness-125" style={{ height: `${Math.max(4, item.volume / maxSessionVolume * 156)}px` }} />
                  <span className="text-[10px] text-slate-500">{item.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <section className={panel}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h2 className="text-lg font-semibold text-white">Strength progression</h2><p className="mt-1 text-xs text-slate-500">Heaviest logged set per completed workout</p></div>
                {summary.exercises.length > 0 && (
                  <Select.Root value={selectedExercise?.id} onValueChange={setSelectedExerciseId}>
                    <Select.Trigger aria-label="Choose an exercise for strength progression" className="flex min-h-10 min-w-48 items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white"><Select.Value /><Select.Icon><ChevronDown size={15} /></Select.Icon></Select.Trigger>
                    <Select.Portal><Select.Content position="popper" sideOffset={4} className="z-[70] max-h-72 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-1 shadow-xl"><Select.Viewport>{summary.exercises.map((exercise) => (
                      <Select.Item key={exercise.id} value={exercise.id} className="relative cursor-pointer rounded-lg py-2 pl-8 pr-4 text-sm text-slate-200 outline-none data-[highlighted]:bg-violet-500/20"><Select.ItemIndicator className="absolute left-2"><Check size={14}/></Select.ItemIndicator><Select.ItemText>{exercise.name}</Select.ItemText></Select.Item>
                    ))}</Select.Viewport></Select.Content></Select.Portal>
                  </Select.Root>
                )}
              </div>
              <div className="mt-6 flex h-48 items-end gap-2 rounded-xl bg-slate-950/45 p-3">
                {strengthSeries.length === 0 ? <p className="self-center text-sm text-slate-500">No logged sets for this exercise yet.</p> : strengthSeries.map((item, i) => (
                  <div key={`${item.date}-${i}`} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2" title={`${item.date} · ${item.weight} kg`}>
                    <span className="text-[10px] text-slate-400">{compact(item.weight)}</span>
                    <div className="w-full rounded-t-lg bg-cyan-400/75" style={{ height: `${Math.max(4, item.weight / maxStrength * 140)}px` }} />
                    <span className="text-[10px] text-slate-500">{item.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className={panel}>
              <div className="flex items-center gap-2"><Award size={19} className="text-amber-300" /><h2 className="text-lg font-semibold text-white">Personal records</h2></div>
              <p className="mt-1 text-xs text-slate-500">Highest logged weight by exercise within the displayed history.</p>
              {summary.exercises.length === 0 ? <p className="mt-6 text-sm text-slate-500">Log a set to start collecting records.</p> : (
                <div className="mt-5 space-y-3">
                  {[...summary.exercises].sort((a, b) => b.maxWeight - a.maxWeight).slice(0, 8).map((exercise) => (
                    <div key={exercise.id} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-3">
                      <span className="size-3 rounded-full" style={{ backgroundColor: exercise.color ?? '#8b5cf6' }} />
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-200">{exercise.name}</p><p className="text-xs text-slate-500">{exercise.loggedSets} logged sets</p></div>
                      <span className="text-sm font-bold text-amber-300">{compact(exercise.maxWeight)} kg</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
          <p className="text-xs leading-5 text-slate-500">Insights cover up to the 30 most recent completed workouts{failedCount ? ' that could be loaded' : ''}; they are not lifetime records if you have more history. Progress is based on recorded external weight, not bodyweight or estimated one-rep max.</p>
        </>
      )}
    </div>
  )
}
