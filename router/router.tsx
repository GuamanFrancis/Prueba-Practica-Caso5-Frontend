
import { createBrowserRouter } from 'react-router-dom'
import PrivateRoute from './PrivateRouter'

import PublicRoute from './PublicRouter'

import DashboardPage from '../page/DashboardPage'
import NotFoundPage from '../page/NotFoundPage'
import { LoginPage } from '../page/LoginPage'
import { AppLayout } from '../page/AppLayout'
import { ConferenciasPage } from '../page/ConferenciasPage'
import { AuditoriosPage } from '../page/AuditoriosPage'
import { ReservasPage } from '../page/Reservas'




const router = createBrowserRouter([

  {
    element: <PublicRoute/>,              
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },


  {
    element: <PrivateRoute />,
    children: [{
      element: <AppLayout />,        
      children: [
        { path: '/', element: <DashboardPage /> },
        { path: '/conferencias', element: <ConferenciasPage /> },
        { path: '/auditorios', element: <AuditoriosPage /> },
        { path: '/reservas', element: <ReservasPage /> },
      ],
    }],
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router