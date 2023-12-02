import React from "react";
import axios from 'axios'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import GoogleCustomComponent from "../core/GoogleCustomComponent";
const GoogleLoginOption = ({informParent}) => {

    const responseGoogle = response => {
        // console.log(response.credential)
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/google-login`,
            data: { idToken: response.credential }
        })
            .then(response => {
                //inform parent component
                informParent(response)
            })
            .catch(error => {

            })
    }

    return (
        <div className="pb-3">
            <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
                <GoogleLogin
                    clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={() => {
                        // console.log("Login failed")
                    }}
                    render={({ onClick, logout }) => (
                        <GoogleCustomComponent onClick={onClick} onLogoutClick={logout} />
                    )}
                // cookiePolicy={"single_host_origin"}
                />
            </GoogleOAuthProvider>
        </div>
    )
}

export default GoogleLoginOption