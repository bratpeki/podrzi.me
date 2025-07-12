import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import InfoFooter from './InfoFooter';

function HomePage() {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    fetch('http://podrzime.ddns.net:8080/api/actions/getvisibleactions') // Update to your actual backend endpoint
      .then((res) => res.json())
      .then((data) => {
        setActions(data);
      })
      .catch((error) => {
        console.error('Error fetching actions:', error);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/*navigation bar */}
      <NavigationBar showSearch={true} />

      {/* Header */}
      <header className="text-center mt-10 mb-6">
        <h1 className="text-5xl font-bold text-gray-800">Podrži.me</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Pregled aktivnih akcija
        </p>
        <hr className="w-1/4 mx-auto my-4 border-gray-400" />
      </header>

      {/* Category Title */}
      <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
        Humanitarno
      </h2>

      {/* Cards Grid */}
      <div className="flex flex-wrap justify-center gap-6 px-6 flex-grow pb-16">
        {actions.map((action, index) => {
          const progress = Math.min(
            100,
            (action.collected / action.goal) * 100
          ).toFixed(0);
          return (
            <div
              key={index}
              className="w-72 bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src="https://via.placeholder.com/300x150?text=Akcija"
                alt="Slika akcije"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {action.name}
                </h3>
                <p className="text-gray-600 text-sm">{action.desc}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Cilj: {action.goal.toLocaleString()}€
                </p>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className={`h-2.5 rounded-full ${
                      progress < 50 ? 'bg-orange-400' : 'bg-green-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p
                  className={`mt-1 text-sm font-medium ${
                    progress < 50 ? 'text-orange-500' : 'text-green-600'
                  }`}
                >
                  {progress}% prikupljeno
                </p>
              </div>
            </div>
          );
        })}
      </div>
       {/* ✅ Bottom Bar */}
      <InfoFooter />
    </div>
    
  );
}

export default HomePage;
