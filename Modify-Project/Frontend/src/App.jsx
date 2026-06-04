
import './features/shared/global.css'
import FaceExpression from './features/Expression/Components/FaceExpression'
import { router } from '../app.routes.jsx'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './features/auth/auth.context.jsx'
import Home from './features/home/pages/Home.jsx'
import { SongContextProvider } from './features/home/song.context.jsx'
function App() {
  

  return (
    <AuthProvider>
      <SongContextProvider>
        <RouterProvider router={router} />
      </SongContextProvider>
      
      
    </AuthProvider>
  )
}

export default App
