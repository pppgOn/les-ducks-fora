import React, {useEffect, useState} from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import imgPrincipal from '../assets/backMain.png';
import duck from '../assets/ducks/duck_dark.png';
import AuthService from "../logic/AuthService.jsx";
import tokenService from "../logic/token.service.jsx";
import Popup from "../components/Popup.jsx";
import TokenService from "../logic/token.service.jsx";


let isLoggedIn = false;
let redirect = '/signin';
const Home = () => {
  const [isButtonShifted, setButtonShifted] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  
    const [user, setUser] = useState(null);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [textContent, setTextContent] = useState('');
    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

  const handleMouseEnter = () => {
    // Définir un décalage après 5 secondes
    setTimeout(() => {
      setButtonShifted(true);
    }, 100);
  };

    const handleButtonClick = () => {
        // Redirect to Signin page
        window.location.href = redirect;
    };

    useEffect(() => {
        const user = tokenService.getUser();
        isLoggedIn = user !== "{}";
        // If not logged in, redirect to the login page
        if (isLoggedIn) {
            redirect='/gamehub';
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

        const duckImage = document.querySelector('.duck.dark');
        duckImage.addEventListener('click', handleDuckClick);
    }, []);


    const handleDuckClick = () => {
        if(!isLoggedIn){
            setTextContent('Félicitation vous avez trouvé un canard mais vous devez vous connecter !');
            togglePopup();
        }
        else if(inventoryItems.length > 0 && inventoryItems.includes(1)){
            setTextContent('Félicitation vous avez trouvé un canard mais vous l\'avez déjà !');
            togglePopup();
        }else if(!inventoryItems.includes(1)) {
            let response = AuthService.addInventaire(1);
            setTextContent('Félicitation vous avez trouvé un canard !');
            togglePopup();
        }
    };


  return (
    <div>
      <Navbar />
      <Popup isVisible={isPopupVisible} togglePopup={togglePopup} textContent={textContent} />
      <main class="maine">
        <div >
        <img class="duck dark" src={duck} alt="Dark Duck" />
        <div class="btnDiv">
            <button
            className={`boutonMain ${isButtonShifted ? 'shifted' : ''}`}
            onMouseEnter={handleMouseEnter}
            onClick={handleButtonClick}>
          Jouer !
        </button>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
