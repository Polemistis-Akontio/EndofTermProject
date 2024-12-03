import '../styles/Footer.css'; // Make sure this path matches your project structure
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Stats On Crack! All rights reserved.</p>
      <nav className="footer-nav">
        <Link to="/about">About</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/contact">Contact Us</Link>
      </nav>
    </footer>
  );
};

export default Footer;