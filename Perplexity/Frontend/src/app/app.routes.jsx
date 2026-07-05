import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import App from "./App";
import Protected from "../features/auth/components/Protected";
import Dasboard from "../features/chat/pages/Dasboard";


export const router=createBrowserRouter([
    {
        path:"/",
        element: <Protected><Dasboard/></Protected>
    },
    {
        path:"/login",
        element: <Login/>
    },
    {
        path:"/register",
        element:<Register/>
    }
])