import React, { useEffect, useState } from 'react';
import AuthService from '../logic/AuthService';
import tokenService from "../logic/token.service.jsx";
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useTheme } from '../logic/ThemeContext.jsx';


import duck_basic from '../assets/ducks/duck_basic.png';
import duck_dark from '../assets/ducks/duck_dark.png';
import duck_noel from '../assets/ducks/duck_noel.png';
import duck_deuteranopie from '../assets/ducks/duck_deuteranopie.png';
import duck_tritanopie from '../assets/ducks/duck_tritanopie.png';
import duck_hacker from '../assets/ducks/duck_hacker.png';

import treeImg from '../assets/tree.png';
import Popup from "../components/Popup.jsx";

let isLoggedIn = false;
const ProfilePage = () => {

    const [user, setUser] = useState(null);
    const { getMode, setMode } = useTheme();
    const { backgroundColor, color } = getMode('main');
    const [inventoryItems, setInventoryItems] = useState([]);

    const [isPopupVisible, setPopupVisible] = useState(false);
    const [textContent, setTextContent] = useState('');

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    const mapItemToImage = (item) => {
        switch (item) {
            case 0:
                return duck_basic;
            case 1:
                return duck_dark;
            case 2:
                return duck_noel;
            case 3:
                return duck_deuteranopie;
            case 4:
                return duck_tritanopie;
            case 5:
                return duck_hacker;
            default:
                return duck_dark;
        }
    };

    useEffect(() => {
        const user = tokenService.getUser();
        isLoggedIn = user !== "{}";
        // If not logged in, redirect to the login page
        if (!isLoggedIn) {
            window.location.href = '/signin';
        }
        setUser(user);
        let inventoryPromise = AuthService.getInventaire();
        inventoryPromise
            .then((response) => {
                // Check if the response has the "inventory" field
                if (response && response.inventory) {
                    // Update the inventoryItems state
                    setInventoryItems(response.inventory);
                } else {
                    console.error('Response does not contain the "inventory" field.');
                }
            })
            .catch((error) => {
                // Handle any errors during the Promise execution
                console.error('Error:', error);
            });
    }, []);
    const handleButtonClick = () => {
        window.location.href = '/logout';
    };

    const getUser = () => {
        return tokenService.getUser();
    };

    const handleDuckClick = (index) => {
        // Set the theme mode based on the duck clicked
        switch (index) {
            case 0:
                setMode('basic');
                setTextContent('Vous avez choisi le thème du canard basique !')
                break;
            case 1:
                setMode('dark');
                setTextContent('Vous avez choisi le thème du canard sombre !')
                break;
            case 2:
                setMode('noel');
                setTextContent('Vous avez choisi le thème du canard de noël !')
                break;
            case 3:
                setMode('deuteranopie');
                setTextContent('Vous avez choisi le thème du canard deuteranopie !')
                break;
            case 4:
                setMode('tritanopie');
                setTextContent('Vous avez choisi le thème du canard tritanopie !')
                break;
            case 5:
                setMode('hacker');
                setTextContent('Vous avez choisi le thème du canard hacker !')
                break;
            default:
                break;
        }
        togglePopup();
    };

    return (
        <main style={{ backgroundColor, color }}>
            <Navbar />
            <Popup isVisible={isPopupVisible} togglePopup={togglePopup} textContent={textContent} />
            <div id="profile">
                <h2>Profile de {isLoggedIn ? user: 'no user' }</h2>
                <div class="treeContainer">
                    <div class="inventoryContainer">
                        <svg class="rotating-star" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L14.4 8.6H21.7L15.8 13.7L18.2 20.3L12 15.4L5.8 20.3L8.2 13.7L2.3 8.6H9.6L12 2Z" fill="#FFD700"/>
                        </svg>
                        {inventoryItems.map((item, index) => (
                            <img
                                class="duckTree"
                                id={`duck`+index} key={index}
                                src={mapItemToImage(item)}
                                alt="duck"
                                onClick={() => handleDuckClick(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default ProfilePage;
