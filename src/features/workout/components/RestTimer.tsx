import { useEffect, useState } from 'react'
import { AlarmClock, SkipForward, Plus, Play } from 'lucide-react'

type RestTimerProps = {
  deadline: number | null
  onDeadlineChange: (value: number | null) => void
  preset: number
  onPresetChange: (value: number) => void
}

function formatSeconds(totalSeconds: number): string {
  const seconds = Math.max(0, totalSeconds)
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

export default function RestTimer({ deadline, onDeadlineChange, preset, onPresetChange }: RestTimerProps) {
  const [now, setNow] = useState(Date.now())
  const remaining = deadline === null ? 0 : Math.max(0, Math.ceil((deadline - now) / 1000))
  const elapsed = deadline !== null && remaining === 0

  useEffect(() => {
    if (deadline === null) return
    setNow(Date.now())
    const interval = window.setInterval(() => setNow(Date.now()), 300)
    return () => window.clearInterval(interval)
  }, [deadline])

  return (
    <section aria-label="Rest timer" className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-cyan-400/10 p-2 text-cyan-300"><AlarmClock size={19} /></span>
          <div>
            <p className="text-sm font-semibold text-white">Rest timer</p>
            <p className="text-xs text-slate-400">Automatically starts when you log a set</p>
          </div>
        </div>
        <p role="timer" aria-live="off" className={`text-3xl font-black tabular-nums ${elapsed ? 'text-emerald-300' : 'text-cyan-300'}`}>
          {elapsed ? 'Ready!' : deadline === null ? formatSeconds(preset) : formatSeconds(remaining)}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div aria-label="Rest duration" className="flex flex-wrap gap-2">
          {[60, 90, 120].map((seconds) => (
            <button key={seconds} type="button" aria-pressed={preset === seconds} onClick={() => onPresetChange(seconds)}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${preset === seconds ? 'border-cyan-400/45 bg-cyan-500/15 text-cyan-200' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}>
              {seconds}s
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {deadline !== null && !elapsed ? (
            <>
              <button type="button" onClick={() => onDeadlineChange(deadline + 30000)} className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"><Plus size={14} />30s</button>
              <button type="button" onClick={() => onDeadlineChange(null)} className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"><SkipForward size={14} />Skip</button>
            </>
          ) : (
            <button type="button" onClick={() => onDeadlineChange(Date.now() + preset * 1000)} className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/20 px-3 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/30"><Play size={14} />{elapsed ? 'Restart' : 'Start'}</button>
          )}
        </div>
      </div>
    </section>
  )
}
