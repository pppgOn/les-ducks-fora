import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../logic/ThemeContext.jsx';
import './footer.css';

const Footer = () => {
    const { getMode } = useTheme();
    const { backgroundColor, color } = getMode('footer');

    const goToFacebook = () => {
        window.location.href = 'https://www.facebook.com/Sida-Info-Service-147181288674418/';
    };

    const goToTwitter = () => {
        window.location.href = 'https://twitter.com/SidaInfoService';
    };

    const goToYoutube = () => {
        window.location.href = 'https://www.youtube.com/channel/UCFF0xuRsP_ExlbNau01v_SQ';
    };

    const goToInstagram = () => {
        window.location.href = 'https://www.instagram.com/sida_info_service/';
    };

    return (
        <footer style={{ backgroundColor, color }}>
            <div>
                <div className="copyright">
                    <p>&copy; Les Ducks Fora - <Link to="/apropos">A propos</Link> - Merci à nos <Link to="/sponsors">sponsors</Link></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


/*import React from 'react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsTwitter, BsYoutube, BsInstagram } from 'react-icons/bs';
import './footer.css';

class Footer extends React.Component {
  goToFacebook = () => {
    window.location.href = 'https://www.facebook.com/Sida-Info-Service-147181288674418/';
  };

  goToTwitter = () => {
    window.location.href = 'https://twitter.com/SidaInfoService';
  };

  goToYoutube = () => {
    window.location.href = 'https://www.youtube.com/channel/UCFF0xuRsP_ExlbNau01v_SQ';
  };

  goToInstagram = () => {
    window.location.href = 'https://www.instagram.com/sida_info_service/';
  };

  render() {
    return (
    <footer>
      <div >

        <div class="copyright">
            <p>&copy; Les Ducks Fora - <Link to="/apropos" >A propos</Link> - Merci à nos <Link to="/sponsors">sponsors</Link></p>
        </div>
      </div>
      </footer>
    );
  }
}

export default Footer;
*/
