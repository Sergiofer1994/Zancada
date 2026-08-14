import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx'
import Home from './pages/Home/Home.jsx'
import History from './pages/History/History.jsx'
import Stats from './pages/Stats/Stats.jsx'
import Run from './pages/Run/Run.jsx'
import Summary from './pages/Summary/Summary.jsx'
import RoutesList from './pages/Routes/RoutesList.jsx'
import RouteCreator from './pages/Routes/RouteCreator.jsx'
import RouteViewer from './pages/Routes/RouteViewer.jsx'
import Profile from './pages/Profile/Profile.jsx'
import NavBar from './pages/NavBar/NavBar.jsx'
import useBackendWarmup from './hooks/useBackendWarmup.js'

const NAVBAR_PATHS = ['/home', '/history', '/routes', '/stats', '/profile']

function AppShell() {
  const location = useLocation()
  const showNavBar = NAVBAR_PATHS.includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/run" element={<Run />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/routes" element={<RoutesList />} />
        <Route path="/routes/new" element={<RouteCreator />} />
        <Route path="/routes/:id" element={<RouteViewer />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {showNavBar && <NavBar />}
    </>
  )
}

function App() {
  useBackendWarmup()

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App