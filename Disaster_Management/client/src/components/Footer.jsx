// client/src/components/Footer/Footer.jsx
import React from 'react';
import '../styles/styles.scss';

const Footer = ({ className }) => {
  return (
    <footer className={`footer ${className}`}>
      <div className="footer-content">
        <p>&copy; Binary Bridge | Disaster Management System</p>
      </div>
    </footer>
  );
};

export default Footer;
