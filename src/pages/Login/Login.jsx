import './Login.css'

function Login() {
  return (
    <main role="main" aria-label="Pantalla de inicio de sesión">
      <h1>Zancada</h1>
      <p>Tu compañero de carrera</p>

      <form aria-label="Formulario de inicio de sesión">

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Introduce tu email"
          aria-required="true"
          autoComplete="email"
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="Introduce tu contraseña"
          aria-required="true"
          autoComplete="current-password"
        />

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
