import TaskList from './TaskList'

function TasksPage() {
  return (
    <section>
      <p className="text-sm font-medium uppercase tracking-widest text-slate-400">
        Productivity
      </p>

      <h2 className="mt-2 text-4xl font-bold tracking-tight">
        Tasks
      </h2>

      <p className="mt-3 text-slate-400">
        Manage your tasks and priorities.
      </p>

      <div className="mt-8 max-w-2xl">
        <TaskList />
      </div>
    </section>
  )
}

export default TasksPage