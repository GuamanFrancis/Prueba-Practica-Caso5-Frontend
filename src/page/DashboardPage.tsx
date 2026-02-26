import { useEffect, useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { getConferencistas } from '../api/conferencias.api'
import { getAuditorios } from '../api/auditorios.api'
import { getReservas } from '../api/reservas.api'
import '../styles/DashboardPage.css'

interface DashboardCounts {
  conferencistas: number
  auditorios: number
  reservas: number
}

const DashboardPage = () => {
  const { user } = useAuth()
  const [counts, setCounts] = useState<DashboardCounts>({
    conferencistas: 0,
    auditorios: 0,
    reservas: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadCounts() {
      setError('')
      setIsLoading(true)
      try {
        const [conferencistas, auditorios, reservas] = await Promise.all([
          getConferencistas(),
          getAuditorios(),
          getReservas(),
        ])

        setCounts({
          conferencistas: conferencistas.length,
          auditorios: auditorios.length,
          reservas: reservas.length,
        })
      } catch {
        setError('No se pudieron cargar las estadísticas del dashboard.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadCounts()
  }, [])

  return (
    <section className="dashboard-page">
      <header className="dashboard-page__header">
        <div>
          <h1 className="dashboard-page__title">Dashboard</h1>
          <p className="dashboard-page__subtitle">
            Bienvenido, <strong>{user?.nombre} {user?.apellido}</strong>
          </p>
        </div>
      </header>

      {error && <p className="dashboard-page__error">{error}</p>}

      <div className="dashboard-page__stats-grid">
        <article className="dashboard-page__stat-card">
          <p className="dashboard-page__stat-label">Conferencistas</p>
          <p className="dashboard-page__stat-value">{isLoading ? '...' : counts.conferencistas}</p>
        </article>

        <article className="dashboard-page__stat-card">
          <p className="dashboard-page__stat-label">Auditorios</p>
          <p className="dashboard-page__stat-value">{isLoading ? '...' : counts.auditorios}</p>
        </article>

        <article className="dashboard-page__stat-card">
          <p className="dashboard-page__stat-label">Reservas</p>
          <p className="dashboard-page__stat-value">{isLoading ? '...' : counts.reservas}</p>
        </article>
      </div>
    </section>
  )
}

export default DashboardPage
