import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../NavBar/NavBar.jsx'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      navigate('/')
      return
    }

    setUser(JSON.parse(storedUser))
  }, [navigate])

  const getInitials = (name) => {
    return name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  if (!user) {
    return null
  }

  return (
    <main className="profile-page" role="main" aria-label="Perfil del usuario">

      <header className="profile-header">
        <div className="profile-avatar" aria-label="Avatar del usuario">
          {getInitials(user.name)}
        </div>
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-email">{user.email}</p>
      </header>

      <section className="profile-info" aria-label="Datos de la cuenta">
        <div className="profile-field">
          <span className="profile-field-label">Nombre</span>
          <span className="profile-field-value">{user.name}</span>
        </div>
        <div className="profile-field">
          <span className="profile-field-label">Email</span>
          <span className="profile-field-value">{user.email}</span>
        </div>
      </section>

      <button
        type="button"
        className="logout-button"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>

      <NavBar />
    </main>
  )
}

export default Profile