import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthStateContext } from "../components/UseAuthState";
import InfoFooter from "../components/InfoFooter";
import NavigationBar from "../components/NavigationHeader";

function EditActionPage() {
  const location = useLocation();
  const { action } = location.state || {};
  const [currentAction, setCurrentAction] = useState('');

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [imageFiles, setImageFiles] = React.useState([]);
  const [imagePreviews, setImagePreviews] = React.useState([]);
  const [primaryImage, setPrimaryImage] = React.useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const { authState, authDispatch } = useContext(AuthStateContext);

  console.log("EditActionPage", authState.accessToken);

    //cekanje da se ucita stranica do kraja da se ne bi action bio null
    useEffect(() => {
    if (!action) return;
  
    fetch("http://podrzime.ddns.net:8080/api/actions/getaction?idAction=" + action.idAction, {
      method: "GET",
      headers: {
        "token": authState.accessToken,
      }
    })
      .then(res => res.json())
      .then(data => {
        setCurrentAction(data);
        setName(data.name);
        setDescription(data.desc);
        setGoal(data.goal);
        setPrimaryImage(data.primaryImage)
      })
      .catch(err => {
        console.error("Failed to fetch action:", err);
      });
       fetch("http://podrzime.ddns.net:8080/api/images/getactionimages?idAction=" + action.idAction, {
      method: "GET",
      headers: {
        "token": authState.accessToken,
      }
    })
      .then(res => res.json())
      .then(data => {
        setImageFiles(data);
        setImagePreviews(data);
      })
      .catch(err => {
        console.error("Failed to fetch action:", err);
      });
    }, [action, authState.accessToken]);
    
    if (!currentAction) {
    return <div className="p-8 text-center text-gray-500">Učitavanje akcije...</div>;
    }


  const handleUpdate = async () => {
    try {
      const url = "http://podrzime.ddns.net:8080/api/actions/updateaction";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": authState.accessToken,
        },
        body: JSON.stringify({
          "idAction":parseInt(currentAction.idAction),
          "name": name,
          "desc": description,
          "goal": goal,
          "primaryImage": primaryImage
        }),
      });
      const text = await response.text();
      if (text == "nameTakenError") {
        setResponseMessage("Ime akcije zauzeto");
      } else {
        setResponseMessage("Uploadujemo!");
          for (const file of imageFiles){
            uploadImage(currentAction.idAction,file);
          }
      }
    } catch (error) {
      setResponseMessage("greška!");
      console.error(error);
    }
  };

