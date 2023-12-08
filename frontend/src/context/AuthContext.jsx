import React, { useState, useEffect } from 'react';
import TokenService from '../logic/token.service';

const AuthContext = React.createContext({
    isLogged: false,
    setIsLogged: () => {},
});

const AuthProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        TokenService.registerLoginHandler(setIsLogged);
    }, []);

    return (
        <AuthContext.Provider value={{ isLogged, setIsLogged }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
export { AuthProvider };
