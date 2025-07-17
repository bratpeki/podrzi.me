import React, {useContext, useState} from 'react';
import NavigationBar from '../components/NavigationHeader';
import InfoFooter from '../components/InfoFooter';
import {AuthStateContext} from '../components/UseAuthState';
import {apiRequest} from '../utility/FetchAPI';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const StarRating = ({totalStars = 5, onRatingChange}) => {
    const [rating, setRating] = useState(0);

    const handleClick = (value) => {
        setRating(value);
        if (onRatingChange) onRatingChange(value);
    };

    return (
        <div className="flex space-x-1 justify-center">
            {[...Array(totalStars)].map((_, i) => {
                const starValue = i + 1;
                return (
                    <svg
                        key={i}
                        onClick={() => handleClick(starValue)}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-10 w-10 cursor-pointer ${
                            starValue <= rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.448a1 1 0 00-.364 1.118l1.286 3.946c.3.921-.755 1.688-1.54 1.118l-3.36-2.448a1 1 0 00-1.175 0l-3.36 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.946a1 1 0 00-.364-1.118L2.075 9.373c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.946z"/>
                    </svg>
                );
            })}
        </div>
    );
};

function ReviewPage() {

    const {authState, authDispatch} = useContext(AuthStateContext);
    const notification = withReactContent(Swal);

    const [formData, setFormData] = useState({
        stars: 0,
        text: ''
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            "text": formData.text,
            "stars": formData.stars
        };

        try {
            const response = await apiRequest("reviews/addreview", "POST", authState.accessToken, payload)
            if (response == "success") {
                await notification.fire({
                    title: 'Uspješno!',
                    text: 'Hvala vam na recenziji!',
                    icon: 'success',
                    confirmButtonText: 'U redu',
                });
                setFormData({text: '', stars: 0});
            } else if (response == "reviewExistsError"){
                await notification.fire({
                    title: 'Greška!',
                    text: 'Vec ste poslali recenziju!',
                    icon: 'error',
                    confirmButtonText: 'U redu',
                });
            } else {
                await notification.fire({
                    title: 'Greška!',
                    text: 'Greška prilikom slanja recenzije!',
                    icon: 'error',
                    confirmButtonText: 'U redu',
                });
            }
        } catch (error) {
            await notification.fire({
                title: 'Greška!',
                text: error || 'Došlo je do greške pri slanju.', //Error poslije izbacit (ostaviti za debug)
                icon: 'error',
                confirmButtonText: 'U redu',
            });
        }
    };

    return (
        <div className=" bg-gray-100 flex flex-col min-h-screen justify-between">
            <NavigationBar showSearch={false}/>
            <div className="flex-grow flex justify-center items-center px-4 pt-12 pb-24">
                <div className="bg-white rounded-lg shadow-md max-w-3xl w-full p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Ostavite recenziju</h1>
                    <form onSubmit={handleSubmit} className="text-2xl font-bold space-y-4">

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-center"
                                   htmlFor="stars">Ocjena</label>
                            <StarRating
                                totalStars={5}
                                onRatingChange={(value) => setFormData(prev => ({ ...prev, stars: value }))}
                                value={formData.stars}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-center"
                                   htmlFor="text">Poruka</label>
                            <textarea
                                id="text"
                                name="text"
                                rows="5"
                                value={formData.text}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-normal"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
                        >
                            Pošalji poruku
                        </button>

                    </form>
                </div>
            </div>
            <InfoFooter/>
        </div>
    );
}

export default ReviewPage;
