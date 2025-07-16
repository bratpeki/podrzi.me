import React, {useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthStateContext } from "../components/UseAuthState";
import { apiRequest } from '../utility/FetchAPI';

function RegisterPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const { authState, authDispatch } = useContext(AuthStateContext);

 const handleRegister = async () => {
  try {
    const response = await apiRequest("users/adduser",'POST',null,{
      "email": email,
      "username": username,
      "password": password,
      "displayName": displayName
    });
    
    const text = await response;
    if(text == "success"){
         const response = await fetch("http://podrzime.ddns.net:8080/api/users/userauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "username": username,
          "password": password,
        }),
      });
      const text1 = await response.text();
      authDispatch({
          type: "login",
          payload: {
            accessToken: text1,
          },
        });
       navigate('/home')
    }
    else if (text == "emailError"){
      setResponseMessage('E-Mail je vec zauzet! Molimo Vas unesite drugu E-Mail adresu!');
    }
    else if (text == "invalidDataError"){
      setResponseMessage('Podaci nisu validni! Molimo provjerite podatke ponovo!');
    }
    else if (text == "usernameError"){
      setResponseMessage('Korisnicko ime je vec zauzeto! Molimo Vas unesite drugo korisnicko ime!')
    }
    else if (text == "displayNameError"){
      setResponseMessage('Prikazno ime je vec zauzeto! Molimo Vas unesite drugo prikazno ime!')
    }
}catch (error) {
    setResponseMessage('Registracija neuspjesna!');
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10">
      <h1 className="text-4xl font-bold text-cyan-600 mb-8">PODRZI.ME</h1>

      <div className="w-full max-w-md bg-white p-8 shadow-md rounded border">
        <div className="text-center mb-4 text-sm">
          Vec imate nalog?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Prijavi se
          </Link>
        </div>

        <h2 className="text-2xl font-semibold mb-6"><center>Registracija</center></h2>

         <input
          type="email"
          placeholder="E-Mail"
          className="w-full mb-4 p-2 border border-cyan-600 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Korisnicko ime"
          className="w-full mb-4 p-2 border border-cyan-600 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

         <input
          type="text"
          placeholder="Prikazno ime"
          className="w-full mb-4 p-2 border border-cyan-600 rounded"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Lozinka"
          className="w-full mb-4 p-2 border border-cyan-600 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Potrvdi lozinku"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          className="w-full mb-10 p-2 border border-cyan-600 rounded"
          required
        />

        <button
         onClick={handleRegister}
         className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Napravi nalog
        </button>

        {responseMessage && (
          <p className="text-center text-sm text-red-600 mb-2">{responseMessage}</p>
        )}

        <p className="text-xs text-gray-600 text-center mt-4">
          Registrovanjem prihvatate nasu {' '}
          <a href="#" className="text-blue-600 underline">
            Policu privatnosti
          </a>{' '}
          i{' '}
          <a href="#" className="text-blue-600 underline">
            Uslove koriscenja
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
