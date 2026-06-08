import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import Home from './pages/Home/Home.jsx'
import Run from './pages/Run/Run.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/run" element={<Run />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
