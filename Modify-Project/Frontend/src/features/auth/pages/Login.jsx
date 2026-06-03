
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export const Login = () => {

    const { loading, loginHandler } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const [error, setError] = useState("")

    async function handleSubmit(e){
        e.preventDefault()
        setError("")
        const normalizedEmail = email.trim().toLowerCase()
        const trimmedPassword = password
        if (!normalizedEmail || !trimmedPassword) {
            setError("Email and password are required.")
            return
        }

        try {
            await loginHandler({ email: normalizedEmail, password: trimmedPassword })
            navigate("/")
        } catch (err) {
            console.error('Login failed:', err)
            setError(err?.response?.data?.message || err.message || 'Login failed')
        }
    }
  return (
    <main className='flex justify-center items-center min-h-screen'>
        <div>
            <h1 className=''>login</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-8 rounded-lg border-dashed'>
                <div className='flex flex-col gap-2'>
                    <label>
                    Email
                </label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} className='p-1 border-2 rounded-lg' type="email" name="email" />
                </div>
                <div className='flex flex-col gap-2'>
                    <label>
                    Password
                </label>
                <input value={password} onChange={(e)=>setPassword(e.target.value)} className='p-1 border-2 rounded-lg' type="password" name="password" />
                    
                </div>
                <button type="submit" className='p-2 bg-blue-500 text-white rounded-lg'>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className='text-sm text-red-600'>{error}</p>}
                <p className='text-sm'>Don't have an account? <Link to="/register" className='text-blue-500'>Register</Link></p>
                
            </form>
        </div>
    </main>
  )
}


