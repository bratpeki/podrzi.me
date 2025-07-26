import React, { useContext, useEffect, useState } from "react";
import { AuthStateContext } from "../components/UseAuthState";
import NavigationBar from "../components/NavigationHeader";
import InfoFooter from "../components/InfoFooter";
import ActionCard from "../components/ActionCard";
import { apiRequest } from "../utility/FetchAPI";

function HomePage() {
  const [actions, setActions] = useState([]);
  const { authState } = useContext(AuthStateContext);
  const [retryCount, setRetryCount] = useState(0);
  const [user,setUser] = useState(0);

  // Razlog za upotrebu efekta je da se rendering desi bez da čeka inicijalizaciju tokena
  // https://react.dev/learn/synchronizing-with-effects
  useEffect(
    () => {
      
      if (!authState.initialized) return;
      apiRequest("actions/getvisibleactions", "GET", authState.accessToken)
        .then((res) => res)
        .then((data) => {
          setActions(data);
        })
        .catch((error) => {
          console.error("Error fetching actions:", error);
        });
    },
    // Ako se ijedan promjeni, useEffect se ponovo poziva
    [authState.initialized, retryCount, authState]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 to-cyan-100">
      <NavigationBar showSearch={true} />

      <header className="text-center mt-16 mb-8 pt-10">
        <h1 className="text-4xl font-extrabold text-cyan-900 drop-shadow-md">
          Aktivne Akcije
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Podržite akcije koje vas inspirišu
        </p>
      </header>

      <div className="flex-grow px-6 pb-16 max-w-7xl mx-auto">
        {actions.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            Trenutno nema aktivnih akcija.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action, index) => (
              <ActionCard key={index} action={action} />
            ))}
          </div>
        )}
      </div>

      <InfoFooter />
    </div>
  );
}

export default HomePage;
