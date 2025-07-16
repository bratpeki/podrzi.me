import React, { useContext, useEffect, useState } from "react";

// U ProfilePage šaljemo "state"
// Ovde ga dobavljamo sa "location.state"
import { useLocation } from 'react-router-dom';

import { AuthStateContext } from "../components/UseAuthState";
import NavigationBar from "../components/NavigationHeader";
import InfoFooter from "../components/InfoFooter";

function ViewDonationsPage() {

  const location = useLocation();
  const { idUser } = location.state || {};

  const [dons, setDons] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  const { authState } = useContext(AuthStateContext);

	useEffect( () => {

		const fetchDons = async () => {
		  try {
			  // TODO: Deprekacija, valjda mijenjamo await fetch sa apiRequest
			  const res = await fetch("http://podrzime.ddns.net:8080/api/donations/getdonationsuser?idUser=" + idUser, {
			  // const res = await fetch("http://podrzime.ddns.net:8080/api/donations/getdonationsuser?idUser=48", {
			  method: 'GET',
			  headers: {
				'Content-Type': 'application/json',
				'token': authState.accessToken,
			  }
			});

			const responseBodyText = await res.text();

			if (responseBodyText === "wrongUserError") {
				setResponseMessage("Korisnik nije prepoznat!");
				throw new Error("Korisnik nije prepoznat!");
			}

			const data = JSON.parse(responseBodyText);
			// Za potrebe testiranja mnogo elemenata
			// Ispašće upozorenje za mnogo identičnih key-eva, ali to nam je nebitno
			// for ( let i = 0; i < 20; i++ ) data.push(data[0]);

			for (let i = 0; i < data.length; i++) {
				let resImg = await fetch(
					"http://podrzime.ddns.net:8080/api/images/getprimaryimage?idAction=" + data[i].idAction,
					{
						method: 'GET',
						'token': authState.accessToken,
					}
				);
				let imgResponse = await resImg.text();
				data[i].img = imgResponse;
			}

			setDons(data);


		  } catch (err) {
				console.error('Greška pri učitavanju donacija:', err.message);
				setResponseMessage('Greška pri učitavanju donacija: ' + err.message);
		  }

		};

    if (authState?.accessToken) fetchDons();
	}, [authState, idUser]);

  return (

    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Navigation Bar */}
    <NavigationBar showSearch={true} />

      <header className="text-center mt-12 mb-6 pt-10">
        <h1 className="text-5xl font-bold text-gray-800">
          Pregled doniranim akcija
        </h1>
      </header>

        {responseMessage && (
          <p className="text-center text-sm text-red-600 mb-2">
            {responseMessage}
          </p>
        )}

		{ /* Margina se stavlja na bottom da blok ne upada u footer */ }
		<div className="mb-14">

		{
			dons.map(
				donation =>
				<div key={donation.idDonation} className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 w-9/12 min-w-max mx-auto flex justify-between items-center">
					<div className="w-2/3">
						<h3 className="text-xl font-semibold text-gray-800 mb-2">
							Akcija: {donation.actionName}
						</h3>
						<p className="text-gray-700 mb-1">
							<span className="font-medium">Iznos donacije:</span> {donation.amount} KM
						</p>
						<p className="text-gray-600 text-sm">
							<span className="font-medium">Vrijeme donacije:</span>{" "}
							{new Date(donation.donationTime).toLocaleString()}
						</p>
					</div>
					<img src={donation.img} alt={`Image for ${donation.actionName}`} className="w-1/3 h-48 object-cover rounded-md ml-4"/> {/* Image explicitly takes 1/3 and has left margin */}
				</div>
			)
		}

		</div>

      {/* Footer */}
      <InfoFooter />

    </div>

  );

}

export default ViewDonationsPage;
