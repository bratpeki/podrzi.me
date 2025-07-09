// src/LoginPage.js
import React, { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

 const handleLogin = async () => {
  try {
    const url = `http://localhost:8080/api/users/userauth?username=${email}&password=${(password)}`;
    
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const text = await response.text(); // use .text() instead of .json()
    setResponseMessage(text); // you can show this to the user
  } catch (error) {
    setResponseMessage('Login failed. Please check your credentials.');
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10">
      <h1 className="text-4xl font-bold text-cyan-600 mb-8">PODRZI.ME</h1>

      <div className="w-full max-w-md bg-white p-8 shadow-md rounded border">
        <h2 className="text-2xl font-semibold mb-6">Log in</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border border-cyan-500 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="text-right text-sm mb-4">
          <a href="#" className="text-blue-600 hover:underline">Forgot your password?</a>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 mb-4"
        >
          Log in
        </button>

        <button
          className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 mb-4"
        >
          Log in as guest
        </button>

        {responseMessage && (
          <p className="text-center text-sm text-red-600 mb-2">{responseMessage}</p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
