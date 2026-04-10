import React from 'react'
import { useNavigate } from 'react-router-dom'

import { RiInstagramLine } from '@remixicon/react'

const Nav = () => {

    const navigate=useNavigate()

  return (
    <nav className='flex gap-4  w-full px-4 py-2 '>
        <p className='font-bold text-2xl'><RiInstagramLine />Insta</p>
        <button className='bg-amber-700 rounded-xl p-2 active:scale-95'  onClick={()=>{navigate('/login')}}>Login</button>
        <button className='bg-amber-700 rounded-xl p-2 active:scale-95' onClick={()=>{navigate('/register')}}>register</button>
        <button onClick={()=>{navigate('/create-post')}} className='bg-amber-700 rounded-xl p-2 active:scale-95 ml-[70%]'>New Post</button>
        <button onClick={()=>{navigate('/profile')}} className='bg-amber-700 rounded-xl p-2 active:scale-95'>My-Profile</button>
    </nav>
  )
}

export default Nav
