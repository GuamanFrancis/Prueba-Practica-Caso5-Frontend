import { Children, createContext, useEffect, useState } from "react";
import type { AuthContextType } from "../types/authContextype";
import type { User } from "../types/entities";
import { getToken, removeToken, saveToken } from "../utils/storage";
import client from "../api/client";





export const AuthContext = createContext<AuthContextType | null>(null)


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        const storedToken = getToken()
        if (!storedToken) {
            setIsLoading(false)
            return
        }

        client.get('/auth/me')
            .then((res) => {
                setUser(res.data.data.user)
                setToken(storedToken)
            })
            .catch(() => {
                removeToken();
                setUser(null)
                setToken(null)


            })
            .finally(() => { setIsLoading(false) })





    }, [])


    function login(newToken: string, NewUser: User) {
        saveToken(newToken)
        setToken(newToken)
        setUser(NewUser)



    }


    function logout() {
        removeToken()
        setUser(null)
        setToken(null)







    }


    return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )



}




