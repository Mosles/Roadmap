//LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import placeholderImage from '../../../notepicture.png';
import { useRoadmap } from '../RoadmapContext/RoadmapContext';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [registerData, setRegisterData] = useState({ username: '', password: '', confirmPassword: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Add this line
  const [validationErrors, setValidationErrors] = useState([]);
  const { loginUser, registerUser, user } = useRoadmap();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Remove the initialLoading condition as its handling is not provided in your context code
    if (user) {
      console.log("Navigating to /dashboard from LandingPage");
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const switchForm = () => {
    setShowLogin(!showLogin);
    setSuccessMessage('');
    setValidationErrors([]);
    setRegisterData({ username: '', password: '', confirmPassword: '' });
    setLoginData({ username: '', password: '' });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    if (registerData.password !== registerData.confirmPassword) {
        setSuccessMessage('');
        setValidationErrors(['Passwords do not match.']);
        setIsRegistering(false);
        return;
    }
    const { success, errors } = await registerUser(registerData.username, registerData.password);
    setIsRegistering(false);
    if (success) {
        setSuccessMessage('Registration successful. Please log in.');
        setShowLogin(true);
        setRegisterData({ username: '', password: '', confirmPassword: '' });
        setValidationErrors([]);
    } else {
        setSuccessMessage('');
        setValidationErrors(errors);
    }
};

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  // No need to navigate here as the navigation is handled within loginUser now
  const success = await loginUser(loginData.username, loginData.password, navigate); // Pass navigate function
  setIsLoading(false);
  if (!success) {
    // Handle login failure within the LandingPage component if necessary
    setSuccessMessage('Login failed. Please try again.');
  }
};

  return (
    <div className="landing-page">
      <div className="content-container">
        <div className="form-container">
          {showLogin ? (
            <>
              <h2>Login</h2>
              <form className="login-form" onSubmit={handleLoginSubmit}>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Username"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                />
                <input
                  type="password"
                  className="login-input"
                  placeholder="Password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
                {successMessage && <div className="success-message">{successMessage}</div>}
                  <button type="submit" className="form-button login-submit">
                  {isLoading ? <div className="spinner-for-all"></div> : (showLogin ? "Login" : "Register")}
        </button>
              </form>
              <button onClick={switchForm} className="form-button switch-form">Need an account? Register</button>
            </>
          ) : (
            <>
              <h2>Register</h2>
              <form className="registration-form" onSubmit={handleRegisterSubmit}>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Username"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  required
                />
                <input
                  type="password"
                  className="login-input"
                  placeholder="Password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                />
                <input
                  type="password"
                  className="login-input"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                />
{validationErrors.length > 0 && (
    <div className="validation-errors">
        {validationErrors.map((error, index) => (
            <div key={index} className="error-message">{error}</div>
        ))}
    </div>
)}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <button type="submit" className="form-button login-submit" disabled={isRegistering}>
          {isRegistering ? <div className="spinner-for-all"></div> : "Register"}
        </button>
              </form>
              <button onClick={switchForm} className="form-button switch-form">Have an account? Login</button>
            </>
          )}
        </div>
        <div className="image-container">
          <img src={placeholderImage} alt="Placeholder" className="img-fluid" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;