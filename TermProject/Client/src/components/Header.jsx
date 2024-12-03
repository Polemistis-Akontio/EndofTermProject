import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css'; // Create this for styling
import logo from '../assets/stats_on_crack.png'; // Adjust path according to your folder structure

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token'); // Check if logged in

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    navigate('/'); // Redirect to main page
  };

  return (
    <header className="header">
        <div className="header-logo">
            <img src={logo} alt="Logo" className="header-logo-img"/>
            <h1 className="header-name">Stats On Crack!</h1>
        </div>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/news">News</Link>
        <Link to="/players">Sports</Link>
        <Link to="/stats">Stats</Link>
        {isLoggedIn ? (
          <button className="header-logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
