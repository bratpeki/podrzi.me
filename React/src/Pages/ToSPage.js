import React from 'react';
import NavigationBar from '../components/NavigationHeader';
import InfoFooter from '../components/InfoFooter'


function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <NavigationBar showSearch={false} />
      <div className="flex-grow flex flex-col items-center px-4 pt-12 pb-24">
      <div className="bg-white shadow-md rounded-lg max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Uslovi korišćenja</h1>

        <p className="text-gray-700 mb-4">
          Dobrodošli na platformu <strong>Podrži.me</strong>. Korišćenjem naše platforme prihvatate sledeće uslove korišćenja.
          Molimo vas da ih pažljivo pročitate prije korišćenja sajta.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2 mt-6">1. Opšti uslovi</h2>
        <p className="text-gray-700 mb-4">
          Korišćenje platforme Podrži.me podrazumijeva prihvatanje pravila o privatnosti i korišćenju ličnih podataka.
          Platforma je namijenjena za postavljanje i podršku humanitarnim kampanjama.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2 mt-6">2. Obaveze korisnika</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
          <li>Korisnici su odgovorni za tačnost informacija koje objavljuju.</li>
          <li>Zabranjeno je postavljanje lažnih, uvredljivih ili nezakonitih kampanja.</li>
          <li>Podrška kampanjama se vrši dobrovoljno.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mb-2 mt-6">3. Ograničenje odgovornosti</h2>
        <p className="text-gray-700 mb-4">
          Podrži.me ne snosi odgovornost za sadržaj kreiran od strane korisnika, ali zadržava pravo da ukloni kampanje koje krše pravila.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2 mt-6">4. Prikupljanje sredstava</h2>
        <p className="text-gray-700 mb-4">
          Svi korisnici koji pokreću kampanju su odgovorni za transparentno trošenje prikupljenih sredstava.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2 mt-6">5. Promjene uslova</h2>
        <p className="text-gray-700 mb-4">
          Podrži.me zadržava pravo izmjene uslova korišćenja bez prethodne najave. Ažurirane verzije će biti objavljene na ovoj stranici.
        </p>

        <p className="text-gray-700 mt-8 text-sm text-center">
          Posljednje ažuriranje: 12. jul 2025.
        </p>
      </div>
    </div>
    <InfoFooter />
  </div>
  );
}

export default TermsOfServicePage;
