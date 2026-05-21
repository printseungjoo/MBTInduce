import './App.css'

import { Routes, Route } from 'react-router-dom'
import StartPageBeforeLogin from './ui/template/StartPageBeforeLogin'
import SignUpScreen from './ui/organisms/SignUpScreen'
import FullMainScreen from './ui/template/FullMainScreen'

function App() {
  return (
    <Routes>
      <Route path = "/" element = {<StartPageBeforeLogin />} />
      <Route path = "/SignUp" element = {<SignUpScreen />} />
      <Route path = "/MainChat" element = {<FullMainScreen />} />
      <Route path = "/Simulation" element = {<FullMainScreen />} />
      <Route path = "/Calendar" element = {<FullMainScreen />} />
      <Route path = "/History" element = {<FullMainScreen />} />
    </Routes> 
  )
}

export default App
