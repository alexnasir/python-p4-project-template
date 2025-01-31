import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sign.css';

const Sign = ({ setAuthToken }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const apiUrl = isSignUp ? 'http://127.0.0.1:5000/api/register' : 'http://127.0.0.1:5000/api/login';

    const data = { username, password };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        if (isSignUp) {
          setIsSignUp(false); 
        } else {
          setAuthToken(result.access_token); 
          console.log('Going home');
          navigate('/home'); 
        }
      } else {
        console.error(result.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('An error occurred:', err);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="card">
      <h4 className="title">{isSignUp ? 'Sign Up' : 'Log In'}</h4>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            autoComplete="off"
            id="logemail"
            name="username"
            placeholder="Username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <input
            autoComplete="off"
            id="logpass"
            name="password"
            placeholder="Password"
            className="input-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      <div>
        {isSignUp ? (
          <p onClick={() => setIsSignUp(false)} className="btn-link">
            Already have an account? Log in
          </p>
        ) : (
          <p onClick={() => setIsSignUp(true)} className="btn-link">
            Don't have an account? Sign up
          </p>
        )}
      </div>
    </div>
  );
};

export default Sign;
