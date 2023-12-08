import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Link } from 'react-router-dom';

import '../components/AboutPage.css';

import logoFemto from '../assets/logos/logo-femto.webp';
import logoCibest from '../assets/logos/logo-cibest.png';
import logoFlexio from '../assets/logos/logo-Flexio.png';
import logoSeekOne from '../assets/logos/logo-seek-one.png';
import logoMaincare from '../assets/logos/logo-maincare.svg';
import logoSmartesting from '../assets/logos/logo-smartesting.webp';
import logoUfrst from '../assets/logos/logo-ufrst.webp';

const SponsorsPage = () => {
    return(
        <div>
             <Navbar />
            <main>
            <div class="sponsors-container">
                <p>Nos sponsors</p>
                <p>Merci à eux ! 🍕</p>
                <ul>
                    <li class="about-us-container">
                       <Link to="https://www.cibest.com/">
                       <img class="sponsors" src={logoCibest} alt="Logo Cibest" />
                       </Link>
                    </li>
                    <li class="about-us-container">
                    <Link to="https://www.flexio.fr/">
                       <img class="sponsors" src={logoFlexio} alt="Logo Flexio" />
                       </Link>
                    </li>
                    <li class="about-us-container">
                    <Link to="https://www.seek-one.fr/">
                       <img class="sponsors" src={logoSeekOne} alt="Logo Seek One" />
                       </Link>
                    </li>
                    <li class="about-us-container">
                    <Link to="https://maincare.com">
                       <img class="sponsors" src={logoMaincare} alt="Logo Maincare" />
                       </Link>
                    </li>
                    <li class="about-us-container">
                    <Link to="https://www.smartesting.com/">
                       <img class="sponsors" src={logoSmartesting} alt="Logo Smartesting" />
                       </Link>
                    </li>
                    <li class="about-us-container">
                    <Link to="https://www.univ-fcomte.fr">
                       <img class="sponsors" src={logoUfrst} alt="Logo UFRST" />
                       </Link>
                    </li>
                    <li class="about-us-container">
                    <Link to="https://www.femto-st.fr/fr/Departements-de-recherche/DISC/Presentation">
                       <img class="sponsors" src={logoFemto} alt="Logo Femto-st" />
                       </Link>
                    </li>
                </ul>
            </div>
            </main>
            <Footer/>
        </div>
    );
};

export default SponsorsPage;
