import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../logic/ThemeContext.jsx';
import './navbar.css';
import AuthService from '../logic/AuthService.jsx';
import tokenService from "../logic/token.service.jsx";
import logo from '../assets/logos/logo.jpg'

const handleButtonClick = () => {
    // Redirect to Signin page
    window.location.href = '/logout';
};

let connected = false;

const Navbar = () => {
    const { getMode } = useTheme();
    const { backgroundColor, color } = getMode('nav');

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check the login status when the component mounts
        checkLoginStatus();
    }, []);

    const checkLoginStatus = () => {
        const user = tokenService.getUser();
        connected = user !== "{}";
        setIsLoggedIn(connected);
    };

    return (
        <nav style={{ backgroundColor, color }}>
            <div>
                <Link to="/home">
                    <h1>Les Ducks Fora</h1>
                </Link>
            </div>
            <div className="profileBuble">
                {isLoggedIn ? (
                    <>
                        <Link to="../profile">
                            <FontAwesomeIcon icon={faUser} />
                        </Link>
                        <Link to="/" onClick={handleButtonClick}>
                            <FontAwesomeIcon id="deco" icon={faSignOutAlt} />
                        </Link>
                    </>
                ) : (
                    <Link to="../signin">
                        <FontAwesomeIcon icon={faSignInAlt} />
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;




/*import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import './navbar.css';

import './navbar.css';
import AuthService from '../logic/AuthService.jsx';
import tokenService from "../logic/token.service.jsx";
import logo from '../assets/logos/logo.jpg'


const handleButtonClick = () => {
    // Redirect to Signin page
    window.location.href = '/logout';
};

let connected = false;

class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isLoggeddIn : false}
    }

    componentDidMount() {
        // Check the login status when the component mounts
        this.checkLoginStatus();
    }
    checkLoginStatus = () => {
        const user = tokenService.getUser();
        connected = user !== "{}";
        this.setState({ isLoggedIn: connected });
    };


    render() {
        return (
            <nav>
                <div>
                <Link to="/home">
                    <h1>Les Ducks Fora</h1>
                    </Link>
                </div>
                <div class="profileBuble">
                {(connected) ? (
                    <>
                        <Link to="../profile">
                            <FontAwesomeIcon icon={faUser} />
                        </Link>
                        <Link to="/" onClick={handleButtonClick}>
                        <FontAwesomeIcon id="deco" icon={faSignOutAlt} />
                    </Link>

                    </>
                ) : (
                    <Link to="../signin">
                        <FontAwesomeIcon icon={faSignInAlt} />
                    </Link>


                )}
                </div>

            </nav>
        );
    }
}

export default Navbar;
*/
