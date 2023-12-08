// Popup.js
import React from 'react';
import './Popup.css';

const Popup = ({ isVisible, togglePopup, textContent }) => {
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`popup-container ${isVisible ? 'visible' : ''}`} onClick={togglePopup}>
      <div className="popup" onClick={stopPropagation}>
        <p>{textContent}</p>
        <button onClick={togglePopup}>Close Popup</button>
      </div>
    </div>
  );
};

export default Popup;
