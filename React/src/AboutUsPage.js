import React from 'react';
import NavigationBar from './NavigationBar';
import InfoFooter from './InfoFooter'


function AboutUsPage() {
  return (

    
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
     <NavigationBar showSearch={false} />
      <div className="flex-grow flex flex-col items-center px-4 pt-12 pb-24">
      <div className="bg-white rounded-lg shadow-md max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">O nama</h1>

        <p className="text-gray-700 mb-4">
          <strong>Podrži.me</strong> je humanitarna platforma nastala iz želje da pomognemo onima kojima je pomoć najpotrebnija.
          Kroz našu zajednicu, povezujemo ljude velikog srca sa onima koji se bore s izazovima života.
        </p>

        <p className="text-gray-700 mb-4">
          Naša misija je da stvorimo most povjerenja između donatora i onih kojima je pomoć potrebna,
          inovativno i sa dubokom vjerom u moć zajedništva.
        </p>

        <p className="text-gray-700 mb-6">
          Kroz podršku pojedinaca i organizacija, <strong>Podrži.me</strong> omogućava brze, pouzdane i personalizovane kampanje koje
          imaju stvaran uticaj na živote ljudi.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Naše vrijednosti</h2>

        <ul className="list-none pl-0 text-gray-700 space-y-2 mb-6">
          <li>🤝 Povjerenje i transparentnost</li>
          <li>💡 Pomoć onima kojima je potrebno</li>
          <li>❤️ Zajedništvo i solidarnost</li>
          <li>📢 Glas onima koji ga nemaju</li>
        </ul>

        <p className="text-gray-800 font-semibold text-lg">
          Zajedno možemo učiniti svijet boljim — jedna podrška u isto vrijeme. Pridruži se pokretu.{' '}
          <span className="font-bold">Podrži. Pomozi. Promijeni.</span>
        </p>
      </div>
    </div>
  <InfoFooter />
  </div>

  );
}

export default AboutUsPage;
