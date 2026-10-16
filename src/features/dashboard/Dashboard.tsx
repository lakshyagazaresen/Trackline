import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
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
    icon: <CheckCircle2 className="h-6 w-6" />,
    className:
      'from-violet-500/20 via-violet-500/10 to-transparent border-violet-400/20',
  },
  {
    title: 'Nutrition',
    description: 'See what you’ve fuelled.',
    href: '/nutrition',
    icon: <Utensils className="h-6 w-6" />,
    className:
      'from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-400/20',
  },
  {
    title: 'Fitness',
    description: 'Stay consistent.',
    href: '/fitness',
    icon: <Dumbbell className="h-6 w-6" />,
    className:
      'from-orange-500/20 via-orange-500/10 to-transparent border-orange-400/20',
  },
  {
    title: 'Goals',
    description: 'Keep sight of the bigger picture.',
    href: '/goals',
    icon: <Target className="h-6 w-6" />,
    className:
      'from-sky-500/20 via-sky-500/10 to-transparent border-sky-400/20',
  },
  {
    title: 'Finance',
    description: 'Know where your money is going.',
    href: '/finance',
    icon: <WalletCards className="h-6 w-6" />,
    className:
      'from-amber-500/20 via-amber-500/10 to-transparent border-amber-400/20',
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
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 px-6 py-8 shadow-xl sm:px-8 sm:py-10">
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
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Your Trackline
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              What are we working on?
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {featureCards.map((feature) => (
            <Link
              key={feature.title}
              to={feature.href}
              className={`
                group relative overflow-hidden rounded-2xl border
                bg-gradient-to-br p-5 transition
                hover:-translate-y-1 hover:border-white/20
                hover:shadow-lg
                ${feature.className}
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl bg-white/10 p-2.5 text-white">
                  {feature.icon}
                </div>

                <ArrowRight
                  className="
                    h-4 w-4 text-slate-500 transition
                    group-hover:translate-x-1 group-hover:text-white
                  "
                />
              </div>

              <h3 className="mt-6 font-semibold text-white">
                {feature.title}
              </h3>

              <p className="mt-1 text-sm leading-5 text-slate-400">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's tasks */}
      <div className="mt-10">
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-400">
            Focus
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            Keep today moving
          </h2>
        </div>

        <div className="max-w-3xl">
          <TaskList />
        </div>
      </div>
    </section>
  )
}

export default Dashboard