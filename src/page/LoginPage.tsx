

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hook/useAuth'
import { loginApi } from '../api/auth.api'
import '../styles/LoginPage.css'

export function LoginPage() {
 
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')        
  const [isLoading, setIsLoading] = useState(false) 

  const { login } = useAuth()       
  const navigate = useNavigate()    

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()  
    setError('')         
    setIsLoading(true)

    try {
      const data = await loginApi(email, clave)  
      login(data.token, data.user)               
      toast.success('Inicio de sesión exitoso')
      navigate('/')                              
    } catch (err: unknown) {
     
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response
      ) {
        const responseData = err.response.data as { error?: { message?: string } }
        const message = responseData?.error?.message ?? 'Usuario o contraseña incorrectos.'
        setError(message)
        toast.error(message)
      } else {
        setError('Usuario o contraseña incorrectos.')
        toast.error('Usuario o contraseña incorrectos.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Bienvenido</h1>
        <p>Ingresa tus credenciales para continuar</p>

        {/* Si hay error, mostramos el mensaje — si no hay error, no se renderiza nada */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="demo@demo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="clave">Contraseña</label>
            <input
              id="clave"
              type="password"
              placeholder="••••••••"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}