import client from './client'
import type { ApiResponse } from '../types/api'
import type { Reserva } from '../types/entities'

export interface CreateReservaDto {
  conferencistaId: number
  auditorioId: number
  fecha: string
  tema?: string
}

export async function getReservas(): Promise<Reserva[]> {
  const res = await client.get<ApiResponse<Reserva[]>>('/reservas')
  return res.data.data
}

export async function createReserva(payload: CreateReservaDto): Promise<Reserva> {
  const res = await client.post<ApiResponse<Reserva>>('/reservas', payload)
  return res.data.data
}

export async function deleteReserva(id: number): Promise<void> {
  await client.delete(`/reservas/${id}`)
}
