import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import NavigationBar from "../components/NavigationHeader.js";
import InfoFooter from "../components/InfoFooter.js";
import { AuthStateContext } from "../components/UseAuthState.js";
import ImageGallery from "../components/ImageGallery.js";
import { apiRequest } from "../utility/FetchAPI.js";
import { jwtDecode } from "jwt-decode";

function ActionViewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};
  const [currentAction, setCurrentAction] = useState("");
  const [actionImages, setImages] = useState([]);
  const { authState, authDispatch } = useContext(AuthStateContext);
  const [IsOwner, setIsOwner] = useState(false);
  const [Owners, setOwners] = useState([]);

  //cekanje da se ucita stranica do kraja da se ne bi action bio null
  useEffect(() => {
    if (!id) return;

    apiRequest(
      "actions/getaction?idAction=" + id,
      "GET",
      authState.accessToken
    )
      .then((res) => res)
      .then((data) => {
        setCurrentAction(data);
        setOwners(data.actionOwners);

        const decoded = jwtDecode(authState.accessToken);

        const isOwner = !!data.actionOwners.find(
          (owner) => owner.idUser === decoded.id
        );

        setIsOwner(isOwner);

        console.log(
          decoded.id,
          data.actionOwners.map((o) => o.idUser),
          isOwner
        );
      })
      .catch((err) => {
        console.error("Failed to fetch action:", err);
      });

    apiRequest(
      "images/getactionimages?idAction=" + id,
      "GET",
      authState.accessToken
    )
      .then((res) => res)
      .then((data) => {
        setImages(data);
      })
      .catch((err) => {
        console.error("Failed to fetch action:", err);
      });

    //setOwner(apiRequest("actions/validateuser?idAction="+action.idAction,"GET",authState.accessToken));
  }, [id, authState.accessToken]);
  if (!currentAction) {
    return (
      <div className="p-8 text-center text-gray-500">Učitavanje akcije...</div>
    );
  }
  const progress = Math.min(
    100,
    (currentAction.collected / currentAction.goal) * 100
  ).toFixed(0);

  //Funkcija za prikaz

  const showCollaborations = () => {
    const owner = currentAction.actionOwners.filter((o) => !o.isCollab);
    const collaborators = currentAction.actionOwners.filter((o) => o.isCollab);

    if (
      !currentAction ||
      !currentAction.actionOwners ||
      currentAction.actionOwners.length === 0
    ) {
      return null;
    }

    return (
      <div className="mt-10 p-4 bg-white rounded shadow">
        <h2 className="text-x1 font-extrabold text-gray-800 mb-2">Vlasnik</h2>
        <ul className="list-none p-0 space-y-2">
          {owner.map((owner) => (
            <li key={owner.idUser} className="flex items-center gap-3">
              <img
                src={owner.imagePath}
                alt={owner.displayName}
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span>{owner.displayName}</span>
            </li>
          ))}
        </ul>
        {collaborators.length > 0 && (
          <>
            <h2 className="text-x1 font-extrabold text-gray-800 mb-2">
              Kolaboratori
            </h2>
            <ul className="list-none p-0 space-y-2">
              {collaborators.map((owner) => (
                <li key={owner.idUser} className="flex items-center gap-3">
                  <img
                    src={owner.imagePath}
                    alt={owner.displayName}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span>{owner.displayName}</span>
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
        {/* edit button */}
        {IsOwner && (
          <Link
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded float-right"
            to={`/editAction/${currentAction.idAction}`}
            state={{ id }}
          >
            Ažuriraj
          </Link>
        )}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {currentAction.name}
        </h1>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: Image */}
          <div className="md:w-3/3">
            <ImageGallery images={actionImages} />
          </div>

          {/* Right: Details */}
          <div className="md:max-w-2/3 w-2/3 bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
            {/* Amount info */}
            <div>
              <p className="text-xl font-bold text-gray-700 mb-2">
                {currentAction.collected.toLocaleString()}€ prikupljeno
              </p>
              <p className="text-sm text-gray-600 mb-4">
                od ciljanih {currentAction.goal.toLocaleString()}€
              </p>

              {/* Progress bar */}
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

              {/* Backers */}
              <p className="text-md font-medium text-gray-700 mb-6">
                👥 Broj podržavalaca:{" "}
                <span className="font-bold">{currentAction.backers || 0}</span>
              </p>
            </div>

            {/* Donate button */}
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded w-full"
              onClick={() => alert("Dodaj funkcionalnost donacije ovde")}
            >
              Doniraj
            </button>
            {showCollaborations()}
          </div>
        </div>
        <p className="text-lg text-gray-700 mt-6">{currentAction.desc}</p>
      </main>

      <InfoFooter />
    </div>
  );
}

export default ActionViewPage;
