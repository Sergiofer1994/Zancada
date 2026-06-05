import { useNavigate, useLocation } from 'react-router-dom'
import './NavBar.css'

function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav role="navigation" aria-label="Navegación principal">
      <button
        type="button"
        className={isActive('/home') ? 'nav-item active' : 'nav-item'}
        onClick={() => navigate('/home')}
        aria-label="Ir a inicio"
        aria-current={isActive('/home') ? 'page' : undefined}
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Inicio</span>
      </button>

      <button
        type="button"
        className={isActive('/history') ? 'nav-item active' : 'nav-item'}
        onClick={() => navigate('/history')}
        aria-label="Ir a historial"
        aria-current={isActive('/history') ? 'page' : undefined}
      >
        <span className="nav-icon">📋</span>
        <span className="nav-label">Historial</span>
      </button>

      <button
        type="button"
        className={isActive('/stats') ? 'nav-item active' : 'nav-item'}
        onClick={() => navigate('/stats')}
        aria-label="Ir a estadísticas"
        aria-current={isActive('/stats') ? 'page' : undefined}
      >
        <span className="nav-icon">📊</span>
        <span className="nav-label">Estadísticas</span>
      </button>

      <button
        type="button"
        className={isActive('/profile') ? 'nav-item active' : 'nav-item'}
        onClick={() => navigate('/profile')}
        aria-label="Ir a perfil"
        aria-current={isActive('/profile') ? 'page' : undefined}
      >
        <span className="nav-icon">👤</span>
        <span className="nav-label">Perfil</span>
      </button>
    </nav>
  )
}

export default NavBar