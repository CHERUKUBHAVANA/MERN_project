import React, { useEffect, useState } from "react";
import Layout from "../core/Layout";
import { useParams } from "react-router-dom";
import axios from 'axios'
import {jwtDecode} from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import withRouter from "../core/WithRouter";

const ResetPassword = () => {
    const {token} = useParams()
    const [values, setValues] = useState({
        name:'',
        newPassword: '',
        token: '',
        buttonText: "Reset password"
    })

    useEffect(()=>{
        let {name} = jwtDecode(token)
        if(token){
            setValues({...values, name, token})
        }
    }, [token, values])

    const { name, newPassword, buttonText } = values

    const handleChange = (event) => {
        setValues({ ...values, newPassword: event.target.value })
    }

    const clickSubmit = (event) => {
        event.preventDefault()
        setValues({ ...values, buttonText: 'Submitting' })
        axios({ //insted of postman
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/reset-password`,
            data: { newPassword, resetPasswordLink: token }
        })
            .then(response => {
                toast.success(response.data.message)
                setValues({...values, buttonText: 'Done'})
            })
            .catch(error => {
                setValues({ ...values, buttonText: 'Reset password' })
                toast.error(error.response.data.error)
            })
    }

    const resetPasswordForm = () => {
        return (
            <form>
                <div className="form-group">
                    <label className="text-muted">New Password</label>
                    <input onChange={handleChange} value={newPassword} type="password" placeholder="Type new password" required className="form-control" />
                </div>
                <br/>
                <div>
                    <button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button>
                </div>
            </form>
        )
    }
    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                <h1 className="p-5 text-center">Hey {name}, type your new password here!</h1>
                {resetPasswordForm()}
            </div>
        </Layout>
    )
}
export default withRouter(ResetPassword);