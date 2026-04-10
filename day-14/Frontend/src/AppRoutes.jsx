import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginForm from './features/auth/pages/LoginForm';
import RegisterForm from './features/auth/pages/RegisterForm';
import Feed from './features/post/pages/Feed';
import CreatePost from './features/post/pages/CreatePost';
import Profile from './features/follow/pages/Profile';
function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LoginForm/>}/>
                <Route path='/register' element={<RegisterForm/>}/>
                <Route path='/' element={<Feed/>}/>
                <Route path='/create-post' element={<CreatePost/>}/>
                <Route path='/profile' element={<Profile/>}/>
            </Routes>
        </BrowserRouter>
    )

}
export default AppRoutes;