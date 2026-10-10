import { Route, Routes } from 'react-router'
import AppShell from './components/layout/AppShell'
import Dashboard from './features/dashboard/Dashboard'
import TasksPage from './features/tasks/TasksPage'
import GoalsPage from './features/goals/GoalsPage'
import FitnessPage from './features/fitness/FitnessPage'
import NutritionPage from './features/nutrition/NutritionPage'
import FinancePage from './features/finance/FinancePage'
import VaultPage from './features/vault/VaultPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />

        <Route
          path="tasks"
          element={<TasksPage />}
        />

        <Route
          path="goals"
          element={<GoalsPage />}
        />

        <Route
          path="fitness"
          element={<FitnessPage />}
        />

        <Route
          path="nutrition"
          element={<NutritionPage />}
        />

        <Route
          path="finance"
          element={<FinancePage />}
        />

        <Route
          path="vault"
          element={<VaultPage />}
        />
      </Route>
    </Routes>
  )
}

export default App