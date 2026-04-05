import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const LoginForm = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function handleSubmit(e){
        e.preventDefault()

        axios.post("http://localhost:3000/auth/login",{
            username,
            password
        },{
            withCredentials: true
        }).then((res) => {
            console.log(res.data)
        })
    }

  return (
    <main className='min-h-screen w-full flex items-center justify-center '>
        <div className='h-fit min-w-100 flex flex-col gap-8 '>
            <h1 className='font-bold text-3xl'>Login</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input 
                    className='border-2 outline-0 px-6 py-4 rounded-2xl' 
                    type="text" 
                    name='username' 
                    placeholder='Enter Username'
                    
                    onInput={(e) => setUsername(e.target.value)}
                />
                <input 
                    className='border-2 outline-0 px-6 py-4 rounded-2xl' 
                    type="password" 
                    name='password' 
                    placeholder='Enter Password'
                    
                    onInput={(e) => setPassword(e.target.value)}
                />
                <button className=' outline-0 px-6 py-4 rounded-2xl bg-red-500 text-white cursor-pointer active:scale-95' type='submit'>Login</button>
            </form>
            <p>Don't have an account? <Link className='text-blue-400' to='/register'>Register</Link></p>
        </div>
    </main>
  )
}

export default LoginForm
