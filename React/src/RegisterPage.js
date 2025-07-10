// src/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

 const handleRegister = async () => {
  try {
    const url = 'http://podrzime.ddns.net:8080/api/users/adduser'
    const response = await fetch(url, {
      method: 'POST',
    headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "email": email,
    "username": username,
    "password": password,
    "displayname": displayName
  })
    });
    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const text = await response.text(); 
    if(text == "success"){
       navigate('/home')
    }
    else if (text == "emailerror"){
      setResponseMessage('Email taken. Please Choose a different email');
    }
    else if (text == "usernameerror"){
      setResponseMessage('Username taken. Please Choose a different username')
    }
    else if (text == "displaynameerror"){
      setResponseMessage('Display name taken. Please choose a different display name')
    }
}catch (error) {
    setResponseMessage('register failed. Please check your credentials.');
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10">
      <h1 className="text-4xl font-bold text-cyan-600 mb-8">PODRZI.ME</h1>

      <div className="w-full max-w-md bg-white p-8 shadow-md rounded border">
        <div className="text-center mb-4 text-sm">
          Have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Sign up</h2>

         <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border border-cyan-600 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-2 border border-cyan-600 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

         <input
          type="text"
          placeholder="Display Name"
          className="w-full mb-4 p-2 border border-cyan-600 rounded"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
       
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border border-cyan-600 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-6 p-2 border border-cyan-600 rounded"
        />

        <button
         onClick={handleRegister}
         className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Create account
        </button>

        {responseMessage && (
          <p className="text-center text-sm text-red-600 mb-2">{responseMessage}</p>
        )}

        <p className="text-xs text-gray-600 text-center mt-4">
          By signing up, you agree to our{' '}
          <a href="#" className="text-blue-600 underline">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 underline">
            Terms of Use
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
