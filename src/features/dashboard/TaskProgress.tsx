import { useState } from "react";

function TaskProgress() {
  const [completedTasks, setCompletedTasks] = useState(2);

  function handleIncrement() {
  setCompletedTasks((current) => current + 1)
}

function handleDecrement() {
  setCompletedTasks((current) =>
    current > 0 ? current - 1 : current
  )
}

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-sm text-slate-400">Today's completed tasks</p>

      <p className="mt-2 text-3xl font-semibold text-white">{completedTasks}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleDecrement}
          className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
        >
          −
        </button>

        <button
          onClick={handleIncrement}
          className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default TaskProgress;
