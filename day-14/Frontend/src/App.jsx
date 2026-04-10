
import React from 'react'
import { RouterProvider } from 'react-router-dom'

import AppRoutes from './AppRoutes'
import { AuthProvider } from './features/auth/auth.context.jsx'
import { PostContextProvider } from './features/post/post.context.jsx'
import { FollowContextProvider } from './features/follow/follow.context.jsx'

const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>
        <FollowContextProvider>
          <AppRoutes/>
        </FollowContextProvider>
      </PostContextProvider>
    </AuthProvider>
    
  )
}

export default App
