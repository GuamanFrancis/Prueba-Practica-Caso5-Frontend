import { useEffect, useState } from 'react'
import type { Conferencista } from '../types/entities'
import {
  createConferencista,
  deleteConferencista,
  getConferencistas,
  type CreateConferencistaDto,
  updateConferencista,
} from '../api/conferencias.api'
import '../styles/ConferenciasPage.css'

const EMPTY_FORM: CreateConferencistaDto = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  especialidad: '',
}

export function ConferenciasPage() {
  const [conferencistas, setConferencistas] = useState<Conferencista[]>([])
  const [formData, setFormData] = useState<CreateConferencistaDto>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void loadConferencistas()
  }, [])

  async function loadConferencistas() {
    try {
      const data = await getConferencistas()
      setConferencistas(data)
    } catch {
      setError('No se pudo cargar la lista de conferencistas.')
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleCancel() {
    setFormData(EMPTY_FORM)
    setEditingId(null)
  }

  function handleEdit(item: Conferencista) {
    setFormData({
      nombre: String(item.nombre),
      apellido: String(item.apellido),
      email: item.email ? String(item.email) : '',
      telefono: item.telefono ? String(item.telefono) : '',
      especialidad: item.especialidad ? String(item.especialidad) : '',
    })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (editingId !== null) {
        await updateConferencista(editingId, formData)
      } else {
        await createConferencista(formData)
      }
      handleCancel()
      await loadConferencistas()
    } catch {
      setError('No se pudo guardar el conferencista. Revisa los datos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('¿Deseas eliminar este conferencista?')) return
    setError('')
    try {
      await deleteConferencista(id)
      await loadConferencistas()
    } catch {
      setError('No se pudo eliminar el conferencista.')
    }
  }

  return (
    <section className="management-page conferencias-page">
      <header className="management-page__header">
        <h1 className="management-page__title">Conferencias</h1>
        <p className="management-page__subtitle">Administra conferencistas del sistema.</p>
      </header>

      {error && <div className="management-page__error">{error}</div>}

      <section className="management-page__panel">
        <h2 className="management-page__panel-title">
          {editingId !== null ? 'Editar conferencista' : 'Nuevo conferencista'}
        </h2>

        <form className="management-page__form" onSubmit={handleSubmit}>
          <div className="management-page__grid">
            <div className="management-page__field">
              <label htmlFor="nombre">Nombre *</label>
              <input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>

            <div className="management-page__field">
              <label htmlFor="apellido">Apellido *</label>
              <input id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
            </div>

            <div className="management-page__field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={formData.email ?? ''} onChange={handleChange} />
            </div>

            <div className="management-page__field">
              <label htmlFor="telefono">Teléfono</label>
              <input id="telefono" name="telefono" value={formData.telefono ?? ''} onChange={handleChange} />
            </div>

            <div className="management-page__field management-page__field--full">
              <label htmlFor="especialidad">Especialidad</label>
              <input id="especialidad" name="especialidad" value={formData.especialidad ?? ''} onChange={handleChange} />
            </div>
          </div>

          <div className="management-page__actions">
            <button className="management-page__btn management-page__btn--primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Guardando...' : editingId !== null ? 'Actualizar' : 'Guardar'}
            </button>
            {editingId !== null && (
              <button className="management-page__btn management-page__btn--neutral" type="button" onClick={handleCancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="management-page__panel">
        <h2 className="management-page__panel-title">Listado ({conferencistas.length})</h2>

        {conferencistas.length === 0 ? (
          <p className="management-page__empty">No hay conferencistas registrados.</p>
        ) : (
          <div className="management-page__table-wrap">
            <table className="management-page__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Especialidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {conferencistas.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>{item.nombre} {item.apellido}</td>
                    <td>{item.email ?? '—'}</td>
                    <td>{item.telefono ?? '—'}</td>
                    <td>{item.especialidad ?? '—'}</td>
                    <td>
                      <div className="management-page__actions management-page__actions--compact">
                        <button className="management-page__btn management-page__btn--neutral" type="button" onClick={() => handleEdit(item)}>
                          Editar
                        </button>
                        <button className="management-page__btn management-page__btn--danger" type="button" onClick={() => handleDelete(item.id)}>
                          Eliminar
                        </button>
                      </div>
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