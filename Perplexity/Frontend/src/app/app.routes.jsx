import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import App from "./App";


export const router=createBrowserRouter([
    {
        path:"/",
        element:<App/>
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