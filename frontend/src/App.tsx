import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import { AdminRoute, ProtectedRoute } from './auth/ProtectedRoute'
import { AuthProvider } from './auth/AuthProvider'
import type { AppShellHandle } from './ui/template/AppShell'
import AppShell from './ui/template/AppShell'
import ErrorBoundary from './ui/template/ErrorBoundary'
import StartPageBeforeLogin from './ui/template/StartPageBeforeLogin'
import SignUpScreen from './ui/organisms/SignUpScreen'
import StartPageAfterLogin from './ui/organisms/StartPageAfterLogin'
import MainChatScreen from './ui/organisms/MainChatScreen'
import SimulationScreen from './ui/organisms/SimulationScreen'
import CalendarPage from './ui/organisms/CalendarPage'
import HistoryScreen from './ui/organisms/HistoryScreen'
import MypageScreen from './ui/organisms/MypageScreen'
import AdminScreen from './ui/template/AdminScreen'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path = "/" element = {<StartPageBeforeLogin />} />
      <Route
        path = "/SignUp"
        element = {
          <ProtectedRoute>
            <SignUpScreen />
          </ProtectedRoute>
        }
      />
      <Route
        element = {
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route
          path = "/Start"
          element = {<StartPageAfterLogin />}
          handle = {{ title: 'Start' } satisfies AppShellHandle}
        />
        <Route
          path = "/MainChat"
          element = {<MainChatScreen />}
          handle = {{ title: 'Main Chat', hasRightScreen: true, hasMobileRightPanel: true } satisfies AppShellHandle}
        />
        <Route
          path = "/Simulation"
          element = {<SimulationScreen />}
          handle = {{ title: 'Simulation', hasRightScreen: true, hasMobileRightPanel: true } satisfies AppShellHandle}
        />
        <Route
          path = "/Calendar"
          element = {<CalendarPage />}
          handle = {{ title: 'Calendar', hasRightScreen: true } satisfies AppShellHandle}
        />
        <Route
          path = "/History"
          element = {<HistoryScreen />}
          handle = {{ title: 'History' } satisfies AppShellHandle}
        />
        <Route
          path = "/Mypage"
          element = {<MypageScreen />}
          handle = {{ title: 'Mypage' } satisfies AppShellHandle}
        />
      </Route>
      <Route
        path = "/Admin"
        element = {
          <AdminRoute>
            <AdminScreen />
          </AdminRoute>
        }
      />
    </>
  )
)

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router = { router } />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
