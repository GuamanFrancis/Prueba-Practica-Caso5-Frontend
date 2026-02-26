import type { User } from "./entities";


export interface AuthContextType {
    token: string | null;
    user: User | null;
    isLoading : boolean;
    login:(email: string, user: User) =>void;
    logout:() => void;
}