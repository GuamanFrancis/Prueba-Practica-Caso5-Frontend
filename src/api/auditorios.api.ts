import client from './client'
import type { ApiResponse } from '../types/api'
import type { Auditorio } from '../types/entities'

export interface CreateAuditorioDto {
  nombre: string
  capacidad: number
  ubicacion?: string
}

export async function getAuditorios(): Promise<Auditorio[]> {
  const res = await client.get<ApiResponse<Auditorio[]>>('/auditorios')
  return res.data.data
}

export async function createAuditorio(payload: CreateAuditorioDto): Promise<Auditorio> {
  const res = await client.post<ApiResponse<Auditorio>>('/auditorios', payload)
  return res.data.data
}

export async function updateAuditorio(id: number, payload: CreateAuditorioDto): Promise<Auditorio> {
  const res = await client.put<ApiResponse<Auditorio>>(`/auditorios/${id}`, payload)
  return res.data.data
}

export async function deleteAuditorio(id: number): Promise<void> {
  await client.delete(`/auditorios/${id}`)
}
