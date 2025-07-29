import React, { useContext, useEffect, useState } from "react";
import { AuthStateContext } from "../components/UseAuthState";
import NavigationBar from "../components/NavigationHeader";
import InfoFooter from "../components/InfoFooter";
import CategorySection from "../components/CategorySection";
import { apiRequest } from "../utility/FetchAPI";

function HomePage() {
  const [categorizedActions, setCategorizedActions] = useState({});
  const { authState } = useContext(AuthStateContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authState.initialized) {
      console.log("AuthState not initialized, skipping fetch.");
      return;
    }

    const fetchAndCategorizeActions = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Attempting to fetch actions...");
        const allActions = await apiRequest(
          "actions/getvisibleactions",
          "GET",
          authState.accessToken
        );
        console.log("Actions fetched successfully:", allActions);

        const grouped = allActions.reduce((acc, action) => {
          const category = action.category || "Ostalo";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(action);
          return acc;
        }, {});
        setCategorizedActions(grouped);
        console.log("Categorized actions:", grouped);
      } catch (err) {
        console.error("Error fetching actions in HomePage:", err); // Detaljnije logovanje
        setError(
          "Došlo je do greške prilikom učitavanja akcija. Provjerite konzolu za detalje."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAndCategorizeActions();
  }, [authState.initialized, authState.accessToken]);

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

        <div className="mt-4 flex flex-wrap justify-center gap-4 px-4">
          {[
            "Humanitarno",
            "Tehnologija",
            "Igrica",
            "Umjetnost",
            "Startup",
            "Knjiga",
            "Film",
            "Video",
            "Muzika",
            "Hrana",
            "Moda",
          ].map((category) => (
            <a
              key={category}
              href={`/category/${category}`}
              className="text-cyan-800 hover:text-cyan-600 font-medium transition duration-200"
            >
              {category}
            </a>
          ))}
        </div>

        <hr className="mt-4 border-t border-cyan-300 w-3/4 mx-auto" />
      </header>

      <div className="flex-grow px-6 pb-16 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            Učitavanje akcija...
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-lg mt-10">{error}</div>
        ) : Object.keys(categorizedActions).length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            Trenutno nema aktivnih akcija.
          </div>
        ) : (
          Object.keys(categorizedActions).map((categoryName) => (
            <CategorySection
              key={categoryName}
              categoryName={categoryName}
              actions={categorizedActions[categoryName]}
            />
          ))
        )}
      </div>

      <InfoFooter />
    </div>
  );
}

export default HomePage;
