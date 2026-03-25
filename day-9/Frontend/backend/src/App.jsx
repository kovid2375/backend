import React, {  useEffect, useState } from 'react'
import axios from 'axios'


const App = () => {
  console.log("hello");
  
const [notes, setNotes] = useState([
  {
    title: "test title 1",
    discription: " discription 1"
  },
  {
    title: "test title 2",
    discription: " discription 2"
  },
  {
    title: "test title 3",
    discription: " discription 3"
  },
  {
    title: "test title 4",
    discription: " discription 4"
  }
])

function fetchNotes(){
  axios.get('http://localhost:3000/api/notes').then((res)=>{
  setNotes(res.data.notes)
  })
}

useEffect(()=>{
  fetchNotes()
},[])

function handleSubmit(e){
  e.preventDefault()
  const {title,discription}= e.target.elements
  console.log(title.value,discription.value);

  axios.post('http://localhost:3000/api/notes',{
    title:title.value,
    discription:discription.value
  }).then(res=>{
    console.log(res.data);
    fetchNotes()
  })
}

function handleDeleteNote(noteId){
  console.log(noteId);
  axios.delete("http://localhost:3000/api/notes/"+noteId).then(res=>{
    console.log(res.data);

    fetchNotes()
    
  })
  
}


  return (
    <div className='bg-[#222] h-screen text-white font-mono p-4'>
    
    <form onSubmit={handleSubmit} className='flex gap-4 px-12 py-4 border-2 border-amber-100'>
      <input className='border border-amber-100 p-2 text-amber-200 rounded-2xl ' name='title' type="text" placeholder='Enter title' />
      <input className='border border-amber-100 p-2 text-amber-200 rounded-2xl ' name='discription' type="text" placeholder='Enter disciption' />
      <button className='border p-3 border-amber-100 rounded-2xl text-black font-extrabold bg-amber-100 active:scale-95'>Create Note</button>
    </form>


      { notes.map(note=>{
        return <div className='bg-[#494949] p-4 rounded-xl max-w-2xs text-white mt-5'>
        <h1 className='text-2xl'>{note.title}</h1>
        <p className='text-sm'>{note.discription}</p>
        <button onClick={()=>{handleDeleteNote(note._id)}} className='bg-red-700 text-amber-50 px-2 py-1 rounded-xl mt-1 active:scale-95'>Delete</button>
      </div>
      })}
    </div>
  )
}

export default App