import './App.css'

import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import StartPageBeforeLogin from './ui/template/StartPageBeforeLogin'
import SignUpScreen from './ui/organisms/SignUpScreen'
import FullMainScreen from './ui/template/FullMainScreen'
import AdminScreen from './ui/template/AdminScreen'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'fail'>('loading');
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });
        setStatus(response.ok ? 'ok' : 'fail');
      } catch (error) {
        console.error(error);
        setStatus('fail');
      }
    }
    checkAuth();
  }, []);
  if (status === 'loading') {
    return null;
  }
  if (status === 'fail') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'fail'>('loading');
  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          setStatus('fail');
          return;
        }
        const data = await response.json();
        if (data.data?.isAdmin) {
          setStatus('ok');
        } else {
          setStatus('fail');
        }
      } catch (error) {
        console.error(error);
        setStatus('fail');
      }
    }
    checkAdmin();
  }, []);
  if (status === 'loading') {
    return null;
  }
  if (status === 'fail') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
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
  )
}

export default App