import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useContext, useState, useEffect  } from "react";
import NavigationBar from '../components/NavigationHeader.js';
import InfoFooter from '../components/InfoFooter.js';
import { AuthStateContext } from "../components/UseAuthState.js";
import ImageGallery from '../components/ImageGallery.js';

function ActionViewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { action } = location.state || {};
  const [currentAction, setCurrentAction] = useState('');
  const [actionImages, setImages] = useState([]);
  const { authState, authDispatch } = useContext(AuthStateContext);

  //cekanje da se ucita stranica do kraja da se ne bi action bio null
  useEffect(() => {
  if (!action) return;

  fetch("http://podrzime.ddns.net:8080/api/actions/getaction?idAction=" + action.idAction, {
    method: "GET",
    headers: {
      "token": authState.accessToken,
    }
  })
    .then(res => res.json())
    .then(data => {
      setCurrentAction(data);
    })
    .catch(err => {
      console.error("Failed to fetch action:", err);
    });

     fetch("http://podrzime.ddns.net:8080/api/images/getactionimages?idAction=" + action.idAction, {
    method: "GET",
    headers: {
      "token": authState.accessToken,
    }
  })
    .then(res => res.json())
    .then(data => {
      setImages(data);
    })
    .catch(err => {
      console.error("Failed to fetch action:", err);
    });
  }, [action, authState.accessToken]);
  if (!currentAction) {
  return <div className="p-8 text-center text-gray-500">Učitavanje akcije...</div>;
  }
  const progress = Math.min(100, (currentAction.collected / currentAction.goal) * 100).toFixed(0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <NavigationBar showSearch={false} />
      
      <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto">
               {/* edit button */}
         <Link
           className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded float-right"
           to="/editAction"
        >
           Ažuriraj
         </Link>
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{currentAction.name}</h1>

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
                    progress < 50 ? 'bg-orange-400' : 'bg-green-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p
                className={`text-sm font-medium mb-4 ${
                  progress < 50 ? 'text-orange-500' : 'text-green-600'
                }`}
              >
                {progress}% prikupljeno
              </p>

              {/* Backers */}
              <p className="text-md font-medium text-gray-700 mb-6">
                👥 Broj podržavalaca: <span className="font-bold">{currentAction.backers || 0}</span>
              </p>
            </div>

            {/* Donate button */}
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded w-full"
              onClick={() => alert("Dodaj funkcionalnost donacije ovde")}
            >
              Doniraj
            </button>
          </div>
        </div>
        <p className="text-lg text-gray-700 mt-6">{currentAction.desc}</p>
      </main>

      <InfoFooter />
    </div>
  );
}

export default ActionViewPage;
