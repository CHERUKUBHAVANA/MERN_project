import React from "react";
// import axios from 'axios'
import FacebookLogin from '@greatsumini/react-facebook-login';
import FacebookCustomComponent from '../core/FacebookCustomComponent'
const FacebookLoginOption = ({ informParent }) => {

    const responseFacebook = response => {
        // console.log(response)
        // axios({
        //     method: 'POST',
        //     url: `${process.env.REACT_APP_API}/google-login`,
        //     data: { idToken: response.credential }
        // })
        //     .then(response => {
        //         //inform parent component
        //         informParent(response)
        //     })
        //     .catch(error => {

        //     })
    }
    return (
        <div className="pb-3">
            <FacebookLogin
                appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
                autoLoad={false}
                onSuccess={responseFacebook}
                onFail={(error) => {
                    // console.log('Login Failed!', error);
                }}
                onProfileSuccess={(response) => {
                    // console.log('Get Profile Success!', response);
                }}
                // render={({ onClick, logout }) => (
                //     <FacebookCustomComponent onClick={responseFacebook} onLogoutClick={logout} />
                // )}
            />
        </div>
    )
}

export default FacebookLoginOption