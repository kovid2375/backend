import React from 'react'
import { useNavigate } from 'react-router-dom'
const Nav = () => {

    const navigate=useNavigate()

  return (
    <nav className='flex justify-between  w-full px-4 py-2 '>
        <p>Insta</p>
        <button onClick={()=>{navigate('/create-post')}} className='bg-amber-700 rounded-xl p-2 active:scale-95'>New Post</button>
    </nav>
  )
}

export default Nav
