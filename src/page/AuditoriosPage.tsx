import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import type { Auditorio } from '../types/entities'
import {
  createAuditorio,
  deleteAuditorio,
  getAuditorios,
  type CreateAuditorioDto,
  updateAuditorio,
} from '../api/auditorios.api'
import '../styles/AuditoriosPage.css'

const EMPTY_FORM: CreateAuditorioDto = {
  nombre: '',
  capacidad: 0,
  ubicacion: '',
}

export function AuditoriosPage() {
  const [auditorios, setAuditorios] = useState<Auditorio[]>([])
  const [formData, setFormData] = useState<CreateAuditorioDto>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void loadAuditorios()
  }, [])

  async function loadAuditorios() {
    try {
      const data = await getAuditorios()
      setAuditorios(data)
    } catch {
      const message = 'No se pudo cargar la lista de auditorios.'
      setError(message)
      toast.error(message)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacidad' ? Number(value) : value,
    }))
  }

  function handleCancel() {
    setFormData(EMPTY_FORM)
    setEditingId(null)
  }

  function handleEdit(item: Auditorio) {
    setFormData({
      nombre: item.nombre,
      capacidad: item.capacidad,
      ubicacion: item.ubicacion ?? '',
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
        await updateAuditorio(editingId, formData)
        toast.success('Auditorio actualizado correctamente')
      } else {
        await createAuditorio(formData)
        toast.success('Auditorio creado correctamente')
      }
      handleCancel()
      await loadAuditorios()
    } catch {
      const message = 'No se pudo guardar el auditorio. Revisa los datos.'
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('¿Deseas eliminar este auditorio?')) return
    setError('')
    try {
      await deleteAuditorio(id)
      await loadAuditorios()
      toast.success('Auditorio eliminado correctamente')
    } catch {
      const message = 'No se pudo eliminar el auditorio.'
      setError(message)
      toast.error(message)
    }
  }

  return (
    <section className="management-page auditorios-page">
      <header className="management-page__header">
        <h1 className="management-page__title">Auditorios</h1>
        <p className="management-page__subtitle">Administra auditorios disponibles para reservas.</p>
      </header>

      {error && <div className="management-page__error">{error}</div>}

      <section className="management-page__panel">
        <h2 className="management-page__panel-title">
          {editingId !== null ? 'Editar auditorio' : 'Nuevo auditorio'}
        </h2>

        <form className="management-page__form" onSubmit={handleSubmit}>
          <div className="management-page__grid">
            <div className="management-page__field">
              <label htmlFor="nombre">Nombre *</label>
              <input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>

            <div className="management-page__field">
              <label htmlFor="capacidad">Capacidad *</label>
              <input
                id="capacidad"
                name="capacidad"
                type="number"
                min={1}
                value={formData.capacidad}
                onChange={handleChange}
                required
              />
            </div>

            <div className="management-page__field management-page__field--full">
              <label htmlFor="ubicacion">Ubicación</label>
              <input id="ubicacion" name="ubicacion" value={formData.ubicacion ?? ''} onChange={handleChange} />
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
        <h2 className="management-page__panel-title">Listado ({auditorios.length})</h2>

        {auditorios.length === 0 ? (
          <p className="management-page__empty">No hay auditorios registrados.</p>
        ) : (
          <div className="management-page__table-wrap">
            <table className="management-page__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Capacidad</th>
                  <th>Ubicación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {auditorios.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>{item.nombre}</td>
                    <td>{item.capacidad}</td>
                    <td>{item.ubicacion ?? '—'}</td>
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