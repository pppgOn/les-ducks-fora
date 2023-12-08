import TokenService from "./token.service.jsx";
import api from './api.jsx';
import URL_API from './api.endpoints.json';


const signin = async (username,password) => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    return await api.post(URL_API.endpoint.login, {
        username,
        password
    },config).then((response) => {
        if (response.data.access_token !== undefined) {
            TokenService.setUser(response.data)
        }
        return response.data
    }).catch((error) => {
        console.log(error)
    })
}

const signup = async (email, password) => {
    return await api.post(URL_API.endpoint.register, {
        email,
        password
    }).then(
        (response) => {
            return response.data
        }
    )
}

const signout = () => {
    TokenService.removeUser()
}

const getCurrentUser = () => {
    const user = TokenService.getUser()
    if (user.refresh_token === undefined) {
        return null
    }
    return user
}

const getInventaire = async () => {
   return await api.get(URL_API.endpoint.inventaire, {
        headers: {
            'Authorization': 'Bearer ' + TokenService.getLocalAccessToken()
        }
    }).then((response) => {
        return response.data
    }).catch((error) => {
        console.log(error)
    })
}

const addInventaire = async(boule_id) => {
    return await api.put(URL_API.endpoint.add_inventaire+ "?boule_id=" +
        boule_id).then((response) => {
        return response.data
    }).catch((error) => {
        console.log(error)
    })
}

const pushpoint = async(points, level) => {
    return await api.put(URL_API.endpoint.add_point+ "?points=" +
        points + "&level=" + level).then((response) => {
        return response.data
    }).catch((error) => {
        console.log(error)
    })
}

const reset_password = async (token,password) => {
    return await api.post(URL_API.endpoint.reset_password, {
        token,
        password
    }).then((response) => {
        return response.data
    }).catch((error) => {
        console.log(error)
    })
}

const AuthService = {
    signup,
    signin,
    signout,
    getCurrentUser,
    reset_password,
    getInventaire,
    addInventaire
}

export default AuthService;
