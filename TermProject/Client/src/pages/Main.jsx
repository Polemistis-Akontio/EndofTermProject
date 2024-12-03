import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../Styles/index.css'
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import About from '../pages/About'
import Policy from '../pages/Policy'
import Contact from '../pages/Contact'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />  {/* Home page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>
);