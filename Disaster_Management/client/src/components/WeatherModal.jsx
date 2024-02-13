import React from 'react';
import '../styles/WeatherModal.scss';

const Modal = ({ onClose, show, children }) => {
  const handleClose = () => {
    console.log('Closing modal...');
    onClose();
  };

  return (
    <div className={`modal-overlay ${show ? 'show' : 'hide'}`}>
      <div className={`modal-content ${show ? 'show' : 'hide'}`}>
        <button className="close-button" onClick={handleClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
