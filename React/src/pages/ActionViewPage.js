import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom"; // Uklonjena useLocation
import { useContext, useState, useEffect } from "react";
import NavigationBar from "../components/NavigationHeader.js";
import InfoFooter from "../components/InfoFooter.js";
import { AuthStateContext } from "../components/UseAuthState.js";
import ImageGallery from "../components/ImageGallery.js";
import { apiRequest } from "../utility/FetchAPI.js";
import { jwtDecode } from "jwt-decode";
import DonateFormModal from "../components/DonateFormModal.js"; // <-- Importuj novu komponentu

function ActionViewPage() {
  const navigate = useNavigate();
  const { id: actionIdFromUrl } = useParams();
  const { authState } = useContext(AuthStateContext);

  const [currentAction, setCurrentAction] = useState(null);
  const [actionImages, setImages] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loadingAction, setLoadingAction] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false); 

  // Funkcija za dohvaćanje detalja akcije i slika
  // Izdvojena u posebnu funkciju da se može ponovo pozvati
  const fetchActionData = async () => {
    if (!actionIdFromUrl || !authState.accessToken) {
      setLoadingAction(false);
      return;
    }

    setLoadingAction(true);
    try {
      const actionData = await apiRequest(
        `actions/getaction?idAction=${actionIdFromUrl}`,
        "GET",
        authState.accessToken
      );
      setCurrentAction(actionData);

      if (authState.accessToken && actionData.actionOwners) {
        const decoded = jwtDecode(authState.accessToken);
        const ownerFound = actionData.actionOwners.find(
          (owner) => owner.idUser === decoded.id
        );
        setIsOwner(!!ownerFound);
      } else {
        setIsOwner(false);
      }

      // Dohvaćanje slika unutar iste funkcije (ili pozvati zasebno, ali ovo je efikasno)
      const imageData = await apiRequest(
        `images/getactionimages?idAction=${actionIdFromUrl}`,
        "GET",
        authState.accessToken
      );
      setImages(imageData);

    } catch (err) {
      console.error("Failed to fetch action details or images:", err);
      setCurrentAction(null);
      setImages([]);
    } finally {
      setLoadingAction(false);
    }
  };

  // Efekat za početno dohvaćanje podataka i ponovno dohvaćanje
  // kad se promeni ID akcije u URL-u ili token
  useEffect(() => {
    fetchActionData();
  }, [actionIdFromUrl, authState.accessToken]); // Dodaj actionIdFromUrl i authState.accessToken kao dependencies

  // Callback funkcija za uspješnu donaciju
  const handleDonationSuccess = () => {
    // Ponovo dohvati podatke o akciji kako bi se prikazali ažurirani iznosi
    fetchActionData();
  };

  // Prikaz učitavanja
  if (loadingAction) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <NavigationBar showSearch={false} />
        <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto text-center text-gray-500">
          Učitavanje akcije...
        </main>
        <InfoFooter />
      </div>
    );
  }

  // Prikaz poruke ako akcija nije pronađena nakon učitavanja
  if (!currentAction) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <NavigationBar showSearch={false} />
        <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto text-center text-gray-500">
          Akcija nije pronađena ili je došlo do greške pri učitavanju.
        </main>
        <InfoFooter />
      </div>
    );
  }

  const progress = Math.min(
    100,
    (currentAction.collected / currentAction.goal) * 100
  ).toFixed(0);

  const showCollaborations = () => {
    if (!currentAction.actionOwners || currentAction.actionOwners.length === 0) {
      return null;
    }
    const owner = currentAction.actionOwners.filter((o) => !o.isCollab);
    const collaborators = currentAction.actionOwners.filter((o) => o.isCollab);

    return (
      <div className="mt-10 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-extrabold text-gray-800 mb-2">Vlasnik</h2>
        <ul className="list-none p-0 space-y-2">
          {owner.map((o) => (
            <li key={o.idUser} className="flex items-center gap-3">
              <img
                src={o.imagePath}
                alt={o.displayName}
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span>{o.displayName}</span>
            </li>
          ))}
        </ul>
        {collaborators.length > 0 && (
          <>
            <h2 className="text-xl font-extrabold text-gray-800 mt-4 mb-2">
              Kolaboratori
            </h2>
            <ul className="list-none p-0 space-y-2">
              {collaborators.map((c) => (
                <li key={c.idUser} className="flex items-center gap-3">
                  <img
                    src={c.imagePath}
                    alt={c.displayName}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span>{c.displayName}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavigationBar showSearch={false} />

      <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto">
        {isOwner && (
          <Link
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded float-right"
            to={`/editAction/${currentAction.idAction}`}
            state={{ action: currentAction }}
          >
            Ažuriraj
          </Link>
        )}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {currentAction.name}
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-3/3">
            <ImageGallery images={actionImages} />
          </div>

          <div className="md:max-w-2/3 w-2/3 bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
            <div>
              <p className="text-xl font-bold text-gray-700 mb-2">
                {currentAction.collected.toLocaleString()}€ prikupljeno
              </p>
              <p className="text-sm text-gray-600 mb-4">
                od ciljanih {currentAction.goal.toLocaleString()}€
              </p>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full ${
                    progress < 50 ? "bg-orange-400" : "bg-green-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p
                className={`text-sm font-medium mb-4 ${
                  progress < 50 ? "text-orange-500" : "text-green-600"
                }`}
              >
                {progress}% prikupljeno
              </p>

              <p className="text-md font-medium text-gray-700 mb-6">
                👥 Broj podržavalaca:{" "}
                <span className="font-bold">{currentAction.backers || 0}</span>
              </p>
            </div>

            {/* Dugme koje otvara modal */}
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded w-full"
              onClick={() => setShowDonateModal(true)} // <-- Otvori modal
            >
              Doniraj
            </button>
            {showCollaborations()}
          </div>
        </div>
        <p className="text-lg text-gray-700 mt-6">{currentAction.desc}</p>
      </main>

      <InfoFooter />

      {/* Uslovno renderovanje DonateFormModal-a */}
      {showDonateModal && currentAction && ( // <-- Prikazuje se modal samo ako treba, ili ako je akcija uspješno učitana
        <DonateFormModal
          action={currentAction} 
          onClose={() => setShowDonateModal(false)} 
          onDonationSuccess={handleDonationSuccess} 
        />
      )}
    </div>
  );
}

export default ActionViewPage;