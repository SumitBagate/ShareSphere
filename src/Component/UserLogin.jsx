import React, { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../Auth';  // Import the AuthContext to use login functions
import './UserLogin.css';  // Add your custom styles if needed

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginWithEmail, loginWithGoogle } = useContext(AuthContext);  // Destructure the login methods from context

  // Handle email login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);  // Call loginWithEmail from AuthContext
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();  // Call loginWithGoogle from AuthContext
    } catch (error) {
      alert('Google login failed. Please try again.');
    }
  };

  return (
    <div className="user-login">
      <h2>Login</h2>
      {/* Email Login Form */}
      <form onSubmit={handleEmailLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Login with Email</button>
      </form>

      {/* Google Login Button */}
      <div className="google-login">
        <button onClick={handleGoogleLogin}>Login with Google</button>
      </div>
    </div>
  );
};

export default UserLogin;
