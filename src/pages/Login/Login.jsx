import { useState } from 'react'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Email:', email)
    console.log('Contraseña:', password)
  }

  return (
    <main role="main" aria-label="Pantalla de inicio de sesión">
      <h1>Zancada</h1>
      <p>Tu compañero de carrera</p>

      <form onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión">

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Introduce tu email"
          aria-required="true"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="Introduce tu contraseña"
          aria-required="true"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <a
          href="#"
          aria-label="Recuperar contraseña olvidada"
        >
          ¿Olvidaste tu contraseña?
        </a>

        <button type="submit">
          Iniciar sesión
        </button>

        <button type="button">
          Crear cuenta nueva
        </button>

      </form>
    </main>
  )
}

export default Login
