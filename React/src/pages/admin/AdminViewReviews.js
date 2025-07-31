import { useEffect, useState, useContext } from "react";
import { apiRequest } from "../../utility/FetchAPI";
import { AuthStateContext } from "../../components/UseAuthState";
import AdminHeader from "./AdminHeader";

function AdminViewReviews() {
  const { authState } = useContext(AuthStateContext);
  const [allReviews, setAllReviews] = useState([]);
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await apiRequest(
          "reviews/getall",
          "GET",
          authState.adminToken
        );
        setAllReviews(fetchedReviews);

        // Fetch user names in parallel
        const uniqueUserIds = [...new Set(fetchedReviews.map((r) => r.idUser))];

        const namesMap = {};
        await Promise.all(
          uniqueUserIds.map(async (id) => {
            try {
              const nameRes = await apiRequest(
                `users/getnamebyid?idUser=${id}`,
                "GET",
                authState.adminToken
              );
              namesMap[id] = nameRes || "Nepoznat";
            } catch (err) {
              namesMap[id] = "Nepoznat";
            }
          })
        );
        setUserNames(namesMap);
      } catch (err) {
        console.error("Failed to fetch reviews or names:", err);
      }
    };

    if (authState.adminToken) {
      fetchReviews();
    }
  }, [authState.adminToken]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10 gradient-style">
      <AdminHeader />

      <div className="mt-16" />

      <div className="flex flex-col bg-white rounded-lg shadow-md w-2/5 h-full p-8 mt-2 items-center justify-center p-20">
        <h1 className="text-4xl font-bold text-cyan-900 mb-8 drop-shadow-md">
          Pregled recenzija
        </h1>
        <div className="flex flex-col items-center w-full">
          {allReviews.length > 0 ? (
            <ul className="w-full text-center">
              {allReviews.map((review) => (
                <li
                  key={review.idReview}
                  className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded shadow-sm text-lg text-gray-700"
                >
                  <div className="text-left">
                    <p className="font-semibold">
                      {userNames[review.idUser]
                        ? `${userNames[review.idUser]} (ID: ${review.idUser})`
                        : `ID: ${review.idUser}`}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i <= review.stars
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 mt-1">{review.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Nema pronađenih recenzija.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminViewReviews;
