import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import App from './App'
import Signup from './auth-components/Signup'
import Signin from './auth-components/Signin'
import Activate from './auth-components/Activate'
import Private from './core/Private'
import PrivateRoute from './auth-components/PrivateRoute'
import Admin from './core/Admin'
import AdminRoute from './auth-components/AdminRoute'
import ForgotPassword from './auth-components/ForgotPassword'
import ResetPassword from './auth-components/ResetPassword'
const MyRoutes = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" exact Component={App}/>
                <Route path="/signin" exact element={<Signin/>}/>
                <Route path="/signup" exact element={<Signup/>}/>
                <Route path="/auth/activate/:token" exact element={<Activate/>}/>
                <Route path="/private" element={<PrivateRoute><Private/></PrivateRoute>} />
                <Route path="/admin" element={<AdminRoute><Admin/></AdminRoute>} />
                <Route path="/auth/password/forgot" exact element={<ForgotPassword/>}/>
                <Route path="/auth/password/reset/:token" exact element={<ResetPassword/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default MyRoutes