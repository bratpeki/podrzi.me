import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationHeader";
import InfoFooter from "../components/InfoFooter";
import { AuthStateContext } from "../components/UseAuthState";
import { apiRequest } from "../utility/FetchAPI";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DeleteDialog from "../components/DeleteDialog";
import defaultUser from "../Images/defaultUser.png";

function EditProfilePage() {
  const { authState, authDispatch } = useContext(AuthStateContext);
  const [profileImage, setProfileImage] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const sweetAlert = withReactContent(Swal); //Za notifikacije

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idUser: "",
    username: "",
    email: "",
    password: "",
    oldPassword: "",
    displayName: "",
    desc: "",
    imagePath: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiRequest(
          "users/showprofile",
          "GET",
          authState.accessToken
        );
        if (!res) throw new String("Greška pri dohvatanju profila");

        const data = await res;

        setFormData({
          idUser: data.idUser || "",
          username: data.username || "",
          email: data.email || "",
          oldPassword: "",
          password: "",
          displayName: data.displayName || "",
          desc: data.desc || "",
          imagePath: data.imagePath || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    if (authState?.accessToken) fetchProfile();
  }, [authState]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prvo uploaduj sliku ako postoji
    if (profileImage) {
      const success = await handleImageUpload();
      if (!success) return; // prekini ako upload nije uspio
    }

    try {
      const res = apiRequest(
        "users/updateprofile",
        "POST",
        authState.accessToken,
        formData
      );
      const result = await res;

      if (result === "missingOldPasswordError") {
        throw new String("Niste unjeli staru lozinku");
      }

      if (result === "invalidOldPassword") {
        throw new String("Stara lozinka nije tačna.");
      }

      if (!res && result === "success") {
        throw new String("Greška prilikom ažuriranja profila");
      } else {
        await sweetAlert.fire({
          title: "Uspješno!",
          text: "Profil je ažuriran.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "button-style",
          }
        });
        navigate(`/viewProfile/${formData.idUser}`, {
          state: { id: formData.idUser },
        });
      }
    } catch (err) {
      await sweetAlert.fire({
        title: "Greška!",
        text: err || "Nepoznata greška.",
        icon: "error",
        confirmButtonText: "U redu",
        customClass: {
          confirmButton: "button-style",
        }
      });
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage || !formData.idUser) return;

    const formDataImg = new FormData();
    formDataImg.append("file", profileImage);
    formDataImg.append("idUser", formData.idUser);
    try {
      const res = await apiRequest(
        "images/uploaduserimage",
        "POST",
        authState.accessToken,
        formDataImg
      );
      if (!res) {
        throw new String("Greška pri uploadu slike.");
      }

      formData.imagePath = await res;

      setFormData((prev) => ({
        ...prev,
        imagePath: formData.imagePath,
      }));
      return true;
    } catch (err) {
      console.error("Upload slike nije uspio:", err);
      await sweetAlert.fire({
        title: "Greška!",
        text: err || "Greška pri slanju slike.",
        icon: "error",
        confirmButtonText: "U redu",
        customClass: {
          confirmButton: "button-style",
        }
      });
      return false;
    }
  };
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };
  const logout = () => {
    authDispatch({ type: "logout" });
  };

  const handleConfirmDelete = (password) => {
    const formData = new FormData();
    formData.append("password", password);
    apiRequest("users/removeuser", "POST", authState.accessToken, formData)
      .then((res) => {
        if (res == "success") {
          logout();
          navigate("/home");
        } else if (res == "wrongPasswordError") {
          alert("Pogrešna lozinka");
        } else if (res == "hasActionsError") {
          alert("Korisnik je vlasnik akcija, Morate ih prvo obrisati!");
        }
      })
      .catch(() => {
        alert("Something went wrong.");
      })
      .finally(() => {
        setShowDeleteDialog(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between gradient-style pt-14">
      <NavigationBar />
      <div className="flex-grow flex justify-center items-center px-4 py-12">
        <div className="bg-white p-8 rounded shadow max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Uredi profil
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">
                Display name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Opis</label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">
                Profilna slika
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="w-full border rounded px-3 py-2"
              />
              <img
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : formData.imagePath
                      ? formData.imagePath
                      : defaultUser
                }
                alt="Profilna slika"
                className="mt-2 max-h-40 rounded"
              />
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-700">
                Stara lozinka
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-2 top-[30px] text-gray-500 hover:text-gray-800"
              >
                {showOldPassword ? "🔓" : "🔐"}
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-700">
                Nova lozinka
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-[30px] text-gray-500 hover:text-gray-800"
              >
                {showNewPassword ? "🔓" : "🔐"}
              </button>
            </div>

            <div>
              <label className="block text-sm text-gray-700">
                Potvrdi novu lozinku
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setConfirmPassword(value);

                  if (value === formData.password) {
                    setPasswordError("");
                    // Ako su iste, proslijedi validnu lozinku
                    handleChange({ target: { name: "password", value } });
                  } else {
                    setPasswordError("Lozinke se ne poklapaju");
                  }
                }}
                className="w-full border rounded px-3 py-2"
              />
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={
                formData.password && formData.password !== confirmPassword
              }
              className={`w-full py-2 rounded transition font-semibold ${formData.password && formData.password !== confirmPassword
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-cyan-600 text-white hover:bg-cyan-700"
                }`}
            >
              Sačuvaj Promjene
            </button>
          </form>
          <div className="pt-2">
            <button
              onClick={handleDeleteClick}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded w-full"
            >
              Obriši Nalog
            </button>
          </div>
        </div>
      </div>
      <DeleteDialog
        show={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
      <InfoFooter />
    </div>
  );
}
export default EditProfilePage;
