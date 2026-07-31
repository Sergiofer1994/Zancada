import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../config/apiConfig'
import NavBar from '../NavBar/NavBar.jsx'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

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

  const handleAvatarClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    setUploadError('')
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${apiBaseUrl}/api/users/${user.id}/photo`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        setUploadError('No se pudo subir la foto')
        return
      }

      const data = await response.json()
      const updatedUser = { ...user, photoUrl: data.photoUrl }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch {
      setUploadError('No se pudo conectar con el servidor')
    } finally {
      setUploading(false)
    }
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
        <button
          type="button"
          className="profile-avatar"
          onClick={handleAvatarClick}
          aria-label="Cambiar foto de perfil"
        >
          {user.photoUrl ? (
            <img src={user.photoUrl} alt="Foto de perfil" className="profile-avatar-image" />
          ) : (
            getInitials(user.name)
          )}
          <span className="profile-avatar-overlay">Cambiar</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        {uploading && (
          <p className="profile-upload-status" role="status">Subiendo...</p>
        )}
        {uploadError && (
          <p className="profile-upload-status profile-upload-error" role="alert">{uploadError}</p>
        )}

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