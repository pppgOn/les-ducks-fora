let setLoginHandler = () => {};

function getInventaire(){
    return localStorage.getItem('inventaire');
}
const getLocalRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.refresh_token || null;
};

const getLocalAccessToken = () => {
   return localStorage.getItem('token');
};

const getLocalExpireTime = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.expires || null;
};

const updateLocalAccessToken = (token, expireTime) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.access_token = token;
    user.expires = expireTime;
    localStorage.setItem('user', JSON.stringify(user));
};

const getUser = () => {
    return localStorage.getItem('user') || '{}';
};

const setUser = (user) => {
    setLoginHandler(true);
    localStorage.setItem('user', JSON.stringify(user));
};

const removeUser = () => {
    setLoginHandler(false);
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
};

export const removeToken = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    delete user.access_token;
    delete user.refresh_token;
    delete user.expires;
    localStorage.setItem('user', JSON.stringify(user));
}

function registerLoginHandler(setLogin) {
    setLoginHandler = setLogin;
    setLoginHandler(getUser().access_token !== undefined);
}

function setToken(token){
    localStorage.setItem('token', token);
}

function setRefreshToken(token){
    localStorage.setItem('refresh_token', token);
}

const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    getUser,
    setUser,
    removeUser,
    getLocalExpireTime,
    registerLoginHandler,
    removeToken,
    setToken,
    setRefreshToken,
    getInventaire
};

export default TokenService;
