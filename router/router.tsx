import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth";


function PrivateRoute() {

const {token,isLoading } = useAuth();

if (isLoading) {
    return <div>Cargando...</div>
}



return token ? <Outlet /> : <Navigate to="/login" />


}


export default PrivateRoute;