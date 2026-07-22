import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import apiBaseUrl from '../../config/apiConfig'
import '../Login/Login.css'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')

  const validate = () => {
    const newErrors = {}

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Debes repetir la contraseña'
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    return newErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setGeneralError('')
    const foundErrors = validate()

    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors)
      return
    }

    setErrors({})

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })

      if (!response.ok) {
        setGeneralError('El enlace no es válido o ha caducado')
        return
      }

      setSubmitted(true)
    } catch {
      setGeneralError('No se pudo conectar con el servidor')
    }
  }

  const renderContent = () => {
    if (!token) {
      return (
        <div role="alert" className="general-error">
          El enlace no es válido. Solicita uno nuevo desde la pantalla de inicio de sesión.
        </div>
      )
    }

    if (submitted) {
      return (
        <div role="status" className="success-message">
          Tu contraseña se ha actualizado correctamente.
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit} aria-label="Formulario de nueva contraseña">

        {generalError && (
          <div role="alert" className="general-error">
            {generalError}
          </div>
        )}

        <label htmlFor="password">Nueva contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="Introduce tu nueva contraseña"
          aria-required="true"
          aria-describedby="password-error"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <span id="password-error" role="alert" className="error">
            {errors.password}
          </span>
        )}

        <label htmlFor="confirmPassword">Repite la contraseña</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Repite tu nueva contraseña"
          aria-required="true"
          aria-describedby="confirm-password-error"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && (
          <span id="confirm-password-error" role="alert" className="error">
            {errors.confirmPassword}
          </span>
        )}

        <button type="submit">
          Guardar contraseña
        </button>
      </form>
    )
  }

  return (
    <main role="main" aria-label="Pantalla de nueva contraseña">

      <section className="hero" aria-hidden="true">
        <h1 className="hero-title">
          Nueva<br />
          <span className="highlight">contraseña.</span>
        </h1>
      </section>

      <section className="form-body">
        {renderContent()}

        <p className="register-link">
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/')}
          >
            Volver al inicio de sesión
          </button>
        </p>
      </section>
    </main>
  )
}

export default ResetPassword