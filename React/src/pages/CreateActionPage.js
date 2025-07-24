import React, { useState, useContext, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthStateContext } from "../components/UseAuthState";
import InfoFooter from "../components/InfoFooter";
import NavigationBar from "../components/NavigationHeader";
import { apiRequest } from "../utility/FetchAPI";

function CreateActionPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [imageFiles, setImageFiles] = React.useState([]);
  const [imagePreviews, setImagePreviews] = React.useState([]);
  const [primaryImage, setPrimaryImage] = React.useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const { authState, authDispatch } = useContext(AuthStateContext);

  console.log("CreateActionPage", authState.accessToken);

  const handleCreate = async () => {
    try {
      const response = await apiRequest(
        "actions/addaction",
        "POST",
        authState.accessToken,
        {
          name: name,
          desc: description,
          goal: goal,
        }
      );
      const text = await response;
      if (text == "nameTakenError") {
        setResponseMessage("Ime akcije zauzeto");
      } else {
        setResponseMessage("Uploadujemo!");
        for (const file of imageFiles) {
          uploadImage(parseInt(text), file);
        }
      }
    } catch (error) {
      setResponseMessage("greška!");
      console.error(error);
    }
  };

  const uploadImage = async (idAction, file) => {
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
    const newFiles = Array.from(e.target.files).filter((file) =>
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    );

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prevFiles) => {
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

    const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    );

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prevFiles) => {
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

  const removeImage = (fileToRemove) => {
    setImageFiles((prev) => prev.filter((file) => file !== fileToRemove));

    setImagePreviews((prev) => {
      const index = imageFiles.indexOf(fileToRemove);
      if (index !== -1) URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });

    setPrimaryImage((prev) => (prev === fileToRemove ? null : prev));
  };

  return (
    <div className="min-h-screen text-black gradient-style">
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
                  Napiši jasan i kratak naslov i podnaslov kako bi ljudi lako razumjeli tvoj projekat. 
                  Oba naslova će biti prikazani na stranici projekta i na stranici prije pokretanja.
              </p>
              <p className="text-sm text-gray-500">
                  Potencijalni podržavaoci će ih takođe vidjeti na stranicama kategorija,
                  u rezultatima pretrage ili u e-mailovima.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded">
              <label className="block text-sm font-medium mb-1">Naslov</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 mb-4"
                maxLength={60}
                placeholder="npr. EkoMisija: Inovacije za zelenu planetu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label className="block text-sm font-medium mb-1">Podnaslov</label>
              <input
                className="w-full border border-gray-300 rounded p-2"
                maxLength={135}
                rows={3}
                placeholder="npr. Mi smo kolektiv posvećen očuvanju planete..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></input>

              <p className="mt-2 text-sm">
                Ostavite najbolji prvi utisak na podržavaoce uz odlične naslove.{" "}
                <a href="#" className="underline">
                  Saznaj više ...
                </a>
              </p>
            </div>
          </div>
        </section>

        <hr className="border-t border-gray-300" />

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
                Ove opcije možeš mijenjati u bilo kojem trenutku prije i tokom kampanje.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Glavna kategorija
                </label>
                <select className="w-full border border-gray-300 rounded p-2">
                  <option>Umjetnost</option>
                  <option>Tehnologija</option>
                  <option>Igrice</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Glavna podkategorija
                </label>
                <select className="w-full border border-gray-300 rounded p-2">
                  <option>Keramika</option>
                  <option>Aplikacije</option>
                  <option>Društvene igre</option>
                </select>
              </div>

              <div></div>
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
                  Unesi lokaciju koja najbolje opisuje gdje se vaš projekat nalazi.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded">
              <label className="block text-sm font-medium mb-1">Lokacija</label>
              <input
                type="text"
                placeholder="Unesite vašu lokaciju projekta..."
                className="w-full border border-gray-300 rounded p-2"
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
                  Dodaj slike koje vizuelno oslikavaju tvoj projekat i koje zadržavaju kvalitet u svim dimenzijama.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                    Slike treba da budu najmanje 1024×576 piksela.
                    Maksimalna veličina fajla: 5MB po slici. Dozvoljeni formati: JPG, PNG, JPEG.
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
                Maksimalna velicna slike  5MB svaka. Format: JPG, JPEG, PNG.
              </p>
            </div>
          </div>
        </section>
        {/* Section: Funding Goal */}
        <section>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Ciljani iznos </h3>
              <p className="text-sm text-gray-600">
                Unesi iznos novca koji je potreban za finansiranje ovog projekta.
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
        <section className="pb-8">
          {responseMessage && (
            <p className="text-center text-xl  text-red-600 mb-2">
              {responseMessage}
            </p>
          )}
          <button
            onClick={handleCreate}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-4 px-10 rounded float-right"
          >
            Sačuvaj
          </button>
        </section>
      </div>
      <InfoFooter></InfoFooter>
    </div>
  );
}

export default CreateActionPage;
