import React, { useState, useContext } from 'react';
import NavigationBar from './components/NavigationHeader';
import InfoFooter from './components/InfoFooter'
import { AuthStateContext } from './components/UseAuthState';


function ContactPage() {
  const { authState, authDispatch } = useContext(AuthStateContext);
  const [formData, setFormData] = useState({
    ime: '',
    email: '',
    poruka: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload={
      "name": formData.ime,
      "email":  formData.email,
      "messageText":  formData.poruka,
    };

 try {
      const response = await fetch('http://podrzime.ddns.net:8080/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           'token' : authState.accessToken
        },
        body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert('Hvala što ste nas kontaktirali!');
          setFormData({ ime: '', email: '', poruka: '' });
          } else {
            const errorText = await response.text();
            alert('Greška prilikom slanja poruke.');
            console.error('Greška:', errorText);
          }
        } catch (error) {
          console.error('Greška pri konekciji sa serverom:', error);
          alert('Došlo je do greške pri slanju.');
        }
      }; 
    

  return (
      <div className="bg-gray-100 flex flex-col min-h-screen justify-between">
        <NavigationBar showSearch={false} />
      <div className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-lg shadow-md max-w-2xl w-full p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Kontaktirajte nas</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="ime">Ime i prezime</label>
            <input
              type="text"
              id="ime"
              name="ime"
              value={formData.ime}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="poruka">Poruka</label>
            <textarea
              id="poruka"
              name="poruka"
              value={formData.poruka}
              onChange={handleChange}
              rows="5"
              className="w-full border border-gray-300 rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Pošalji poruku
          </button>
        </form>
      </div>
    </div>
    <InfoFooter />
    </div>

  );
}

export default ContactPage;
