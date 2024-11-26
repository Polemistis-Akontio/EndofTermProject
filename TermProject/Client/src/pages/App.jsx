import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

function App() {
  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Sam&apos;s Sports Stats</h1>
      <div className="card">
        <button onClick={goToLoginPage}>Login</button>
      </div>
    </div>
  );
}

export default App;