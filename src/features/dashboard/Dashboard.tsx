import StatCard from '../../components/ui/StatCard'
import TaskList from '../tasks/TaskList'

function Dashboard() {
  return (
    <section>
      <p className="text-sm font-medium uppercase tracking-widest text-slate-400">
        Personal Dashboard
      </p>

      <h2 className="mt-2 text-4xl font-bold tracking-tight">
        Dashboard
      </h2>

      <p className="mt-3 text-slate-400">
        Your life, tracked in one place.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Tasks"
          value="8"
          subtitle="3 due today"
        />

        <StatCard
          title="Calories"
          value="1,820"
          subtitle="380 remaining"
        />

        <StatCard
          title="Workouts"
          value="4"
          subtitle="This week"
        />

        <StatCard
          title="Spending"
          value="€428"
          subtitle="This month"
        />
      </div>
      <div className="mt-6 max-w-2xl">
        <TaskList />
      </div>

    </section>
  )
}

export default Dashboard