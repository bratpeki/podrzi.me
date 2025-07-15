import React, { useContext, useEffect, useState } from "react";
import { AuthStateContext } from "../components/UseAuthState";
import NavigationBar from "../components/NavigationHeader";
import InfoFooter from "../components/InfoFooter";
import ActionCard from "../components/ActionCard";

function HomePage() {

  const [actions, setActions] = useState([]);
  const { authState } = useContext(AuthStateContext);

  // Razlog za upotrebu efekta je da se rendering desi bez da čeka inicijalizaciju tokena
  // https://react.dev/learn/synchronizing-with-effects
  useEffect(() => {
    if (!authState.initialized) return;

    fetch("http://podrzime.ddns.net:8080/api/actions/getvisibleactions", {
      method: "GET",
      headers: {
        "token": authState.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setActions(data);
      })
      .catch((error) => {
        console.error("Error fetching actions:", error);
      });
    },
    // Ako se ijedan promjeni, useEffect se ponovo poziva
    [authState.initialized, authState.accessToken]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navigation Bar */}
      <NavigationBar showSearch={true} />

      {/* Header */}
      <header className="text-center mt-10 mb-6 pt-10">
        <h1 className="text-5xl font-bold text-gray-800">
          Pregled aktivnih akcija
        </h1>
      </header>

      {/* Cards Grid */}
      <div className="flex flex-wrap justify-center gap-6 px-15 pb-16 max-w-7xl mx-auto">
        {actions.map((action, index) => (
          <ActionCard key={index} action={action} />
        ))}
      </div>

      {/* Footer */}
      <InfoFooter />
    </div>
  );
}

export default HomePage;
