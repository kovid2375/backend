import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const Register = () => {
  const { registerHandler, loading } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const normalizedUsername = fullName.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const trimmedPassword = password

    if (!normalizedUsername || !normalizedEmail || !trimmedPassword) {
      setError('Full name, email, and password are required.')
      return
    }

    try {
      await registerHandler({ username: normalizedUsername, email: normalizedEmail, password: trimmedPassword })
      navigate('/')
    } catch (err) {
      console.error('Register failed:', err)
      setError(err?.response?.data?.message || err.message || 'Registration failed')
    }
  }

  return (
    <main className='flex justify-center items-center min-h-screen'>
      <div>
        <h1 className=''>Register</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-8 rounded-lg border-dashed'>
          <div className='flex flex-col gap-2'>
            <label>Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='p-1 border-2 rounded-lg'
              type='text'
              name='fullName'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='p-1 border-2 rounded-lg'
              type='email'
              name='email'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='p-1 border-2 rounded-lg'
              type='password'
              name='password'
            />
          </div>
          <button type='submit' disabled={loading} className='p-2 bg-blue-500 text-white rounded-lg'>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
          {error && <p className='text-sm text-red-600'>{error}</p>}
          <p className='text-sm'>Already have an account? <Link to='/login' className='text-blue-500'>Login</Link></p>
        </form>
      </div>
    </main>
  )
}

