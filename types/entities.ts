

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