import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

function PublicRoute() {

    const { token, isLoading } = useAuth();

    if (isLoading) {
        return <div>Cargando...</div>
    }



    return token ? <Navigate to="/" replace /> : <Outlet />


}


export default PublicRoute;