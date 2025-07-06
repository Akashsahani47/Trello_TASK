import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContent';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'qwertyuiop'; 

const Login = () => {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AppContent);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
    const payload = authMode === 'signup' ? { email, password, age } : { email, password };

    const encryptedPayload = CryptoJS.AES.encrypt(JSON.stringify(payload), SECRET_KEY).toString();

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: encryptedPayload })
      });

      const encryptedText = await res.text();
      const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      const decrypted = JSON.parse(decryptedText);

      if (decrypted.token) {
        login(decrypted.token, decrypted.role || 'user'); // Default role fallback
        navigate('/dashboard');
      } else {
        alert(decrypted.message || 'Login failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>

          {authMode === 'signup' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            {authMode === 'signup' ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {authMode === 'signup' ? (
            <>
              Already have an account?{' '}
              <span
                className="text-blue-500 cursor-pointer underline"
                onClick={() => setAuthMode('login')}
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <span
                className="text-blue-500 cursor-pointer underline"
                onClick={() => setAuthMode('signup')}
              >
                Sign up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
