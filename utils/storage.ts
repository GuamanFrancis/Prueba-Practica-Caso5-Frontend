



const TOKEN_KEY = 'auth_token';


export function saveToken(token: string  ): void {

    localStorage.setItem(TOKEN_KEY, token); 
    

}


export function getToken():string | null  {

    return localStorage.getItemItem(TOKEN_KEY);
    

}

export function removeToken(): void {

    localStorage.removeItem(TOKEN_KEY)
    

}

