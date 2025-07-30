import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../components/NavigationHeader";
import InfoFooter from "../components/InfoFooter";
import { AuthStateContext } from "../components/UseAuthState";
import { apiRequest } from "../utility/FetchAPI";
import ActionCard from "../components/ActionCard";
import { jwtDecode } from "jwt-decode";
import ReportDialog from "../components/ReportDialog";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import defaultUser from "../Images/defaultUser.png";

function ViewProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState } = useContext(AuthStateContext);
  const [user, setUser] = useState(null);
  const [actions, setActions] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [reportContext, setReportContext] = useState(null);
  const sweetAlert = withReactContent(Swal);
  const { id: urlId } = useParams();

  const tokenId = authState?.accessToken
    ? jwtDecode(authState.accessToken).id
    : null;
  const viewedId = location.state?.id || urlId || tokenId;
  const isOwnProfile = tokenId === viewedId;

  const fetchUserProfile = async () => {
    try {
      const endpoint =
        tokenId === viewedId
          ? "users/showprofile"
          : `users/showuserprofile?idUser=${viewedId}`;

      const res = await apiRequest(endpoint, "GET", authState?.accessToken);

      if (!res) throw new Error("Neuspješno dohvaćanje profila");

      setUser({
        imagePath: res.imagePath,
        username: res.username,
        displayName: res.displayName,
        email: res.email,
        desc: res.desc,
        idUser: res.idUser,
      });

      const actionsRes = await apiRequest(
        `actions/getuseractions?idUser=${viewedId}`,
        "GET",
        authState?.accessToken
      );

      setActions(Array.isArray(actionsRes) ? actionsRes : []);
    } catch (err) {
      console.error("Greška pri učitavanju profila:", err);
      setTimeout(() => setRetryCount((prev) => prev + 1), 2000);
    }
  };
  const handleReportUser = (userId) => {
    setReportContext({ type: 0, id: userId }); // type 0 = user
  };

  const confirmReport = async (reason) => {
    if (!reportContext) return;

    try {
      const res = await apiRequest(
        "reports/create",
        "POST",
        authState.accessToken,
        {
          reportType: reportContext.type,
          idReported: reportContext.id,
          text: reason,
        }
      );

      if (res !== "success") {
        throw new Error("Desila se greška prilikom kreiranja prijave.");
      }
    } catch (error) {
      await sweetAlert.fire({
        title: "Greška!",
        text: error.message,
        icon: "error",
        confirmButtonText: "U redu",
      });
    } finally {
      setReportContext(null);
    }
  };

  useEffect(() => {
    if (viewedId) fetchUserProfile();
  }, [retryCount, viewedId]);

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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between gradient-style">
      <NavigationBar />

      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="relative bg-white rounded-lg shadow-md max-w-5xl w-full p-8 mt-20">
          {!isOwnProfile && authState.accessToken && (
            <button
              onClick={() => handleReportUser(user.idUser)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition absolute top-4 right-4  py-2 px-4  shadow-lg"
            >
              Prijavi korisnika
            </button>
          )}

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {isOwnProfile ? "Moj profil" : "Profil korisnika"}
          </h1>

          <div className="flex flex-col items-center space-y-4">
            <img
              src={user.imagePath ? user.imagePath : defaultUser}
              alt="Profilna slika"
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow"
            />

            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold text-gray-800">
                {user.displayName}
              </h2>
              <p className="text-gray-500">@{user.username}</p>
              {isOwnProfile && (
                <p className="text-gray-600 text-sm">{user.email}</p>
              )}
            </div>

            <div className="mt-4 w-full">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Opis profila
              </h3>
              <p className="text-gray-700 bg-gray-100 rounded p-4">
                {user.desc}
              </p>
            </div>

            {isOwnProfile && (
              <div className="mt-6 w-full flex justify-between">
                <button
                  onClick={() =>
                    navigate("/viewDonations", {
                      state: { idUser: user.idUser },
                    })
                  }
                  className="button-style"
                >
                  Pregled donacija
                </button>

                <button
                  onClick={() => navigate("/EditProfile")}
                  className="button-style"
                >
                  Uredi profil
                </button>
              </div>
            )}

            <div className="mt-6 w-full">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Akcije korisnika
              </h3>
              {actions.length > 0 ? (
                <div className="h-96 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex flex-wrap justify-center gap-6">
                    {actions.map((actionItem) => (
                      <ActionCard
                        key={actionItem.idAction}
                        action={actionItem}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  Ovaj korisnik još nema kreiranih akcija.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <InfoFooter />
      <ReportDialog
        show={reportContext !== null}
        onClose={() => setReportContext(null)}
        onConfirm={confirmReport}
      />
    </div>
  );
}

export default ViewProfilePage;
