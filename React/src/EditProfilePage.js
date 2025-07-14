import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import InfoFooter from './InfoFooter';
import { AuthStateContext } from './components/UseAuthState';
//import { useDropzone } from 'react-dropzone';


function EditProfilePage(){

    const { authState }=useContext(AuthStateContext);
    const [imageFile, setImageFile] = React.useState([]);
    const [previewImage, setPreviewImage] = React.useState([]);
    
    const [formData,setFormData]=useState({
        username: '',
        email:'',
        password:'',
        displayName:'',
        desc:'',
        imagepath:'',
    });


    const navigate=useNavigate();

    useEffect(()=>{
        const fetchProfile=async ()=>{
            try{
                const res =await fetch('http://podrzime.ddns.net:8080/api/users/showprofile',{
                    method: 'GET',
                    headers:{
                        'Content-Type':'application/json',
                        'token':authState.accessToken,
                    },
                });

                if(!res.ok) throw new Error('Greška pri dohvatanju profila');

                const data=await res.json();

                setFormData({
                    username: data.username || '',
                    email: data.email || '',
                    password: '',
                    displayName :data.displayname || '',
                    desc: data.desc || '',
                    imagepath: data.imagepath || '',
                });
            }catch(err){
                console.error(err);
            }
        };

        if(authState?.accessToken) fetchProfile();
    },[authState]);


    const handleChange=(e) =>{
        setFormData((prev)=>({
            ...prev,
            [e.target.name]:e.target.value,
        }));
    };

    const handleSubmit=async (e)=>{
        e.preventDefault();

        try{
            const res=await fetch('http://podrzime.ddns.net:8080/api/users/updateprofile',{
                method :'POST',
                headers: {
                    'Content-Type':'application/json',
                    'token':authState.accessToken,
                },
                body:JSON.stringify(formData),
            });

            if(!res.ok)
                throw new Error('Greška prilikom ažuriranja profila');

            alert('Profil uspješno ažuriran');
            navigate('/profilePage')
        }catch(err){
            console.error(err);
            alert('Greška prilikom ažuriranja podataka');
        }
    };

return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <NavigationBar />
      <div className="flex-grow flex justify-center items-center px-4 py-12">
        <div className="bg-white p-8 rounded shadow max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Uredi profil</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Display name</label>
              <input
                type="text"
                name="displayname"
                value={formData.displayname}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
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
              <label className="block text-sm text-gray-700">URL slike</label>
              <input
                type="text"
                name="imagepath"
                value={formData.imagepath}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Nova lozinka</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Sačuvaj promjene
            </button>
          </form>
        </div>
      </div>
      <InfoFooter />
    </div>
  );
}
export default EditProfilePage;