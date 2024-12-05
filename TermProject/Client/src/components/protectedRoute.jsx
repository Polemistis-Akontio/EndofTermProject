import PropTypes from 'prop-types'; // Import PropTypes
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = Boolean(localStorage.getItem('authToken')); // Check if the user is logged in

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; // Redirect to login if not logged in
  }

  return children; // Allow access to protected content
};

// Add PropTypes for validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children is a required prop
};

export default ProtectedRoute;