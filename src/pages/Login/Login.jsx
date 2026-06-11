import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
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

  const handleSubmit = (event) => {
    event.preventDefault()
    const foundErrors = validate()

    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors)
      return
    }

    setErrors({})
    navigate('/home')
  }

  return (
    <main role="main" aria-label="Pantalla de inicio de sesión">

      <section className="hero" aria-hidden="true">
        <svg
          className="hero-route"
          viewBox="0 0 400 220"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0,180 Q70,130 140,150 T280,105 T400,85"
            fill="none"
            stroke="#9F7AFF"
            strokeWidth="3"
            opacity="0.85"
            strokeLinecap="round"
          />
          <path
            d="M0,200 Q90,170 180,180 T340,140 T400,130"
            fill="none"
            stroke="#9F7AFF"
            strokeWidth="2"
            opacity="0.3"
            strokeLinecap="round"
          />
          <circle cx="352" cy="92" r="6" fill="#9F7AFF" />
          <circle cx="352" cy="92" r="12" fill="#9F7AFF" opacity="0.25" />
        </svg>
        <h1 className="hero-title">
          Cada zancada<br />
          <span className="highlight">cuenta.</span>
        </h1>
      </section>

      <section className="form-body">
        <form onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión">

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
            ¿Sin cuenta?{' '}
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