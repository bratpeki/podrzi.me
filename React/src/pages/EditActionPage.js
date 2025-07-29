import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthStateContext } from "../components/UseAuthState";
import InfoFooter from "../components/InfoFooter";
import NavigationBar from "../components/NavigationHeader";
import { apiRequest } from "../utility/FetchAPI";
import CollaboratorSearch from "../components/CollaboratorSearch";
import DeleteDialog from "../components/DeleteDialog";
import { jwtDecode } from "jwt-decode";
import TagInput from "../components/TagInput";
import Swal from "sweetalert2";

//TODO : REMOVE NOVE SLIKE, NOVA SLIKA KAO PRIMARNA
function EditActionPage() {
  const location = useLocation();
  const { id } = location.state || {};
  const [currentAction, setCurrentAction] = useState("");
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const { authState, authDispatch } = useContext(AuthStateContext);

  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [imageFiles, setImageFiles] = React.useState([]);
  const [imagePreviews, setImagePreviews] = React.useState([]);
  const [primaryImage, setPrimaryImage] = React.useState(null);
  const [category, setCategory] = useState("Humanitarno");
  const [tags, setTags] = useState([]);
  const [actionLocation, setActionLocation] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");

  const [users, setUsers] = useState({});
  const [collabUsers, setCollabUsers] = useState([]);
  const userIds = React.useMemo(() => Object.keys(users), [users]);
  const displayNames = React.useMemo(() => Object.values(users), [users]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const ownerId = authState.accessToken
    ? jwtDecode(authState.accessToken).id
    : null;

  console.log("EditActionPage", authState.accessToken);

  //cekanje da se ucita stranica do kraja da se ne bi action bio null
  useEffect(() => {
    if (!id) return;

    apiRequest("actions/getaction?idAction=" + id, "GET", authState.accessToken)
      .then((res) => res)
      .then((data) => {
        setCurrentAction(data);
        setSubtitle(data.subtitle);
        setDescription(data.desc);
        setCategory(data.category);
        setTags(data.tags);
        setGoal(data.goal);
        setActionLocation(data.location);
        setVideoUrl(data.videoLink);
        setPrimaryImage(data.primaryImage);
      })
      .catch((err) => {
        console.error("Failed to fetch action:", err);
      });
    apiRequest(
      "images/getactionimages?idAction=" + id,
      "GET",
      authState.accessToken
    )
      .then((res) => res)
      .then((data) => {
        setImageFiles(data);
        setImagePreviews(data);
      })
      .catch((err) => {
        console.error("Failed to fetch action:", err);
      });
    apiRequest("users/getusers", "GET", authState.accessToken)
      .then((res) => res)
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });
  }, [id, authState.accessToken]);
  if (!currentAction) {
    return (
      <div className="p-8 text-center text-gray-500">Učitavanje akcije...</div>
    );
  }

  const handleUpdate = async () => {
     if (imageFiles.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "Morate postaviti sliku koja će predstaviti Vašu akciju!",
            confirmButtonText: "U redu",
          });
          return;
        }
    
    try {
      const response = await apiRequest(
        "actions/updateaction",
        "POST",
        authState.accessToken,
        {
          idAction: parseInt(currentAction.idAction),
          subtitle: subtitle,
          desc: description,
          category: category,
          tags: tags,
          location: actionLocation,
          goal: goal,
          primaryImage: primaryImage,
          videoLink : videoUrl,
        }
      );
      const text = await response;
      if (text == "nameTakenError") {
        setResponseMessage("Ime akcije zauzeto");
      } else {
        setResponseMessage("Uploadujemo!");
        for (const file of newImageFiles) {
          uploadImage(currentAction.idAction, file);
        }
      }
    } catch (error) {
      setResponseMessage("greška!");
      console.error(error);
    }
  };

  const handleSendCollabRequests = async () => {
    try {
      const promises = collabUsers.map((receiverId) =>
        apiRequest("notifications/sendcollab", "POST", authState.accessToken, {
          idAction: id,
          idSender: ownerId,
          type: 0,
          idUser: receiverId,
        })
      );
      await Promise.all(promises); // wait for them all to finish
      setResponseMessage("Pozivi poslani!");
    } catch (error) {
      console.error(error);
      setResponseMessage("Greška pri slanju poziva!");
    }
  };

  const uploadImage = async (idAction, file) => {
    if (imageFiles.includes(file)) {
      console.log("slika vec postoji");
      return;
    }
    const formData = new FormData();
    formData.append("idAction", idAction);
    formData.append("file", file);
    console.log(file);
    console.log(primaryImage);
    if (file == primaryImage) {
      formData.append("isPrimary", true);
    } else {
      formData.append("isPrimary", false);
    }
    try {
      const response = await apiRequest(
        "images/uploadactionimage",
        "POST",
        authState.accessToken,
        formData
      );
      if (response) {
        setResponseMessage("Akcija i slika su uspešno sačuvane!");
      } else {
        setResponseMessage("Akcija je sačuvana, ali upload slike nije uspeo.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setResponseMessage("Došlo je do greške pri uploadu slike.");
    }
  };

  const handleImageChange = (e) => {
     const newFiles = Array.from(e.target.files).filter((file) => {
         const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
           file.type
         );
         const isValidSize = file.size <= 3 * 1024 * 1024; // 3MB in bytes
   
         if (!isValidSize) {
           Swal.fire({
             icon: "error",
             title: "Slika je prevelika!",
             text: `Slika "${file.name}" prelazi ograničenje od 3MB.`,
           });
         }
   
         return isValidType && isValidSize;
       });

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setNewImageFiles((prevFiles) => {
      const combined = [...prevFiles, ...newFiles];
      if (!primaryImage && newFiles.length > 0) {
        setPrimaryImage(newFiles[0]);
      }
      return combined;
    });

    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const newFiles = Array.from(e.dataTransfer.files).filter((file) => {
         const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
           file.type
         );
         const isValidSize = file.size <= 3 * 1024 * 1024;
   
         if (!isValidSize) {
           Swal.fire({
             icon: "error",
             title: "Slika je prevelika!",
             text: `Slika "${file.name}" prelazi ograničenje od 3MB.`,
           });
         }
   
         return isValidType && isValidSize;
       });

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setNewImageFiles((prevFiles) => {
      const combined = [...prevFiles, ...newFiles];
      if (!primaryImage && newFiles.length > 0) {
        setPrimaryImage(newFiles[0]);
      }
      return combined;
    });

    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const removeImage = async (fileToRemove) => {
    // Find the matching image object by comparing names
    const matchedFile = imageFiles.find((file) => {
      return (
        (file.name && fileToRemove.name && file.name === fileToRemove.name) ||
        file === fileToRemove
      ); // fallback if direct reference works
    });

    if (!matchedFile) {
      console.error("File to remove not found in imageFiles");
      return;
    }

    const urlToRemove = matchedFile.url || matchedFile; // fallback if it's just a string
    try {
      const formData = new FormData();
      formData.append("idAction", currentAction.idAction);
      formData.append("url", urlToRemove);
      if (fileToRemove == primaryImage) {
        formData.append("isPrimary", true);
      } else {
        formData.append("isPrimary", false);
      }
      const response = await apiRequest(
        "images/removeactionimage",
        "POST",
        authState.accessToken,
        formData
      );
      const text = await response;
      if (text == "primaryImageError") {
        setResponseMessage("Ne možete ukloniti primarnu sliku");
      } else if (text == "InvalidUserError") {
        setResponseMessage("Pogrešan korisnik");
      } else {
        setImageFiles((prev) => prev.filter((file) => file !== fileToRemove));

        setImagePreviews((prev) => {
          const index = imageFiles.indexOf(fileToRemove);
          if (index !== -1) URL.revokeObjectURL(prev[index]);
          return prev.filter((_, i) => i !== index);
        });

        setPrimaryImage((prev) => (prev === fileToRemove ? null : prev));
      }
    } catch (error) {
      console.error("Upload error:", error);
      setResponseMessage("Došlo je do greške pri uploadu slike.");
    }
  };
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };
  const handleConfirmDelete = async (password) => {
    const formData = new FormData();
    formData.append("idAction", currentAction.idAction);
    formData.append("password", password);
    const response = await apiRequest(
      "actions/removeaction",
      "POST",
      authState.accessToken,
      formData
    );
    const text = await response;
    if (text == "invalidpassworderror") {
      setShowDeleteDialog(false);
      return;
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen  text-gray-800 gradient-style">
      {/* Top navigation bar */}
      <NavigationBar showSearch={false} showCreate={false} />

      {/* Page content */}

      <div className="max-w-5xl mx-auto py-20 px-6 space-y-16">
        {/* Section: Start with the basics */}
        <section className="pt-4">
          <h2 className="text-4xl font-semibold mb-1">Počni od osnova</h2>
          <p className="text-sm text-gray-600 mb-6">
            Učini da ljudi lako razumiju tvoj projekat.
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Naziv projekta</h3>
              <p className="text-sm text-gray-600 mb-4">
                Napiši jasan i kratak naslov i podnaslov kako bi ljudi lako
                razumjeli tvoj projekat. Oba naslova će biti prikazani na
                stranici projekta i na stranici prije pokretanja.
              </p>
              <p className="text-sm text-gray-500">
                Potencijalni podržavaoci će ih takođe vidjeti na stranicama
                kategorija, u rezultatima pretrage ili u e-mailovima.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded">
              <label className="block text-sm font-medium mb-1">
                Podnaslov
              </label>
              <input
                className="w-full border border-gray-300 rounded p-2"
                maxLength={135}
                rows={3}
                placeholder="npr. Mi smo kolektiv posvećen očuvanju planete..."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                required
              ></input>

              <p className="mt-2 text-sm">
                Ostavite najbolji prvi utisak na podržavaoce uz odlične naslove.{" "}
                <a href="#" className="underline">
                  Saznaj više...
                </a>
              </p>
            </div>
          </div>
        </section>
        {/* Section: Description*/}
        <section className="pt-4">
          <h3 className="font-medium text-lg mb-1">Opis Akcije</h3>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-sm text-gray-500">
                Opišite u detaljima svoju akciju, ili podelite priču odnosno
                kontekst koji Vas je doveo do kreiranja ove akcije.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded">
              <label className="block text-sm font-medium mb-1">Opis</label>
              <textarea
                className="w-full border border-gray-300 rounded p-2"
                maxLength={500}
                rows={3}
                placeholder="npr. Mi smo kolektiv posvećen očuvanju planete..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
        </section>
        <hr className="border-t border-gray-300" />

        <section>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Kolaboratori</h3>
              <p className="text-sm text-gray-600 mb-4">
                Kolaboratori su korisnici koji su aktivno uključeni u
                doprinošenje određenoj akciji ili kampanji na platformi. Oni
                mogu pomagati u upravljanju akcijom, objavljivanju ažuriranja
                ili interakciji s podržavaocima. Dodavanjem kolaboratora
                omogućava se da više pouzdanih korisnika zajedno radi na istoj
                akciji, čime se poboljšavaju komunikacija, efikasnost i
                transparentnost za one koji prate ili podržavaju kampanju.
              </p>
              <p className="text-sm text-gray-500">
                Potencijalni podržavaoci će ih takođe vidjeti na stranicama
                kategorija, u rezultatima pretrage ili putem e-mailova.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded">
              <CollaboratorSearch
                displayNames={displayNames}
                userIds={userIds}
                onChange={(ids) => setCollabUsers(ids)}
              />
              <button
                //NEKA BUDE SIMBOL SLANJA
                className=" font-semibold py-2 px-6  float-right button-style"
                onClick={handleSendCollabRequests}
              >
                Pošalji Zahtjeve
              </button>
            </div>
          </div>
        </section>

        {/* Section: Project category */}
        <section>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Kategorija projekta</h3>
              <p className="text-sm text-gray-600 mb-2">
                Izaberi glavnu kategoriju i potkategoriju kako bi podržavaoci
                lakše pronašli tvoj projekat.
              </p>
              <p className="text-sm text-gray-500">
                Ove opcije možeš mijenjati u bilo kojem trenutku prije i tokom
                kampanje.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Glavna kategorija
                </label>
                <select
                  className="w-full border border-gray-300 rounded p-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Humanitarno</option>
                  <option>Tehnologija</option>
                  <option>Igrica</option>
                  <option>Umjetnost</option>
                  <option>Startup</option>
                  <option>Knjiga</option>
                  <option>Film</option>
                  <option>Video</option>
                  <option>Muzika</option>
                  <option>Hrana</option>
                  <option>Moda</option>
                </select>
              </div>
              <div></div>
            </div>
          </div>
        </section>
        <hr className="border-t border-gray-300" />
        {/* Section: Project Tags */}
        <section>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Tagovi projekta</h3>
              <p className="text-sm text-gray-600 mb-2">
                Napišite listu tagova pomoću kojih će korisnici moći prepoznati
                i asocirati se sa Vašom akcijom.
              </p>
              <p className="text-sm text-gray-500">
                Tagovi se mogu dodati i brisati u bilo kojem trenutku.
              </p>
            </div>
            <div className="bg-white p-6 shadow border rounded grid gap-4">
              <label className="block text-sm font-medium mb-1">Tagovi</label>
              <div className="">
                <TagInput tags={tags} setTags={setTags} />
              </div>
            </div>
          </div>
        </section>

        <hr className="border-t border-gray-300" />
        {/* Section: Project location */}
        <section>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Lokacija projekta</h3>
              <p className="text-sm text-gray-600">
                Unesi lokaciju koja najbolje opisuje gdje se vaš projekat
                nalazi.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded">
              <label className="block text-sm font-medium mb-1">Lokacija</label>
              <input
                type="text"
                placeholder="Unesite vašu lokaciju projekta..."
                className="w-full border border-gray-300 rounded p-2"
                value={actionLocation}
                onChange={(e) => setActionLocation(e.target.value)}
              />
            </div>
          </div>
        </section>

        <hr className="border-t border-gray-300" />
        {/* section: images*/}
        <section>
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Slike projekta</h3>
              <p className="text-sm text-gray-600">
                Dodaj slike koje vizuelno oslikavaju tvoj projekat i koje
                zadržavaju kvalitet u svim dimenzijama.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Slike treba da budu najmanje 1024×576 piksela. Maksimalna
                veličina fajla: 5MB po slici. Dozvoljeni formati: JPG, PNG,
                JPEG.
              </p>
            </div>

            <div
              className="bg-white p-6 shadow rounded text-center border-2 border-dashed border-gray-300"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <p className="mb-2">
                Izaberite slike ili ih prevucite u prozor. Kliknite na sliku
                koju želite da bude primarna.
              </p>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={handleImageChange}
                className="block mx-auto mb-4"
              />

              <div className="flex flex-wrap justify-center gap-4">
                {imagePreviews.map((src, i) => {
                  const file = imageFiles[i];
                  const isPrimary = file === primaryImage;

                  return (
                    <div key={i} className="relative inline-block">
                      <img
                        src={src}
                        alt={`Preview ${i + 1}`}
                        onClick={() => setPrimaryImage(file)}
                        className={`cursor-pointer max-h-40 object-contain border rounded transition duration-150
                      ${
                        isPrimary
                          ? "ring-4 ring-blue-500 border-blue-400"
                          : "border-gray-300"
                      }`}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(file);
                        }}
                        className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1 hover:bg-red-700"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Maksimalna velicna slike 5MB svaka. Format: JPG, JPEG, PNG.
              </p>
            </div>
          </div>
        </section>
        {/* section: video link*/}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="font-medium text-lg mb-1">Video Link</h3>
            <p className="text-sm text-gray-600 mb-2">
              Unesite link do vašeg videa (YouTube).
            </p>
          </div>
          <div>
            <input
              type="url"
              placeholder="https://youtube.com/video"
              className="w-full border border-gray-300 rounded p-2"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>
        </section>

        {/* Section: Funding Goal */}
        <section>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Ciljani iznos</h3>
              <p className="text-sm text-gray-600">
                Unesi iznos novca koji je potreban za finansiranje ovog
                projekta.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded">
              <label className="block text-sm font-medium mb-1">
                Ciljani iznos
              </label>
              <input
                type="text"
                placeholder="50000000$"
                className="w-full border border-gray-300 rounded p-2"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
              />
            </div>
          </div>
        </section>
        <hr className="border-t border-gray-300" />
        {/* Section: Bank details */}
        <section>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Bankovni podaci</h3>
              <p className="text-sm text-gray-600 mb-2">
                Unesi tačne bankovne podatke kako bi mogao/la primati isplate.
              </p>
              <p className="text-sm text-gray-500">
                Ove informacije su povjerljive i neće biti javno prikazane.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Naziv banke
                </label>
                <input
                  type="text"
                  placeholder="npr. UniCredit Bank"
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">IBAN</label>
                <input
                  type="text"
                  placeholder="npr. BA391290079401028489"
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  SWIFT/BIC (opcionalno)
                </label>
                <input
                  type="text"
                  placeholder="npr. UNCRBA22"
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
            </div>
          </div>
        </section>
        <hr className="border-t border-gray-300" />
        <section className="pb-8">
          {responseMessage && (
            <p className="text-center text-xl  text-red-600 mb-2">
              {responseMessage}
            </p>
          )}
          <button
            onClick={handleUpdate}
            className="button-style font-semibold py-4 px-10  float-right"
          >
            Sačuvaj
          </button>
          <div>
            <button
              onClick={handleDeleteClick}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded float-left"
            >
              Obriši Akciju
            </button>
          </div>
        </section>
      </div>
      <DeleteDialog
        show={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
      <InfoFooter></InfoFooter>
    </div>
  );
}

export default EditActionPage;
