import client from './client'
import type { ApiResponse } from '../types/api'
import type { Conferencista } from '../types/entities'

export interface CreateConferencistaDto {
  nombre: string
  apellido: string
  email?: string
  telefono?: string
  especialidad?: string
}

export async function getConferencistas(): Promise<Conferencista[]> {
  const res = await client.get<ApiResponse<Conferencista[]>>('/conferencistas')
  return res.data.data
}

export async function createConferencista(payload: CreateConferencistaDto): Promise<Conferencista> {
  const res = await client.post<ApiResponse<Conferencista>>('/conferencistas', payload)
  return res.data.data
}

export async function updateConferencista(id: number, payload: CreateConferencistaDto): Promise<Conferencista> {
  const res = await client.put<ApiResponse<Conferencista>>(`/conferencistas/${id}`, payload)
  return res.data.data
}

export async function deleteConferencista(id: number): Promise<void> {
  await client.delete(`/conferencistas/${id}`)
}

//CRUD /api/conferencistas | /api/auditorios | /api/reservas