import{createBrowserRouter} from 'react-router-dom'
import {Login} from './src/features/auth/pages/login'
import {Register} from './src/features/auth/pages/Register'
import {Protected} from './src/features/auth/components/Protected'
import Home from './src/features/home/pages/Home'
export const router = createBrowserRouter([
    {
        path:'/',
        element:<Protected><Home/></Protected>
    },
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/register',
        element:<Register/>
    }
])


