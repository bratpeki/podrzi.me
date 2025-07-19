import { useContext, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import NavigationBar from "../components/NavigationHeader";
import InfoFooter from "../components/InfoFooter";
import { AuthStateContext } from "../components/UseAuthState";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utility/FetchAPI";
import ActionCard from "../components/ActionCard";

// Koristili smo ActionCard.js za prikaz akcija korisnika

function ViewProfilePage() {
  const location = useLocation();
  const { id } = location.state || {};
  const { authState } = useContext(AuthStateContext);
  const [user, setUser] = useState(null);
  const [actions, setActions] = useState([]); 
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndActions = async () => {
      try {
        const userRes = await apiRequest(
          "users/showuserprofile?idUser=" + id,
          "GET",
          authState.accessToken
        );
        if (!userRes) throw new Error("Neuspješno dohvaćanje profila");
        setUser({
          imagePath: userRes.imagePath,
          username: userRes.username,
          displayName: userRes.displayName,
          email: userRes.email,
          desc: userRes.desc,
          idUser: userRes.idUser,
        });

        const actionsRes = await apiRequest(
          `actions/getuseractions?idUser=${id}`,
          "GET",
          authState.accessToken
        );

        if (actionsRes) {
            if (Array.isArray(actionsRes)) {
                setActions(actionsRes);
            } else if (typeof actionsRes === 'object' && actionsRes !== null) {
                setActions([actionsRes]);
            } else {
                setActions([]);
            }
        } else {
            setActions([]);
        }

      } catch (err) {
        console.error("Greška pri učitavanju profila ili akcija:", err);
        setTimeout(() => setRetryCount((prev) => prev + 1), 2000);
      }
    };

    if (authState?.accessToken && id) {
      fetchProfileAndActions();
    }
  }, [authState, retryCount, id]);

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
        <div className="bg-white rounded-lg shadow-md max-w-5xl w-full p-8"> 
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Profil korisnika
          </h1>

          <div className="flex flex-col items-center space-y-4">
            <img
              src={user.imagePath}
              alt="Profilna slika"
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow"
            />

            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold text-gray-800">
                {user.displayName}
              </h2>
              <p className="text-gray-500">@{user.username}</p>
            </div>

            <div className="mt-4 w-full">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Opis profila
              </h3>
              <p className="text-gray-700 bg-gray-100 rounded p-4">
                {user.desc}
              </p>
            </div>

            <div className="mt-6 w-full">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Akcije korisnika
              </h3>
              {actions.length > 0 ? (
                
                <div className="h-96 overflow-y-auto pr-2 custom-scrollbar">

                    <div className="flex flex-wrap justify-center gap-6"> 
                        {actions.map((actionItem) => (
                            <ActionCard key={actionItem.idAction} action={actionItem} />
                        ))}
                    </div>
                </div>
              ) : (
                <p className="text-gray-600">Ovaj korisnik još nema kreiranih akcija.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <InfoFooter />
    </div>
  );
}

export default ViewProfilePage;