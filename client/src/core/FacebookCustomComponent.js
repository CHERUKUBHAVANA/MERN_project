import React from 'react'
const FacebookCustomComponent = () => {
    return (
        <div>
            <button style={{
                backgroundColor: '#4267b2',
                color: '#fff',
                fontSize: '16px',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '4px',
                paddingLeft: '4em',
                paddingRight: '4em',
                alignContent: 'center',
                // marginLeft: '3.5em'
            }}>
                <i className='fab fa-google pr-2'></i>Login with facebook
            </button>
        </div>

    )
}
export default FacebookCustomComponent