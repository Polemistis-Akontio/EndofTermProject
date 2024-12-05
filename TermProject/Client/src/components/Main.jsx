import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './index.css';
import LoginPage from '../Login Register/LoginPage';
import RegisterPage from '../Login Register/RegisterPage';
import About from '../About/About';
import Policy from '../Policy/Policy';
import Contact from '../Contact/Contact';
import NFLNews from '../News/News';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import statsRoutes from '../Stats/statsRoutes';
import {ViewOddsByGame, ViewGamesByDate} from '../Betting/Betting';
import HomePage from '../Home/HomePage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path="/contact" element={<Contact />} />

        <Route 
          path="/home"
          element={
            <ProtectedRoute> 
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news/espn/nfl"
          element={
            <ProtectedRoute>
              <NFLNews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/betting/home"
          element={
            <ProtectedRoute>
              <ViewGamesByDate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/betting/:id"
          element={
            <ProtectedRoute>
              <ViewOddsByGame />
            </ProtectedRoute>
          }
        />
        {statsRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.protected ? <ProtectedRoute>{route.component}</ProtectedRoute> : route.component}
          />
        ))}
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>
);