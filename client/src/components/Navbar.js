/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate for React Router v6
import 'bootstrap/dist/css/bootstrap.min.css';
import "./navbar.css"; // Import your CSS file

function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();  // Hook to navigate programmatically

  // Handle scroll event to toggle sticky navbar
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSelectedRecipeClick = () => {
    // Navigate to the "Selected Recipe" page
    navigate('/selected-recipe');
  };

  const handleHomeClick = () => {
    // Navigate to the "Home" page
    navigate('/home');
  };

  const handleLogoutClick = () => {
    // Navigate to the "Sign In" page
    navigate('/');  // Change '/signin' to your actual sign-in route
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-light ${isSticky ? 'sticky' : ''}`}>
      <div className="container-fluid">
        <button className="navbar-brand btn btn-link" onClick={handleHomeClick} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          LopDrinks 🎉
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleHomeClick} style={{ fontSize: '1rem' }}>
                Home
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-primary" onClick={handleSelectedRecipeClick}>
                Selected Recipe
              </button>
            </li>
          </ul>
          <button className="btn btn-outline-danger" type="button" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
