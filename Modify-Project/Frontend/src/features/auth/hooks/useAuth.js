import { login, register, getMe, logout } from "../services/auth.api"
import { useContext,useEffect } from "react"
import { AuthContext } from "../auth.context"
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }
    const { user, setUser, loading, setLoading } = context

    async function registerHandler({ email, password, username }) {
        try {
            setLoading(true)
            const data = await register({ username, email, password })
            setUser(data.user)
            return data
        } finally {
            setLoading(false)
        }
    }

    async function loginHandler({ email, password, username }) {
        try {
            setLoading(true)
            const data = await login({ username, email, password })
            setUser(data.user)
            return data
        } finally {
            setLoading(false)
        }
    }

    async function getMeHandler() {
        try {
            setLoading(true)
            const data = await getMe()
            setUser(data.user)
            return data
        } finally {
            setLoading(false)
        }
    }

    async function logoutHandler() {
        try {
            setLoading(true)
            await logout()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }
    useEffect(()=>{
        getMeHandler()
    },[])

    return {
        user,
        loading,
        loginHandler,
        registerHandler,
        getMeHandler,
        logoutHandler,
    }
}