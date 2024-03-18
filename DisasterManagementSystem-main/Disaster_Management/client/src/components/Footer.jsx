import React from 'react';
import '../styles/styles.scss';



const Footer = ({className}) => {
  return (
    <div className={`footer ${className}`}>
      <div className='footersection'>
        <div className='footer-links'>
          <div className='footer-links-div'>
            <h4>About Us</h4>
            <a href="/">
              <p>Pages</p>
            </a>
            <a href="/">
              <p>Updates</p>
            </a>
            <a href="/">
              <p>Users</p>
            </a>


          </div>
          
          <div className='footer-links-div'>
            <h4>News</h4>
            <a href="/">
              <p>News Releases</p>
            </a>
            <a href="/">
              <p>Multimedia Gallary</p>
            </a>
            <a href="/">
              <p>News- More</p>
            </a>
          </div>
          <div className='footer-links-div'>
            <h4>Contact Us</h4>
            <a href="/">
              <p>Gmail</p>
            </a>
            <a href="/">
              <p>Feedback</p>
            </a>
            
          </div>
          <div className='footer-links-div'>
            <h4>Stay Connected</h4>
            <div className='socialmedia'>
              
              
            </div>

            
            <a href="/">
              <p>Facebook</p>
            </a>
            <a href="/">
              <p>Twitter</p>
            </a>
            <a href="/">
              <p>Linkedin</p>
            </a>
           
            
          </div>
          </div>
        <hr></hr>
        <div className='footer-below'>
          <div className='footer-copyright'>
            <p>
              @{new Date().getFullYear()} Binary Bridge. All Rights Reserved.
            </p>
          </div>
          <div className='footer-below-links'>
            <a href='/'><div><p></p></div></a>
            <a href='/'><div><p></p></div></a>
          </div>
        
        </div>
      </div>
    </div>
  ) 
  }

export default Footer;
