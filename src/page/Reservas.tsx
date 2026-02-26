import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import type { Auditorio, Conferencista, Reserva } from '../types/entities'
import { getAuditorios } from '../api/auditorios.api'
import { getConferencistas } from '../api/conferencias.api'
import { createReserva, deleteReserva, getReservas, type CreateReservaDto } from '../api/reservas.api'
import '../styles/Reservas.css'

const EMPTY_FORM: CreateReservaDto = {
  conferencistaId: 0,
  auditorioId: 0,
  fecha: '',
  tema: '',
}

export function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [conferencistas, setConferencistas] = useState<Conferencista[]>([])
  const [auditorios, setAuditorios] = useState<Auditorio[]>([])
  const [formData, setFormData] = useState<CreateReservaDto>(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void loadAll()
  }, [])

  async function loadAll() {
    try {
      const [listReservas, listConferencistas, listAuditorios] = await Promise.all([
        getReservas(),
        getConferencistas(),
        getAuditorios(),
      ])
      setReservas(listReservas)
      setConferencistas(listConferencistas)
      setAuditorios(listAuditorios)
    } catch {
      const message = 'No se pudieron cargar los datos de reservas.'
      setError(message)
      toast.error(message)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'conferencistaId' || name === 'auditorioId' ? Number(value) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.conferencistaId || !formData.auditorioId) {
      const message = 'Debes seleccionar un conferencista y un auditorio.'
      setError(message)
      toast.error(message)
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await createReserva(formData)
      setFormData(EMPTY_FORM)
      await loadAll()
      toast.success('Reserva creada correctamente')
    } catch {
      const message = 'No se pudo crear la reserva.'
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('¿Deseas eliminar esta reserva?')) return
    setError('')
    try {
      await deleteReserva(id)
      await loadAll()
      toast.success('Reserva eliminada correctamente')
    } catch {
      const message = 'No se pudo eliminar la reserva.'
      setError(message)
      toast.error(message)
    }
  }

  return (
    <section className="management-page reservas-page">
      <header className="management-page__header">
        <h1 className="management-page__title">Reservas</h1>
        <p className="management-page__subtitle">Programa reservas de auditorios para conferencias.</p>
      </header>

      {error && <div className="management-page__error">{error}</div>}

      <section className="management-page__panel">
        <h2 className="management-page__panel-title">Nueva reserva</h2>

        <form className="management-page__form" onSubmit={handleSubmit}>
          <div className="management-page__grid">
            <div className="management-page__field">
              <label htmlFor="conferencistaId">Conferencista *</label>
              <select id="conferencistaId" name="conferencistaId" value={formData.conferencistaId} onChange={handleChange} required>
                <option value={0}>Selecciona un conferencista</option>
                {conferencistas.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre} {item.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="management-page__field">
              <label htmlFor="auditorioId">Auditorio *</label>
              <select id="auditorioId" name="auditorioId" value={formData.auditorioId} onChange={handleChange} required>
                <option value={0}>Selecciona un auditorio</option>
                {auditorios.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre} (Capacidad: {item.capacidad})
                  </option>
                ))}
              </select>
            </div>

            <div className="management-page__field">
              <label htmlFor="fecha">Fecha y hora *</label>
              <input id="fecha" name="fecha" type="datetime-local" value={formData.fecha} onChange={handleChange} required />
            </div>

            <div className="management-page__field management-page__field--full">
              <label htmlFor="tema">Tema</label>
              <input id="tema" name="tema" value={formData.tema ?? ''} onChange={handleChange} placeholder="Tema de la conferencia" />
            </div>
          </div>

          <div className="management-page__actions">
            <button className="management-page__btn management-page__btn--primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Guardando...' : 'Guardar reserva'}
            </button>
          </div>
        </form>
      </section>

      <section className="management-page__panel">
        <h2 className="management-page__panel-title">Listado ({reservas.length})</h2>

        {reservas.length === 0 ? (
          <p className="management-page__empty">No hay reservas registradas.</p>
        ) : (
          <div className="management-page__table-wrap">
            <table className="management-page__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Conferencista</th>
                  <th>Auditorio</th>
                  <th>Fecha</th>
                  <th>Tema</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>{item.conferencista.nombre} {item.conferencista.apellido}</td>
                    <td>{item.auditorio.nombre}</td>
                    <td>{new Date(item.fecha).toLocaleString('es-EC')}</td>
                    <td>{item.tema ?? '—'}</td>
                    <td>
                      <button className="management-page__btn management-page__btn--danger" type="button" onClick={() => handleDelete(item.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  )
}