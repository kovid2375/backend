import{createBrowserRouter} from 'react-router-dom'
import {Login} from './src/features/auth/pages/login'
import {Register} from './src/features/auth/pages/Register'
import {Protected} from './src/features/auth/components/Protected'
export const router = createBrowserRouter([
    {
        path:'/',
        element:<Protected><h1>Home</h1></Protected>
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


