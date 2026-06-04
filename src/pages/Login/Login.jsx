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
    <main className="auth-page" role="main" aria-label="Pantalla de inicio de sesión">
      <h1>Zancada</h1>
      <p>Tu compañero de carrera</p>

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

        <button type="button" onClick={() => navigate('/register')}>
          Crear cuenta nueva
        </button>

      </form>
    </main>
  )
}

export default Login
