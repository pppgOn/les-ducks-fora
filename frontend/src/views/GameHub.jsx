import React, { useEffect, useState } from 'react';

import AuthService from '../logic/AuthService';
import tokenService from "../logic/token.service.jsx";

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Link } from 'react-router-dom';

import '../components/GameHub.css';

let isLoggedIn = false;

const GameHubPage = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const user = tokenService.getUser();
        isLoggedIn = user !== "{}";

        // If not logged in, redirect to the login page
        if (!isLoggedIn) {
            window.location.href = '/signin';
        } else {
            // If logged in, fetch and set user data
            const userData = AuthService.getCurrentUser();
            setUser(userData);
        }
    }, []);

    const lvl = [
        {nom: 'Logement', score: '0'},
        {nom: 'Transport', score: '0'},
        {nom: 'Industrie', score: '0'},
        {nom: 'Alimentation', score: '0'},
    ];

    return (
        <div>
            <Navbar />
            <main>
            <div class="lvl">
                <p>Menu Jeu </p>

                <ul>
                <Link to="../level1">
                    <li  class="lvl">
                        <h3>Niveau 1 {lvl[0].nom} -- Score : {lvl[0].score}</h3>
                    </li>
                    </Link>
                    <Link to="../level2">
                    <li  class="lvl">
                        <h3>Niveau 2 {lvl[1].nom} -- Score : {lvl[1].score}</h3>
                    </li>
                    </Link>
                    <Link to="../level3">
                    <li  class="lvl">
                        <h3>Niveau 3 {lvl[2].nom} -- Score : {lvl[2].score}</h3>
                    </li>
                    </Link>
                    <Link to="../level4">
                    <li  class="lvl">
                        <h3>Niveau 4 {lvl[3].nom} -- Score : {lvl[3].score}</h3>
                    </li>
                    </Link>
                    
                </ul>
            </div>
                </main>
            <Footer />
        </div>
    );
};

export default GameHubPage;
