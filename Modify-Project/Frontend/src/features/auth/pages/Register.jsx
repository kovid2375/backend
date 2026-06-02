import React from 'react'
import { Link } from 'react-router-dom'

export const Register = () => {
  return (
    <main className='flex justify-center items-center min-h-screen'>
        <div>
            <h1 className=''>Register</h1>
            <form className='flex flex-col gap-4 p-8 rounded-lg border-dashed'>
                <div className='flex flex-col gap-2'>
                    <label>
                    Full Name
                </label>
                <input className='p-1 border-2 rounded-lg' type="text" name="fullName" />
                </div>
                <div className='flex flex-col gap-2'>
                    <label>
                    Email
                </label>
                <input className='p-1 border-2 rounded-lg' type="email" name="email" />
                </div>
                <div className='flex flex-col gap-2'>
                    <label>
                    Password
                </label>
                <input className='p-1 border-2 rounded-lg' type="password" name="password" />
                    
                </div>
                <button type="submit" className='p-2 bg-blue-500 text-white rounded-lg'>
                    sign up
                </button> 
                <p className='text-sm'>Already have an account? <Link to="/login" className='text-blue-500'>Login</Link></p>
            </form>
        </div>
    </main>
  )
}

