

export interface loginResponse {
    token:string;
    user: User
}


export interface User {
    id: number
    nombre: string
    apellido: string
    email: string

}

export interface Conferencista {
  id: number       
  nombre: string
  apellido: string
  email: string | null
  telefono: string | null
  especialidad: string | null
  createdAt:   string 
  updatedAt:   string  
  
}

export interface Auditorio {
  id: number       
  nombre: string
  capacidad: number
  ubicacion: string | null
  createdAt: string 
  updatedAt: string

}


export interface  Reserva {
  id: number         
  conferencistaId: number
  auditorioId: number
  fecha: string
  tema: string | null
  conferencista: Conferencista 
  auditorio: Auditorio     
  createdAt: string      
  updatedAt: string      

}



 
 




