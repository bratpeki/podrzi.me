import { useContext, useEffect, useState } from 'react';
import NavigationBar from '../components/NavigationHeader';
import InfoFooter from '../components/InfoFooter';
import { AuthStateContext } from '../components/UseAuthState';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { authState } = useContext(AuthStateContext);
  const [user, setUser] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://podrzime.ddns.net:8080/api/users/showprofile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'token': authState.accessToken,
          },
        });

        if (!res.ok) 
          throw new Error('Neuspješan dohvatanje profila');

        const data = await res.json();


        setUser({
          "imagePath": data.imagePath,
          "username": data.username,
          "displayName": data.displayName,
          "email": data.email,
          "desc": data.desc,
        });
      } catch (err) {
        console.error('Greška pri učitavanju profila:', err);
        setTimeout(() => setRetryCount((prev) => prev + 1), 2000);
      }
    };

    if (authState?.accessToken) fetchProfile();
  }, [authState,retryCount]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
        <NavigationBar />
        <div className="flex-grow flex items-center justify-center">
          <p>Učitavanje profila...</p>
        </div>
        <InfoFooter />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <NavigationBar />

      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-lg shadow-md max-w-2xl w-full p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Moj profil</h1>

          <div className="flex flex-col items-center space-y-4">
            <img
              src={user.imagePath}
              alt="Profilna slika"
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow"
            />

            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold text-gray-800">{user.displayName}</h2>
              <p className="text-gray-500">@{user.username}</p>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>

            <div className="mt-4 w-full">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Opis profila</h3>
              <p className="text-gray-700 bg-gray-100 rounded p-4">
                {user.desc}
              </p>
            </div>

            <div className="mt-6 w-full text-right">
              <button
                 onClick={() => navigate('/EditProfilePage')}
                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                 Uredi profil
              </button>
            </div>
          </div>
        </div>
      </div>
      <InfoFooter />
    </div>
  );
}

export default ProfilePage;
