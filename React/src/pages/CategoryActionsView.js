import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthStateContext } from "../components/UseAuthState";
import NavigationBar from "../components/NavigationHeader";
import InfoFooter from "../components/InfoFooter";
import ActionCard from "../components/ActionCard";
import { apiRequest } from "../utility/FetchAPI";

const CategoryActionsView = () => { 
  const { categoryName } = useParams();
  const [actions, setActions] = useState([]);
  const { authState } = useContext(AuthStateContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authState.initialized) return;

    const fetchActions = async () => {
      setLoading(true);
      setError(null);
      try {
        const allActions = await apiRequest("actions/getvisibleactions", "GET", authState.accessToken);
        const filteredActions = allActions.filter(action => 
          action.category && action.category.toLowerCase() === decodeURIComponent(categoryName).toLowerCase()
        );
        setActions(filteredActions);
      } catch (err) {
        console.error("Error fetching actions for category:", err);
        setError("Došlo je do greške prilikom učitavanja akcija.");
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [authState.initialized, authState.accessToken, categoryName]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 to-cyan-100">
      <NavigationBar showSearch={true} />

      <header className="text-center mt-16 mb-8 pt-10">
        <h1 className="text-4xl font-extrabold text-cyan-900 drop-shadow-md">
          Akcije u kategoriji: {decodeURIComponent(categoryName)}
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Pregled svih akcija u ovoj kategoriji.
        </p>
      </header>

      <div className="flex-grow px-6 pb-16 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            Učitavanje akcija...
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-lg mt-10">
            {error}
          </div>
        ) : actions.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            Trenutno nema aktivnih akcija u ovoj kategoriji.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action) => (
              <ActionCard key={action.id} action={action} />
            ))}
          </div>
        )}
      </div>

      <InfoFooter />
    </div>
  );
};

export default CategoryActionsView; 
