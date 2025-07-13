import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import InfoFooter from './InfoFooter';

function ActionViewPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { action } = location.state || {};

  if (!action) {
    return (
      <div className="p-8 text-center text-xl text-red-600">
        Greška: Akcija nije pronađena.
        <br />
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-700 text-white px-4 py-2 rounded"
        >
          Nazad
        </button>
      </div>
    );
  }

  const progress = Math.min(100, (action.collected / action.goal) * 100).toFixed(0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavigationBar showSearch={false} />

      <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{action.name}</h1>

        {/*Two-column layout */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: Image */}
          <div className="md:w-2/3">
            <img
              src="https://placehold.co/800x400?text=Akcija"
              alt="Slika akcije"
              className="w-full rounded-lg shadow"
            />

            <p className="text-lg text-gray-700 mt-6">{action.desc}</p>
          </div>

          {/* Right: Details */}
          <div className="md:max-w-2/3 bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
            {/* Amount info */}
            <div>
              <p className="text-xl font-bold text-gray-700 mb-2">
                {action.collected.toLocaleString()}€ prikupljeno
              </p>
              <p className="text-sm text-gray-600 mb-4">
                od ciljanih {action.goal.toLocaleString()}€
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
                👥 Broj podržavalaca: <span className="font-bold">{action.backers || 0}</span>
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
      </main>

      <InfoFooter />
    </div>
  );
}

export default ActionViewPage;
