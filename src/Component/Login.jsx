import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth';
import { FcGoogle } from 'react-icons/fc'; // Google icon
import Register from './Register';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { loginWithEmail, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const userCredential = await loginWithEmail(email, password);
      const token = await userCredential.user.getIdToken(); // 🔐 get token
      localStorage.setItem('authToken', token); // 💾 store token
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await loginWithGoogle();
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', token); // 🔐 Save token to localStorage
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500"
          >
            <FcGoogle className="mr-2 text-xl" /> Login with Google
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600">Don't have an account?</p>
          <Link to="/Register" className="text-indigo-600 hover:underline font-medium">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
