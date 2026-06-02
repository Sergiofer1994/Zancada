import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Login/Login.css'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}

    if (!name) {
      newErrors.name = 'El nombre es obligatorio'
    }

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
    console.log('Nombre:', name)
    console.log('Email:', email)
    console.log('Contraseña:', password)
  }

  return (
    <main role="main" aria-label="Pantalla de registro">
      <h1>Zancada</h1>
      <p>Crea tu cuenta gratis</p>

      <form onSubmit={handleSubmit} aria-label="Formulario de registro">

        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          type="text"
          placeholder="Introduce tu nombre"
          aria-required="true"
          aria-describedby="name-error"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && (
          <span id="name-error" role="alert" className="error">
            {errors.name}
          </span>
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
          placeholder="Mínimo 6 caracteres"
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

        <button type="submit">
          Crear cuenta
        </button>

        <button type="button" onClick={() => navigate('/')}>
          Ya tengo cuenta
        </button>

      </form>
    </main>
  )
}

export default Register
