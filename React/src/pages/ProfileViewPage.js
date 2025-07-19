// src/pages/ProfileViewPage.js
import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import NavigationBar from "../components/NavigationHeader";
import InfoFooter from "../components/InfoFooter";
import { AuthStateContext } from "../components/UseAuthState";
import { apiRequest } from "../utility/FetchAPI";

function ProfileViewPage() {
  const location = useLocation();
  const { idUser } = location.state || {};
  const { authState } = useContext(AuthStateContext);

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("fetchUserProfile pokrenut, idUser:", idUser);
      console.log("AccessToken u ProfileViewPage:", authState.accessToken);

      if (!idUser) {
        console.error("Korisnički ID nije pronađen u state-u.");
        setError("Korisnički ID nije pronađen.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await apiRequest(
          "users/showuserprofile?idUser="+idUser, 
          "GET",
          authState.accessToken
        );

        if (!data) {
          throw new Error("Profil korisnika nije pronađen.");
        }
        setUserProfile(data);
      } catch (err) {
        console.error("Greška pri dohvaćanju korisničkog profila:", err);
        setError(
          err.message ||
            "Došlo je do greške prilikom učitavanja korisničkog profila."
        );
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [idUser, authState.accessToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <NavigationBar showSearch={false} />
        <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto text-center text-gray-500">
          Učitavanje profila...
        </main>
        <InfoFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <NavigationBar showSearch={false} />
        <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto text-center text-red-500">
          Greška: {error}
        </main>
        <InfoFooter />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <NavigationBar showSearch={false} />
        <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto text-center text-gray-500">
          Korisnik nije pronađen.
        </main>
        <InfoFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <NavigationBar />
      <div className="flex-grow flex justify-center items-center px-4 py-12">
        <div className="bg-white p-8 rounded shadow max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Profil korisnika
          </h1>
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <img
                src={userProfile.imagePath || "https://via.placeholder.com/150"}
                alt={userProfile.displayName || "Korisnik"}
                className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500"
              />
            </div>
            <div>
              <p className="block text-sm text-gray-700 font-semibold">
                Ime za prikaz
              </p>
              <p className="text-lg text-gray-900">
                {userProfile.displayName || "Nije postavljeno"}
              </p>
            </div>
            <div>
              <p className="block text-sm text-gray-700 font-semibold">
                Email
              </p>
              <p className="text-lg text-gray-900">
                {userProfile.email || "Nije dostupno"}
              </p>
            </div>
            <div>
              <p className="block text-sm text-gray-700 font-semibold">
                Opis
              </p>
              <p className="text-lg text-gray-900 whitespace-pre-line">
                {userProfile.desc || "Nema opisa."}
              </p>
            </div>
          </div>
        </div>
      </div>
      <InfoFooter />
    </div>
  );
}

export default ProfileViewPage;