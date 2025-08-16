import React from "react";
import NavigationBar from "../components/NavigationHeader";
import InfoFooter
 from "../components/InfoFooter";
const guideSections = [
  {
    title: "Kako donariti akciji",
    description: "Ovdje ćete naučiti kako da donirate i podrzite odredjenu akciju.",
    videoUrl: "/videos/donate.mp4", 
  },
  {
    title: "Kako postaviti komentar",
    description: "Ovdje ćete naučiti kako da postavite komentar na željenu akciju.",
    videoUrl: "/videos/donate.mp4", 
  },
  {
    title: "Kako napraviti zahtjev za povrat novca",
    description: "Ovdje ćete naučiti kako da napravite zahtjev za povrat novca u slučaju da sumnjate u akciju koju ste podržali.",
    videoUrl: "/videos/donate.mp4", 
  },
  {
    title: "Kako napraviti akciju",
    description: "Ovdje ćete naučiti kako da kreirate vlastitu akciju na našoj platformi i privučete podršku.",
    videoUrl: "/videos/create-action.mp4", 
  },
   {
    title: "Kako ažurirati akciju",
    description: "Ovdje ćete naučiti kako da pravite izmjene na kreiranoj akciji.",
    videoUrl: "/videos/create-action.mp4", 
  },
  {
    title: "Kako ažurirati profil",
    description: "Naučite kako uređivati svoj profil, pregledati svoje akcije i pratiti donacije.",
    videoUrl: "/videos/profile-management.mp4",

    title: "Kako prijaviti tuđi profil",
    description: "Ovdje ćete naučiti kako prijaviti drugog korisnika.",
    videoUrl: "/videos/profile-management.mp4",

     title: "Kako prijaviti tuđu akciju",
    description: "Ovdje ćete naučiti kako prijaviti akciju u slučaju da sadrži neprikladan sadržaj ili ne verujete istoj.",
    videoUrl: "/videos/profile-management.mp4",

     title: "Kako prijaviti tuđi komentar",
    description: "Ovdje ćete naučiti kako prijaviti neprikladan komentar.",
    videoUrl: "/videos/profile-management.mp4",
  },
];

function GuidePage() {
  return (
    
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-cyan-100 pt-24">
       <NavigationBar showSearch={false} />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-cyan-900 mb-4">Vodič za korištenje platforme</h1>
        <p className="text-center text-gray-700 mb-10 text-lg">
          Ovdje možete pronaći upute i video tutorijale kako biste se lakše snašli na našoj platformi.
        </p>

        {guideSections.map((section, index) => (
          <div key={index} className="mb-16">
            <h2 className="text-2xl font-semibold text-cyan-800 mb-2 text-center">{section.title}</h2>
            <p className="text-gray-700 mb-4 text-center max-w-3xl mx-auto">{section.description}</p>
            <div className="flex justify-center">
              <video
                src={section.videoUrl}
                controls
                className="w-full max-w-3xl rounded-lg shadow-md"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ))}
      </div>
      <InfoFooter></InfoFooter>
    </div>
  );
}

export default GuidePage;
