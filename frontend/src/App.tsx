import { Routes, Route } from 'react-router-dom'

import { AdminRoute, ProtectedRoute } from './auth/ProtectedRoute'
import { AuthProvider } from './auth/AuthProvider'
import StartPageBeforeLogin from './ui/template/StartPageBeforeLogin'
import SignUpScreen from './ui/organisms/SignUpScreen'
import FullMainScreen from './ui/template/FullMainScreen'
import AdminScreen from './ui/template/AdminScreen'

function App() {
  return (
    <AuthProvider>
      <Routes>
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
          path = "/Start"
          element = {
            <ProtectedRoute>
              <FullMainScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path = "/MainChat"
          element = {
            <ProtectedRoute>
              <FullMainScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path = "/Simulation"
          element = {
            <ProtectedRoute>
              <FullMainScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path = "/Calendar"
          element = {
            <ProtectedRoute>
              <FullMainScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path = "/History"
          element = {
            <ProtectedRoute>
              <FullMainScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path = "/Mypage"
          element = {
            <ProtectedRoute>
              <FullMainScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path = "/Admin"
          element = {
            <AdminRoute>
              <AdminScreen />
            </AdminRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
