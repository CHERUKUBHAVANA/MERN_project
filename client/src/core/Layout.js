import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import withRouter from './WithRouter'
import { isAuth } from '../auth-components/helpers'
import { signout } from '../auth-components/helpers'

const Layout = ({ children, router }) => {
    const { location, navigate } = router
    const pathname = location.pathname

    const isActive = (path) => {
        if (path === pathname) {
            return { color: "black" }
        }
        else {
            return { color: "white" }
        }
    }
    const nav = () => {
        return (<ul className='nav nav-tabs bg-primary'>
            <li className='nav-item'>
                <Link to='/' className=' nav-link' style={isActive('/')}>
                    Home
                </Link>
            </li>
            {!isAuth() && (
                <Fragment>
                    <li className='nav-item'>
                        <Link to='/signin' className=' nav-link' style={isActive('/signin')}>
                            Signin
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/signup' className=' nav-link' style={isActive('/signup')}>
                            Signup
                        </Link>
                    </li>
                </Fragment>
            )}

            {isAuth() && isAuth().role === "admin" && (
                <li className='nav-item'>
                    <Link to="/admin" className=' nav-link' style={isActive('/admin')}>
                    {isAuth().name.charAt(0).toUpperCase() + isAuth().name.slice(1)}
                    </Link>
                </li>
            )}

            {isAuth() && isAuth().role === "subscriber" && (
                <li className='nav-item'>
                    <Link to="/private" className=' nav-link' style={isActive('/private')}>
                        {isAuth().name}
                    </Link>
                </li>
            )}

            {isAuth() && (
                <li className='nav-item'>
                    <span className='nav-link text-light' style={{ cursor: 'pointer'}} onClick={() => {
                        signout(() => {
                            navigate('/')
                        })
                    }}>Signout</span>
                </li>
            )}

        </ul>)
    }
    return (
        <Fragment>
            {nav()}
            <div className='container'>
                {children}
            </div>
        </Fragment>
    )
}
export default withRouter(Layout);