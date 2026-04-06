// state layer in react 



import { createContext,useState,useEffect } from "react";
import { login,register,getme } from "./services/auth.api.jsx";
export const AuthContext = createContext()

export function AuthProvider({children}){
    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(false)


    const handleLogin=async(username,password)=>{

        setLoading(true)
        try {
            const res=await login(username,password)
            setUser(res.user)
        } catch (error) {
            console.log(error);
            
        }
        finally{
            setLoading(false)
        }
    
    }

    const handleRegister=async(username,email,password)=>{

        setLoading(true)
        try {
            const res=await register(username,email,password)
            setUser(res.user)
        } catch (error) {
            console.log(error);
            
        }
        finally{
            setLoading(false)
        }
    
    }

    return(
        <AuthContext.Provider value={{user,loading,handleLogin,handleRegister}}>
            {children}
        </AuthContext.Provider>
    )

}