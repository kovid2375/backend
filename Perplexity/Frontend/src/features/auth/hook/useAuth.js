import { useDispatch } from "react-redux";

import { register,login,getMe,logout } from "../service/auth.api";

import { setUser,setLoading,setError } from "../auth.slice";




export function useAuth(){
    const dispatch=useDispatch()

    async function handleRegister(email,username,password) {
        try{
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await register({email,username,password})
            return true
        }catch(error){
            dispatch(setError(error.response?.data?.message || "register failed"))
            return false
        }finally{
            dispatch(setLoading(false))
        }

    }
    async function handleLogin({email,password}) {
        try{
            dispatch(setLoading(true))
            const data = await login({email,password})
            dispatch(setUser(data.user))

        }
        catch(error){
            dispatch(setError(error.response?.data?.message || "login failed"))
        }finally{
            dispatch(setLoading(false))
        }
    }
    async function handleGetMe(){
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setUser(null))
            dispatch(setError(error.response?.data?.message || "Failed to fetch user details"))

        }finally{
            dispatch(setLoading(false))
        }
    }

    async function handleLogout() {
        try {
            dispatch(setLoading(true))
            await logout()
            dispatch(setUser(null))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Logout failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }


    return {
        handleGetMe,
        handleRegister,
        handleLogin,
        handleLogout
    }
}


