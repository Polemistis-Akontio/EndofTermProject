import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import './RegisterPage.css';

const RegisterPage = () => {
  const [inputEmail, setEmail] = useState('');
  const [inputPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputEmail && inputPassword && inputPassword === confirmPassword) {
      // Send the data to the API to register the user
      fetch('http://localhost:3000/auth/register', {
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
            alert('Registration Successful!');
            localStorage.setItem('authToken', data.token);
            navigate('/home'); // Redirect to the home page after successful registration
          } else {
            // Handle general registration errors
            setError(data.error || 'Registration failed. Please try again.');
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Something went wrong. Please try again later.');
        });
    } else {
      setError('Passwords must match and all fields are required.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
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
        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn">Register</button>
      </form>
      <div className="login-link">
        <p>Already have an account?</p>
        <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
