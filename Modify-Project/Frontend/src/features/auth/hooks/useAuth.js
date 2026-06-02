import{login,register,getMe,logout} from "../services/auth.api"
import { createContext, useContext, useEffect, useState } from "react"
import { AuthContext } from "../auth.context"
export const useAuth=()=>{
    const cosntext= useContext(AuthContext)
    const {user,setUser,loading,setLoading} = cosntext
    async function registerHandler({email,password,username}){
        setLoading(true)
        const data=await register({username,email,password})
        setUser(data.user)
        setLoading(false)
    }
    async function loginHandler({email,password,username}){
        setLoading(true)
        const data=await login({username,email,password})
        setUser(data.user)
        setLoading(false)
    }
    async function getMeHandler(){
        setLoading(true)
        const data=await getMe()
        setUser(data.user)
        setLoading(false)
    }
    async function logoutHandler(){
        setLoading(true)
        const data=await logout()
        setUser(null)
        setLoading(false)
    }
    

    return({
        user,loading,loginHandler,registerHandler,getMeHandler,logoutHandler
    })
}