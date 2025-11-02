import { Link } from 'react-router-dom'

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h3 className="footer-logo">AARA Salon</h3>
          <p>Excellence in Hair, Makeup, and Skin.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('#home') }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('#about') }}>About</a>
          <Link to="/services">Services</Link>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('#locations') }}>Locations</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('#booking') }}>Book Now</a>
        </div>
        <div className="footer-col">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <p className="copyright">© 2025 AARA Salon. All rights reserved. | <Link to="/privacy">Privacy Policy</Link></p>
    </footer>
  )
}

export default Footer
