import './App.css'

import { Routes, Route } from 'react-router-dom'
import StartPageBeforeLogin from './ui/template/StartPageBeforeLogin'
import SignUpScreen from './ui/organisms/SignUpScreen'

function App() {
  return (
    <Routes>
      <Route path = "/" element = {<StartPageBeforeLogin />} />
      <Route path = "/signup" element = {<SignUpScreen />} />
    </Routes> 
  )
}

export default App
