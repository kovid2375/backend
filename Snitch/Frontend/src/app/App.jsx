import { useState } from 'react'
import './App.css'
import { Route, RouterProvider } from 'react-router-dom'
import { routes } from './app.routes'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth.js'
import { useEffect } from 'react'

function App() {

  const {handleGetMe}=useAuth()
  const user = useSelector((state)=>state.auth.user)
  

  useEffect(() => {
    handleGetMe()
  }, [])
  

  return (
    <>
      <RouterProvider router={routes}/>
    </>
  )
}

export default App
