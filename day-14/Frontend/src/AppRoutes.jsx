import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginForm from './features/auth/pages/LoginForm';
import RegisterForm from './features/auth/pages/RegisterForm';

function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LoginForm/>}/>
                <Route path='/register' element={<RegisterForm/>}/>
            </Routes>
        </BrowserRouter>
    )

}
export default AppRoutes;