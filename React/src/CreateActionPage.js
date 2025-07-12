import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function CreateActionPage() {
     const [name, setName] = useState('');
     const [description, setDescription] = useState('');
     const [goal, setGoal] = useState('');
     const [responseMessage, setResponseMessage] = useState('');

     const handleCreate = async () => {
      try {
        const url = 'http://podrzime.ddns.net:8080/api/actions/addaction'
        const response = await fetch(url, {
          method: 'POST',
        headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": name,
        "desc": description,
        "goal": goal
      })
        });
        if (!response.ok) {
          throw new Error('Neuspjesna autentifikacija!');
        }
    
        const text = await response.text(); 
        if(text == "success"){
           setResponseMessage('Sačuvana akcija!');
        }
        else{
          setResponseMessage('pogrešio si nešto xd');
        }
    }catch (error) {
        setResponseMessage('greška!');
        console.error(error);
      }
    };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top navigation bar */}
      <nav className="w-full bg-white shadow-sm border-b flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-cyan-600">PODRZI.ME</h1>
        </div>

    {responseMessage && (
            <p className="text-center text-sm text-red-600 mb-2">{responseMessage}</p>
            )}

        <div className="flex items-center gap-3">
          <button className="text-sm text-gray-400 border border-gray-300 px-3 py-1 rounded hover:text-black hover:border-black">
            Preview
          </button>
          <button
          onClick={handleCreate} 
          className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-900">
            Sačuvaj
          </button>
        </div>
      </nav>

      {/* Page content */}
      <div className="max-w-5xl mx-auto py-10 px-6 space-y-16">
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
                Write a clear, brief title and subtitle to help people quickly understand your project. Both will appear on your project and pre-launch pages.
              </p>
              <p className="text-sm text-gray-500">
                Potential backers will also see them in category pages, search results, or emails.
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
                Give backers the best first impression of your project with great titles. <a href="#" className="underline">Learn more...</a>
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
                Choose a primary category and subcategory to help backers find your project.
              </p>
              <p className="text-sm text-gray-500">
                You can change these anytime before and during your campaign.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Primary category</label>
                <select className="w-full border border-gray-300 rounded p-2">
                  <option>Art</option>
                  <option>Technology</option>
                  <option>Games</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Primary subcategory</label>
                <select className="w-full border border-gray-300 rounded p-2">
                  <option>Ceramics</option>
                  <option>Apps</option>
                  <option>Board Games</option>
                </select>
              </div>

              <div>

              </div>
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
                Enter the location that best describes where your project is based.
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

        {/* Section: Project image & video */}
        <section>
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Project image</h3>
              <p className="text-sm text-gray-600">
                Add an image that clearly represents your project. Choose one that looks good at different sizes.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Your image should be at least 1024×576 pixels. It will be cropped to a 16:9 ratio. Avoid images with banners or badges.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded">
              <div className="border-2 border-dashed border-gray-300 p-6 text-center">
                <p className="mb-2">Drop an image here, or select a file.</p>
                <input type="file" accept="image/*" className="block mx-auto" />
                <p className="text-xs text-gray-500 mt-2">It must be a JPG, PNG, GIF, or WEBP, no larger than 50 MB.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-medium text-lg mb-1">Project video (optional)</h3>
              <p className="text-sm text-gray-600">
                Add a video that describes your project. Tell people what you're raising funds to do, how you'll make it happen, who you are, and why you care.
              </p>
            </div>

            <div className="bg-white p-6 shadow border rounded">
              <div className="border-2 border-dashed border-gray-300 p-6 text-center">
                <p className="mb-2">Drop a video here, or select a file.</p>
                <input type="file" accept="video/*" className="block mx-auto" />
                <p className="text-xs text-gray-500 mt-2">Accepted formats: MOV, AVI, MP4, etc. Max size: 5 GB.</p>
              </div>
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
              <label className="block text-sm font-medium mb-1">Funding Goal</label>
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
      </div>
    </div>
  );
}

export default CreateActionPage;