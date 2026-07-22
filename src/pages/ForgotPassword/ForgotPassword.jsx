import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../config/apiConfig'
import '../Login/Login.css'
import './ForgotPassword.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}

    if (!email) {
      newErrors.email = 'El email es obligatorio'
    } else if (!email.includes('@')) {
      newErrors.email = 'El email no es válido'
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
      const response = await fetch(`${apiBaseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        setGeneralError('No se pudo procesar la solicitud')
        return
      }

      setSubmitted(true)
    } catch {
      setGeneralError('No se pudo conectar con el servidor')
    }
  }

  return (
    <main role="main" aria-label="Pantalla de recuperación de contraseña">

      <section className="hero" aria-hidden="true">
        <h1 className="hero-title">
          Recupera tu<br />
          <span className="highlight">acceso.</span>
        </h1>
      </section>

      <section className="form-body">
        {submitted ? (
          <div role="status" className="success-message">
            Si el email existe, te hemos enviado un enlace para restablecer tu contraseña.
          </div>
        ) : (
          <form onSubmit={handleSubmit} aria-label="Formulario de recuperación de contraseña">

            {generalError && (
              <div role="alert" className="general-error">
                {generalError}
              </div>
            )}

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Introduce tu email"
              aria-required="true"
              aria-describedby="email-error"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <span id="email-error" role="alert" className="error">
                {errors.email}
              </span>
            )}

            <button type="submit">
              Enviar enlace
            </button>
          </form>
        )}

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

export default ForgotPassword