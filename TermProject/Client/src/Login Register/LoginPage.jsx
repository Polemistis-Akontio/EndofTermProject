import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './LoginPage.css';

const LoginPage = () => {
  const [inputEmail, setEmail] = useState('');
  const [inputPassword, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputEmail && inputPassword) {
      fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inputEmail,
          password: inputPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            alert('Login Successful!');
            localStorage.setItem('authToken', data.token);
            navigate('/home'); // Redirect to the home page
          } else {
            setError('Invalid email or password.'); // Handle server errors
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Something went wrong. Please try again later.');
        });
    } else {
      setError('Both email and password are required.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={inputEmail}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={inputPassword}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn">Login</button>
      </form>
      <div className="signup-link">
        <p>Don&apos;t have an account?</p>
        <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default LoginPage;
