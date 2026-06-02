
import './features/shared/global.css'
import FaceExpression from './features/Expression/Components/FaceExpression'
import { router } from '../app.routes.jsx'
import { RouterProvider } from 'react-router-dom'
function App() {
  

  return (
    <RouterProvider router={router} />
  )
}

export default App
