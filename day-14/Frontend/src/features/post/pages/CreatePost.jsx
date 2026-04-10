import React, { useRef, useState } from 'react'
import { usePost } from '../hooks/usePost'

import { useNavigate } from 'react-router-dom'

const CreatePost = () => {

  const [caption, setCaption] = useState("")
  const postImageInputFieldRef=useRef(null)

  const {loading,handelCreatePost}=usePost()

  const navigate= useNavigate()


   async function handleSubmit(e){
    e.preventDefault()

    const file= postImageInputFieldRef.current.files[0]

     await handelCreatePost(file,caption)

     navigate("/")

    

  }
  if(loading){
    return (
      <main className='min-h-screen w-full flex items-center justify-center'>
        <h1>Loading...</h1>
      </main>
    )
  }

  return (
    <>
    <nav className='m-3'>
        <button className='bg-amber-700 rounded-xl p-2 active:scale-95' onClick={()=>{navigate('/')}}>HomePage</button>
      </nav>
    <main className='min-h-screen w-full flex items-center justify-center'>
      
      <div className=' h-fit min-w-100 flex flex-col gap-8'>
        <h1 className=' font-bold text-3xl'>Create Post</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <label className='bg-amber-50 text-black px-4 py-2 rounded-lg' htmlFor="postImage">Select Image</label>
          <input ref={postImageInputFieldRef}
           hidden type="file" name='postImage' id='postImage' />
          <input value={caption} onChange={(e)=>{setCaption(e.target.value)}} className='border-2 outline-0 px-6 py-4 rounded-2xl' type="text" name='caption' placeholder='enter caption' />
          <button className=' outline-0 px-6 py-4 rounded-2xl bg-red-500 text-white cursor-pointer active:scale-95'>Create</button>
        </form>
      </div>
    </main>
    </>
  )
}

export default CreatePost
