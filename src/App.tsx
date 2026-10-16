import { Route, Routes } from 'react-router'

import ProtectedRoute from './auth/ProtectedRoute'
import AppShell from './components/layout/AppShell'
import Dashboard from './features/dashboard/Dashboard'
import FinancePage from './features/finance/FinancePage'
import FitnessPage from './features/fitness/FitnessPage'
import GoalsPage from './features/goals/GoalsPage'
import LoginPage from './features/auth/LoginPage'
import NutritionPage from './features/nutrition/NutritionPage'
import TasksPage from './features/tasks/TasksPage'
import VaultPage from './features/vault/VaultPage'

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route
            index
            element={<Dashboard />}
          />

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
      </Route>
    </Routes>
  )
}

export default App