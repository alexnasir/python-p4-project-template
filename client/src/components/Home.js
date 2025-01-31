/* eslint-disable jsx-a11y/no-distracting-elements */
import React from 'react';
import { Link } from 'react-router-dom'; // For routing between pages
import Navbar from './Navbar';
import './home.css';
function Home() {
  return (
    <>

      <div>
        <Navbar />
        <h1>
          <marquee>Welcome to Lopdrinks 🍹</marquee>
          <marquee direction="right">Welcome to Lopdrinks 🍹</marquee>
        </h1>

        <h3>Our ultimate destination for delicious recipes and ingredient discovery</h3>

        <p>
          Explore, Create, and Share your favorite drink recipes! Whether you're a mixology pro or a casual sipper,
          we’ve got something for everyone. Find ingredients, pairings, and unleash your inner bartender.
        </p>

        {/* Buttons to navigate to different parts of the app */}
        <div style={{ marginTop: '20px' }}>
          <Link to="/create-recipe">
            <button style={buttonStyle}>Create a New Recipe</button>
          </Link>

          <Link to="/recipes">
            <button style={buttonStyle} >View All Recipes</button>
          </Link>

          
        </div>
      </div>
      
    </>
  );
}

// Styling for the buttons
const buttonStyle = {
  padding: '10px 20px',
  margin: '10px',
  backgroundColor: '#4CAF50', // Green
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s ease',
};

export default Home;
