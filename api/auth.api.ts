


import type { ApiResponse } from "../types/api";
import type { loginResponse} from "../types/entities";
import cliente from "./client";


export const loginApi = async (email:string,clave:string):Promise <loginResponse> => {
    const res = await cliente.post<ApiResponse<loginResponse>>("/auth/login", { email, clave });
    return res.data.data;
  
}

export const logoutApi = async ():Promise<void> => {
    await cliente.post("/auth/logout");
}