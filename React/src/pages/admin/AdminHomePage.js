import NavigationBar from "../../components/NavigationHeader";
import { useNavigate, Link } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import { apiRequest } from "../../utility/FetchAPI";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AuthStateContext } from "../../components/UseAuthState.js";
import { useContext, useState, useEffect } from "react";

function AdminHomePage() {
  const navigate = useNavigate();
  const sweetAlert = withReactContent(Swal);
  const { authState } = useContext(AuthStateContext);
  const [isOwner, setIsOwner] = useState(null);

  useEffect(() => {
    if (!authState.initialized) return;
    const checkOwnership = async () => {
      try {
        const res = await apiRequest(
          "admins/getowner",
          "GET",
          authState.adminToken
        );
        if (res) {
          console.log("Setting isOwner to true");
          setIsOwner(true);
        }
      } catch (err) {
        console.error("Failed to check owner status:", err);
      }
    };

    if (authState?.adminToken) {
      checkOwnership();
    }
  }, [authState.adminToken]);

  const handleCreateGlobalNotification = async () => {
    const result = await sweetAlert.fire({
      title: "Kreiraj globalnu notifikaciju",
      input: "textarea",
      inputPlaceholder: "Unesite tekst notifikacije...",
      showCancelButton: true,
      confirmButtonText: "Pošalji",
      cancelButtonText: "Otkaži",
      customClass: {
        confirmButton: "button-style",
        cancelButton: "button-style",
      },
    });

    const text = result.value;

    if (result.isConfirmed && text?.trim()) {
      try {
        const res = await apiRequest(
          `admins/sendall?text=${text}`,
          "POST",
          authState.adminToken
        );

        if (res === "success") {
          await sweetAlert.fire({
            title: "Uspješno!",
            text: "Globalna notifikacija je poslana.",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "button-style",
            },
          });
        } else {
          throw new Error("Neuspješno slanje.");
        }
      } catch (err) {
        console.error("Greška pri slanju:", err);
        await sweetAlert.fire({
          title: "Greška!",
          text: err.message || "Došlo je do greške.",
          icon: "error",
          confirmButton: "U redu",
          customClass: {
            confirmButton: "button-style",
          },
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start gradient-style relative">
      <AdminHeader />
      <div className="mt-16"></div>

      <div className="flex flex-col bg-white rounded-lg shadow-md w-2/5 h-full mt-20 items-center justify-center p-20">
        <h1 className="text-4xl font-bold text-cyan-900 mb-8 drop-shadow-md">
          Administratorski panel
        </h1>

        <Link
          to={"/admin/viewAccounts"}
          className="button-style text-3xl w-72 h-20 mb-8 flex items-center justify-center"
        >
          Pregled korisnika
        </Link>

        <Link
          to={"/admin/viewActions"}
          className="button-style text-3xl w-72 h-20 mb-8 flex items-center justify-center"
        >
          Pregled akcija
        </Link>

        <Link
          to={"/admin/viewReports"}
          className="button-style text-3xl w-72 h-20 mb-8 flex items-center justify-center"
        >
          Pregled prijava
        </Link>

        <Link
          to={"/admin/viewRefunds"}
          className="button-style text-3xl w-72 h-20 mb-8 flex items-center justify-center text-center"
        >
          Pregled zahtjeva za povrat novca
        </Link>

        <Link
          to={"/admin/viewReviews"}
          className="button-style text-3xl w-72 h-20 flex items-center justify-center text-center"
        >
          Pregled recenzija sistema
        </Link>
        <button
          onClick={handleCreateGlobalNotification}
          className="button-style text-3xl w-72 h-20 mt-8 items-center justify-center text-center transition"
          >
          Kreiraj notifikaciju
        </button>
            {isOwner && (
              <Link
                to={"/admin/addAdmin"}
                className="button-style text-3xl w-72 h-14 mt-8 items-center justify-center text-center transition"
              >
                Dodaj admina
              </Link>
            )}
      </div>
    </div>
  );
}

export default AdminHomePage;
