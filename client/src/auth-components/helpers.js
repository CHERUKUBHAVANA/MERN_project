import cookie from 'js-cookie'

// set in cookie
export const setCookie = (key, value) => {
    if(window!=='undefined'){
        cookie.set(key, value, {
            expires: 1 // 1 day
        })
    }
}

// remove from cookie
export const removeCookie = (key) => {
    if(window!=='undefined'){
        cookie.remove(key, {
            expires: 1
        })
    }
}

// get from cookie such as stored token
//will be useful when we need to make request to server with token
export const getCookie = (key) => {
    if(window!=='undefined'){
        return cookie.get(key)
    }
}

// set in localStorage
export const setLocalStorage = (key, value) => {
    if(window!=='undefined'){
        localStorage.setItem(key, JSON.stringify(value))
    }
}

// remove from localStorage
export const removeLocalStorage = (key) => {
    if(window!=='undefined'){
        localStorage.removeItem(key)
    }
}

// authenticate user by passing data to cookie and localStorage during signin
export const authenticate = (response, callback) => { //after successful sigin
    setCookie('token', response.data.token)
    setLocalStorage('user', response.data.user)
    callback()
}

// access user info from localStorage
export const isAuth = () => {
    if(window!=='undefined'){
        const cookieChecked = getCookie('token')
        if(cookieChecked){
            if(localStorage.getItem('user')){
                return JSON.parse(localStorage.getItem('user'))
            }
            else{
                return false
            }
        }
    }
}

export const signout = (callback) => {
    removeCookie('token')
    removeLocalStorage('user')
    callback()
}

export const updateUser = (response, next) => { //middleware
    if(window!==undefined){
        let auth = JSON.parse(localStorage.getItem('user'))
        auth = response.data
        localStorage.setItem('user', JSON.stringify(auth))
    }
    next()
}