import type {
  TaskCategoryColor,
} from './taskCategoryTypes'

type CategoryColorStyle = {
  dot: string
  pill: string
}

export const taskCategoryColors:
  Record<
    TaskCategoryColor,
    CategoryColorStyle
  > = {
  Slate: {
    dot: 'bg-slate-400',
    pill:
      'border-slate-700 bg-slate-800 text-slate-300',
  },

  Sky: {
    dot: 'bg-sky-400',
    pill:
      'border-sky-800 bg-sky-950/50 text-sky-300',
  },

  Blue: {
    dot: 'bg-blue-400',
    pill:
      'border-blue-800 bg-blue-950/50 text-blue-300',
  },

  Indigo: {
    dot: 'bg-indigo-400',
    pill:
      'border-indigo-800 bg-indigo-950/50 text-indigo-300',
  },

  Violet: {
    dot: 'bg-violet-400',
    pill:
      'border-violet-800 bg-violet-950/50 text-violet-300',
  },

  Fuchsia: {
    dot: 'bg-fuchsia-400',
    pill:
      'border-fuchsia-800 bg-fuchsia-950/50 text-fuchsia-300',
  },

  Rose: {
    dot: 'bg-rose-400',
    pill:
      'border-rose-800 bg-rose-950/50 text-rose-300',
  },

  Orange: {
    dot: 'bg-orange-400',
    pill:
      'border-orange-800 bg-orange-950/50 text-orange-300',
  },

  Amber: {
    dot: 'bg-amber-400',
    pill:
      'border-amber-800 bg-amber-950/50 text-amber-300',
  },

  Lime: {
    dot: 'bg-lime-400',
    pill:
      'border-lime-800 bg-lime-950/50 text-lime-300',
  },

  Emerald: {
    dot: 'bg-emerald-400',
    pill:
      'border-emerald-800 bg-emerald-950/50 text-emerald-300',
  },

  Teal: {
    dot: 'bg-teal-400',
    pill:
      'border-teal-800 bg-teal-950/50 text-teal-300',
  },

  Cyan: {
    dot: 'bg-cyan-400',
    pill:
      'border-cyan-800 bg-cyan-950/50 text-cyan-300',
  },

  Pink: {
    dot: 'bg-pink-400',
    pill:
      'border-pink-800 bg-pink-950/50 text-pink-300',
  },
}