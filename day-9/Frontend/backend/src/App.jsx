import React, { useState } from 'react'
import axios from 'axios'


const App = () => {
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

axios.get('http://localhost:3000/api/notes').then((res)=>{
  setNotes(res.data.notes)
  
})




  return (
    <div className='bg-[#222] h-screen text-white font-mono p-4'>
      { notes.map(note=>{
        return <div className='bg-[#494949] p-4 rounded-xl max-w-2xs text-white mt-5'>
        <h1 className='text-2xl'>{note.title}</h1>
        <p className='text-sm'>{note.discription}</p>
      </div>
      })}
    </div>
  )
}

export default App