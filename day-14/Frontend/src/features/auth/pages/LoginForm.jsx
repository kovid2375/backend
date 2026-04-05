import React from 'react'

const LoginForm = () => {
  return (
    <main className='min-h-screen w-full flex items-center justify-center '>
        <div className='h-fit min-w-100 flex flex-col gap-8 '>
            <h1 className='font-bold text-3xl'>Login</h1>
            <form className='flex flex-col gap-4'>
                <input className='border-2 outline-0 px-6 py-4 rounded-2xl' type="text" name='username' placeholder='Enter Username'/>
                <input className='border-2 outline-0 px-6 py-4 rounded-2xl' type="password" name='password' placeholder='Enter Password'/>
                <button className=' outline-0 px-6 py-4 rounded-2xl bg-red-500 text-white cursor-pointer active:scale-95' type='submit'>Login</button>
            </form>
        </div>
    </main>
  )
}

export default LoginForm
