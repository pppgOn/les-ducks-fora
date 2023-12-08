import React, {useEffect, useState} from 'react';

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Link } from 'react-router-dom';

import '../components/AboutPage.css';
import logondi from '../assets/logos/logo.jpg';

import duck from '../assets/ducks/duck_noel.png';
import AuthService from "../logic/AuthService.jsx";
import tokenService from "../logic/token.service.jsx";
let isLoggedIn = false;
const AboutUsPage = () => {
    const teamMembers = [
        { name: 'Vandrepol Léo '},
        { name: 'Grosdidier Alphée'},
        { name: 'Foucon Wilfrid'},
        { name: 'Verrier Bastien'},
        { name: 'Pereira-Gehant Paolo'},
        { name: 'Turan Baturay'},
    ];


    const [isPopupVisible, setPopupVisible] = useState(false);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [user, setUser] = useState(null);
    const [textContent, setTextContent] = useState('');
    const [isButtonShifted, setButtonShifted] = useState(false);
    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    useEffect(() => {
        const user = tokenService.getUser();
        isLoggedIn = user !== "{}";
        // If not logged in, redirect to the login page
        if (isLoggedIn) {
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
        }
        const duckImage = document.querySelector('.duck.noel');
        duckImage.addEventListener('click', handleDuckClick2);

    }, []);

    const handleDuckClick2 = () => {
        if(!isLoggedIn){
            setTextContent('Félicitation vous avez trouvé un canard mais vous devez vous connecter !');
            togglePopup();
        }
        else if(inventoryItems.length > 0 && inventoryItems.includes(2)){
            setTextContent('Félicitation vous avez trouvé un canard mais vous l\'avez déjà !');
            togglePopup();
        }else if(!inventoryItems.includes(2)) {
            let response = AuthService.addInventaire(2);
            setTextContent('Félicitation vous avez trouvé un canard !');
            togglePopup();
        }
    };

    const handleMouseEnter = () => {
        // Définir un décalage après 5 secondes
        setTimeout(() => {
          setButtonShifted(true);
        }, 1000);
        setTimeout(() => {
            const duckImage = document.querySelector('.duck.noel');
            duckImage.style.zIndex = 2;
        },2000);

      };

    return (
        <div>
            <Navbar />
            <main>
            <div className="about-us-container">
                <p>Bienvenue sur la page de l'équipe Les Ducks Fora!<br /> NDI Besançon 2023 </p>
                <ul>
                    {teamMembers.map((member, index) => (
                        <li key={index} className="about-us-container">
                            <h3>{member.name}</h3>
                            {/* Add additional information such as role or interests if available */}
                        </li>
                    ))}
                </ul>
            </div>
            <img className="duck noel" src={duck} alt="Noel Duck" />
            <div className={`ndiLogo ${isButtonShifted ? 'shifted' : ''}`} onMouseEnter={handleMouseEnter}>
                    <Link to="https://www.nuitdelinfo.com/">
                       <img  src={logondi} alt="Logo Nuit de l'info" />
                       </Link>
                       </div>
                </main>
            <Footer />
        </div>
    );
};

export default AboutUsPage;
