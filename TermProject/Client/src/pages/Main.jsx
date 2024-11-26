import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import Login from './LoginPage.jsx'
import '../Styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />  {/* Home page */}
        <Route path="/login" element={<Login />} /> {/* Login page */}
      </Routes>  
    </Router>
  </React.StrictMode>
);