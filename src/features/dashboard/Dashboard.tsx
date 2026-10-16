import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Plus,
  Sparkles,
  Target,
  Utensils,
  WalletCards,
} from 'lucide-react'
import { Link } from 'react-router'

import TaskList from '../tasks/TaskList'

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'

  return 'Good evening'
}

const featureCards = [
  {
    title: 'Tasks',
    description: 'Keep today moving.',
    href: '/tasks',
    icon: CheckCircle2,
    className:
      'from-violet-500/20 via-violet-500/10 to-transparent border-violet-400/20',
    iconClassName: 'bg-violet-500/15 text-violet-300',
  },
  {
    title: 'Nutrition',
    description: 'See what you’ve fuelled.',
    href: '/nutrition',
    icon: Utensils,
    className:
      'from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-400/20',
    iconClassName: 'bg-emerald-500/15 text-emerald-300',
  },
  {
    title: 'Fitness',
    description: 'Stay consistent.',
    href: '/fitness',
    icon: Dumbbell,
    className:
      'from-orange-500/20 via-orange-500/10 to-transparent border-orange-400/20',
    iconClassName: 'bg-orange-500/15 text-orange-300',
  },
  {
    title: 'Goals',
    description: 'Keep sight of the bigger picture.',
    href: '/goals',
    icon: Target,
    className:
      'from-sky-500/20 via-sky-500/10 to-transparent border-sky-400/20',
    iconClassName: 'bg-sky-500/15 text-sky-300',
  },
  {
    title: 'Finance',
    description: 'Know where your money is going.',
    href: '/finance',
    icon: WalletCards,
    className:
      'from-amber-500/20 via-amber-500/10 to-transparent border-amber-400/20',
    iconClassName: 'bg-amber-500/15 text-amber-300',
  },
]

function Dashboard() {
  const today = new Intl.DateTimeFormat('en-IE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <section className="mx-auto w-full max-w-7xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 px-5 py-7 shadow-xl sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-medium text-slate-400">
            {today}
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {getGreeting()}.
          </h1>

          <p className="mt-3 max-w-xl text-base leading-7 text-slate-400">
            Everything you’re working on, in one place.
          </p>
        </div>
      </div>

      {/* Feature shortcuts */}
      <div className="mt-8">
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-400">
            Your Trackline
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
            What are we working on?
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {featureCards.map((feature) => {
            const Icon = feature.icon

            return (
              <Link
                key={feature.title}
                to={feature.href}
                className={`
                  group relative overflow-hidden rounded-2xl border
                  bg-gradient-to-br p-4 transition
                  hover:-translate-y-1 hover:border-white/20
                  hover:shadow-lg
                  sm:p-5
                  ${feature.className}
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`
                      rounded-xl p-2.5
                      ${feature.iconClassName}
                    `}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <ArrowRight
                    className="
                      h-4 w-4 text-slate-500 transition
                      group-hover:translate-x-1 group-hover:text-white
                    "
                  />
                </div>

                <h3 className="mt-5 font-semibold text-white sm:mt-6">
                  {feature.title}
                </h3>

                <p className="mt-1 hidden text-sm leading-5 text-slate-400 sm:block">
                  {feature.description}
                </p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Today's focus */}
      <div className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-violet-400">
              <Sparkles className="h-4 w-4" />

              Today
            </div>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
              Keep your day moving
            </h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.8fr)]">
          {/* Tasks */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-500/15 p-2.5 text-violet-300">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Your focus
                  </p>

                  <p className="text-sm text-slate-400">
                    One thing at a time.
                  </p>
                </div>
              </div>

              <Link
                to="/tasks"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Open tasks"
              >
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="p-4 sm:p-5">
              <TaskList />
            </div>
          </div>

          {/* Right hand cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {/* Nutrition */}
            <Link
              to="/nutrition"
              className="
                group relative min-h-44 overflow-hidden rounded-3xl
                border border-emerald-400/15
                bg-gradient-to-br
                from-emerald-500/20
                via-emerald-500/5
                to-slate-900
                p-5 transition
                hover:-translate-y-1
                hover:border-emerald-400/30
              "
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-400/10 blur-2xl" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-300">
                    <Utensils className="h-6 w-6" />
                  </div>

                  <ArrowRight
                    className="
                      h-5 w-5 text-emerald-200/50 transition
                      group-hover:translate-x-1
                      group-hover:text-emerald-200
                    "
                  />
                </div>

                <div className="mt-8">
                  <p className="text-lg font-semibold text-white">
                    Nutrition
                  </p>

                  <p className="mt-1 text-sm text-emerald-100/60">
                    Log something you ate today.
                  </p>
                </div>
              </div>
            </Link>

            {/* Goals */}
            <Link
              to="/goals"
              className="
                group relative min-h-44 overflow-hidden rounded-3xl
                border border-sky-400/15
                bg-gradient-to-br
                from-sky-500/20
                via-violet-500/5
                to-slate-900
                p-5 transition
                hover:-translate-y-1
                hover:border-sky-400/30
              "
            >
              <div className="pointer-events-none absolute -bottom-14 -right-10 h-40 w-40 rounded-full bg-violet-400/10 blur-2xl" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-sky-400/15 p-3 text-sky-300">
                    <Target className="h-6 w-6" />
                  </div>

                  <ArrowRight
                    className="
                      h-5 w-5 text-sky-200/50 transition
                      group-hover:translate-x-1
                      group-hover:text-sky-200
                    "
                  />
                </div>

                <div className="mt-8">
                  <p className="text-lg font-semibold text-white">
                    Goals
                  </p>

                  <p className="mt-1 text-sm text-sky-100/60">
                    Keep the bigger picture in sight.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Link
            to="/tasks"
            className="
              flex items-center gap-3 rounded-2xl
              border border-white/10
              bg-white/[0.03]
              px-4 py-3.5
              text-sm font-medium text-white
              transition
              hover:bg-white/[0.07]
            "
          >
            <div className="rounded-lg bg-violet-500/15 p-1.5 text-violet-300">
              <Plus className="h-4 w-4" />
            </div>

            Add task
          </Link>

          <Link
            to="/nutrition"
            className="
              flex items-center gap-3 rounded-2xl
              border border-white/10
              bg-white/[0.03]
              px-4 py-3.5
              text-sm font-medium text-white
              transition
              hover:bg-white/[0.07]
            "
          >
            <div className="rounded-lg bg-emerald-500/15 p-1.5 text-emerald-300">
              <Plus className="h-4 w-4" />
            </div>

            Log food
          </Link>

          <Link
            to="/goals"
            className="
              col-span-2 flex items-center gap-3 rounded-2xl
              border border-white/10
              bg-white/[0.03]
              px-4 py-3.5
              text-sm font-medium text-white
              transition
              hover:bg-white/[0.07]
              sm:col-span-1
            "
          >
            <div className="rounded-lg bg-sky-500/15 p-1.5 text-sky-300">
              <Target className="h-4 w-4" />
            </div>

            View goals
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Dashboard