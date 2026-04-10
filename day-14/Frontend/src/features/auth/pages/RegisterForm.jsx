import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { use } from 'react'
import { useNavigate } from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'

const RegisterForm = () => {


    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()


    const {loading,handleRegister} = useAuth()


    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister(username,email,password)
        navigate('/')

        
    }

    if(loading){
        return <h1 className='min-h-screen w-full flex items-center justify-center'>Loading...</h1>
    }


  return (
    <>
     <nav className='m-3'>
        <button className='bg-amber-700 rounded-xl p-2 active:scale-95' onClick={()=>{navigate('/')}}>HomePage</button>
      </nav>
    
    <main className='min-h-screen w-full flex items-center justify-center '>
        <div className='h-fit min-w-100 flex flex-col gap-8 '>
            <h1 className='font-bold text-3xl'>Register Form</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input onInput={(e) => setUsername(e.target.value)} className='border-2 outline-0 px-6 py-4 rounded-2xl' type="text" name='username' placeholder='Enter Username'/>
                <input onInput={(e) => setEmail(e.target.value)} className='border-2 outline-0 px-6 py-4 rounded-2xl' type="email" name='email' placeholder='Enter Email'/>
                <input onInput={(e) => setPassword(e.target.value)} className='border-2 outline-0 px-6 py-4 rounded-2xl' type="password" name='password' placeholder='Enter Password'/>
                <button className=' outline-0 px-6 py-4 rounded-2xl bg-red-500 text-white cursor-pointer active:scale-95' type='submit'>Register</button>
            </form>
            <p >Already have an account? <Link className='text-blue-400' to='/login'>Login</Link></p>
        </div>
    </main>
    </>
  )
}

export default RegisterForm
