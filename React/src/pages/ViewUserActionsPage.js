import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import NavigationBar from "../components/NavigationHeader";
import InfoFooter from "../components/InfoFooter";
import ActionCard from "../components/ActionCard"; 
import { apiRequest } from "../utility/FetchAPI";
import { AuthStateContext } from "../components/UseAuthState"; 

function ViewUserActionsPage() {
  const location = useLocation();
  const { id } = location.state || {};
  const [userActions, setUserActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthStateContext); 

  useEffect(() => {
    const fetchUserActions = async () => {

      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest(
          `actions/getuseractions?idUser=${id}`, // TODO
          "GET",
          authState.accessToken 
        );

        if (!response || response.length === 0) { // Provjera da li je odgovor prazan ili null jelte
          setUserActions([]); 
          setLoading(false);
          return;
        }

        setUserActions(response);
      } catch (err) {
        console.error("Greška pri dohvatanju akcija korisnika:", err);
        setError("Došlo je do greške pri učitavanju akcija.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserActions();
  }, [id, authState]); 

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <NavigationBar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Akcije koje je korisnik kreirao
        </h1>

        {loading && <p className="text-center">Učitavanje akcija...</p>}
        {error && (
          <p className="text-center text-red-500">Greška: {error}</p>
        )}
        {!loading && !error && userActions.length === 0 && (
          <p className="text-center text-gray-600">
            Korisnik još nije kreirao nijednu akciju.
          </p>
        )}
        {!loading && !error && userActions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userActions.map((action) => (
              <ActionCard key={action.idAction} action={action} />
            ))}
          </div>
        )}
      </div>
      <InfoFooter />
    </div>
  );
}

export default ViewUserActionsPage;