const uploadImage = async (idAction, file) => {
   if (imageFiles.includes(file)){
    console.log("slika vec postoji")
    return;
   }
   const formData = new FormData();
   formData.append('idAction', idAction);
   formData.append('file', file);
   console.log(file)
   console.log(primaryImage)
   if(file == primaryImage){
     formData.append('isPrimary', true)
   }else{
     formData.append('isPrimary', false)
   }
    try {
      const response = await fetch('http://podrzime.ddns.net:8080/api/images/uploadactionimage', {
        method: 'POST',
        headers:{
          "token":authState.accessToken
        },
        body: formData,
      });

      if (response.ok) {
        setResponseMessage('Akcija i slika su uspešno sačuvane!');
      } else {
        setResponseMessage('Akcija je sačuvana, ali upload slike nije uspeo.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setResponseMessage('Došlo je do greške pri uploadu slike.');
    }
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files).filter(file =>
      ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
    );

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setImageFiles(prevFiles => {
      const combined = [...prevFiles, ...newFiles];
      if (!primaryImage && newFiles.length > 0) {
        setPrimaryImage(newFiles[0]);
      }
      return combined;
    });

    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const newFiles = Array.from(e.dataTransfer.files).filter(file =>
      ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
    );

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setImageFiles(prevFiles => {
      const combined = [...prevFiles, ...newFiles];
      if (!primaryImage && newFiles.length > 0) {
        setPrimaryImage(newFiles[0]);
      }
      return combined;
    });

    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = async (fileToRemove) => {
      // Find the matching image object by comparing names
    const matchedFile = imageFiles.find(file => {
      return (file.name && fileToRemove.name && file.name === fileToRemove.name) ||
            (file === fileToRemove); // fallback if direct reference works
    });

    if (!matchedFile) {
      console.error("File to remove not found in imageFiles");
      return;
    }

    const urlToRemove = matchedFile.url || matchedFile; // fallback if it's just a string
    try {
        const formData = new FormData();
        formData.append('idAction', currentAction.idAction);
        formData.append('url', urlToRemove);
        if(fileToRemove == primaryImage){
          formData.append('isPrimary', true)
        }else{
          formData.append('isPrimary', false)
        }
      const response = await fetch('http://podrzime.ddns.net:8080/api/images/removeactionimage', {
        method: 'POST',
        headers:{
          "token":authState.accessToken
        },
        body:formData
      });
      const text = await response.text();
      if(text == "primaryImageError"){
        setResponseMessage("Ne možete ukloniti primarnu sliku");
      }
      else if (text =="InvalidUserError"){
        setResponseMessage("Pogrešan korisnik");
      }
      else{
      setImageFiles(prev => prev.filter(file => file !== fileToRemove));

      setImagePreviews(prev => {
        const index = imageFiles.indexOf(fileToRemove);
        if (index !== -1) URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
      });

    setPrimaryImage(prev => (prev === fileToRemove ? null : prev));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setResponseMessage('Došlo je do greške pri uploadu slike.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top navigation bar */}
      <NavigationBar showSearch={false} showCreate={false}/>

      {/* Page content */}
      <div className="max-w-5xl mx-auto py-20 px-6 space-y-16">
        {/* Section: Start with the basics */}
        <section>
          <h2 className="text-2xl font-semibold mb-1">Start with the basics</h2>
          <p className="text-sm text-gray-600 mb-6">
            Make it easy for people to learn about your project.
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Project title</h3>
              <p className="text-sm text-gray-600 mb-4">
                Write a clear, brief title and subtitle to help people quickly
                understand your project. Both will appear on your project and
                pre-launch pages.
              </p>
              <p className="text-sm text-gray-500">
                Potential backers will also see them in category pages, search
                results, or emails.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 mb-4"
                maxLength={60}
                placeholder="e.g. Radiotopia: A Storytelling Revolution"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                className="w-full border border-gray-300 rounded p-2"
                maxLength={135}
                rows={3}
                placeholder="e.g. We are a collective of amazing storytelling radio shows..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></input>

              <p className="mt-2 text-sm">
                Give backers the best first impression of your project with
                great titles.{" "}
                <a href="#" className="underline">
                  Learn more...
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
              <h3 className="font-medium text-lg mb-1">Project category</h3>
              <p className="text-sm text-gray-600 mb-2">
                Choose a primary category and subcategory to help backers find
                your project.
              </p>
              <p className="text-sm text-gray-500">
                You can change these anytime before and during your campaign.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Primary category
                </label>
                <select className="w-full border border-gray-300 rounded p-2">
                  <option>Art</option>
                  <option>Technology</option>
                  <option>Games</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Primary subcategory
                </label>
                <select className="w-full border border-gray-300 rounded p-2">
                  <option>Ceramics</option>
                  <option>Apps</option>
                  <option>Board Games</option>
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
              <h3 className="font-medium text-lg mb-1">Project location</h3>
              <p className="text-sm text-gray-600">
                Enter the location that best describes where your project is
                based.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                placeholder="Start typing your location..."
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
              <h3 className="font-medium text-lg mb-1">Project images</h3>
              <p className="text-sm text-gray-600">
                Add images that clearly represent your project. Choose ones that
                look good at different sizes.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Your images should be at least 1024×576 pixels. Max file size:
                5MB each. Accepted: JPG, PNG, JPEG
              </p>
            </div>

            <div
              className="bg-white p-6 shadow rounded text-center border-2 border-dashed border-gray-300"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <p className="mb-2">Izaberite slike ili ih prevucite u prozor.  Kliknite na sliku koju želite da bude primarna.</p>
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
                      ${isPrimary ? 'ring-4 ring-blue-500 border-blue-400' : 'border-gray-300'}`}
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
                Max 5MB each. Only JPG, JPEG, PNG.
              </p>
            </div>
          </div>
        </section>
        {/* Section: Funding Goal */}
        <section>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Funding Goal</h3>
              <p className="text-sm text-gray-600">
                Enter the amount of money that is required to fund this project
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded">
              <label className="block text-sm font-medium mb-1">
                Funding Goal
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
            onClick={handleUpdate}
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

export default EditActionPage;
