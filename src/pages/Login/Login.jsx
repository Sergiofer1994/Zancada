import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}

    if (!email) {
      newErrors.email = 'El email es obligatorio'
    } else if (!email.includes('@')) {
      newErrors.email = 'El email no es válido'
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
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
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        setGeneralError('Email o contraseña incorrectos')
        return
      }

      const user = await response.json()
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/home')
    } catch {
      setGeneralError('No se pudo conectar con el servidor')
    }
  }

  return (
    <main role="main" aria-label="Pantalla de inicio de sesión">

      <section className="hero" aria-hidden="true">
        <h1 className="hero-title">
          Cada zancada<br />
          <span className="highlight">cuenta.</span>
        </h1>
      </section>

      <section className="form-body">
        <form onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión">

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

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Introduce tu contraseña"
            aria-required="true"
            aria-describedby="password-error"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span id="password-error" role="alert" className="error">
              {errors.password}
            </span>
          )}

          <a href="#" aria-label="Recuperar contraseña olvidada">
            ¿Olvidaste tu contraseña?
          </a>

          <button type="submit">
            Iniciar sesión
          </button>

          <p className="register-link">
            Aún no tienes cuenta{' '}
            <button
              type="button"
              className="link-button"
              onClick={() => navigate('/register')}
            >
              Regístrate gratis
            </button>
          </p>

        </form>
      </section>
    </main>
  )
}

export default Login
