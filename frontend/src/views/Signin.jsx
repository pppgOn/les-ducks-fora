import React, { useState } from 'react';
import AuthService from '../logic/AuthService.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

import tokenService from "../logic/token.service.jsx";
import {Link} from "react-router-dom";
import { useTheme } from '../logic/ThemeContext.jsx'; // Import the useTheme hook

// Functional component for the login page
const LoginPage = () => {
    // State variables to store user input
    const { getMode } = useTheme(); // Get the current theme mode
    const { backgroundColor, color } = getMode('main');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Function to handle form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.signin(username, password);
            if (response.access_token) {
                //store the token in the local storage
                tokenService.setUser(username);
                tokenService.setToken(response.access_token);
                tokenService.setRefreshToken(response.refresh_token);
                await AuthService.addInventaire(1);
                await AuthService.addInventaire(3);
                await AuthService.addInventaire(4);
                window.location.href = '/profile';

            } else {
                setError("Informations d'identification invalides");
            }
        } catch (error) {
            setError('Identifiant ou mot de passe incorrect');
        }
    };

    return (

        <div style={{ backgroundColor, color }}>
             <Navbar />
            <main>

            <div class="logContainer">
            <div class="logPage">
            <h2>Page de connexion</h2>
            <form onSubmit={handleLogin}>
                <label>
                    Nom d'utilisateur:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Mot de passe:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Connexion</button>
                <Link to="../signup">
                    <button type="button">S'inscrire</button>
                </Link>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            </div>
            </main>
            <Footer />
        </div>

    );
};


export default LoginPage;
