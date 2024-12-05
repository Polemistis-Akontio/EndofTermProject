import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Import styling
import logo from '../assets/stats_on_crack.png'; // Logo import
import Stats from './StatsHeader'; // Import Stats component
import News from './NewsHeader'; // Import News component
import Betting from './BettingHeader'; // Import Betting component

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('authToken'); // Check if logged in

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear token
    navigate('/'); // Redirect to home page
  };

  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate('/home')}>
        <img src={logo} alt="Logo" className="header-logo-img" />
        <h1 className="header-name">Stats On Crack!</h1>
      </div>
      <nav className="header-nav">
        <div className="header-container">
          <Link to="/home" className="header-link">Home</Link>
        </div>

        <div className="header-container">
          <Link to="/news/home" className="header-link">News</Link>
          <News />
        </div>

        <div className="header-container">
          <Link to="/betting/home" className="header-link">Betting</Link>
          <Betting />
        </div>

        <div className="header-container">
          <Link to="/stats/home" className="header-link">Stats</Link>
          <Stats />
        </div>

        <div className="header-container">
                {isLoggedIn ? (
            <button className="header-logout" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="header-link">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
