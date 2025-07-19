import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utility/FetchAPI';
import { useContext } from 'react';
import { AuthStateContext } from '../components/UseAuthState';

export default function CollabNotification({ notification, onAccept, onDecline }) {

    const { authState } = useContext(AuthStateContext);

    const handleAccept = async () => {
        try {
            await apiRequest(
                `notifications/acceptcollab?idAction=${notification.idAction}&idNotification=${notification.idNotification}`,
                "POST",
                authState.accessToken
            );
            onAccept(notification); // pošalji signal parent komponenti da izbaci iz liste
        } catch (error) {
            console.error("Greška pri prihvatanju kolaboracije:", error);
        }
    };

    const handleDecline = async () => {
        try {
            await apiRequest(
                `notifications/denycollab?idNotification=${notification.idNotification}`,
                "POST",
                authState.accessToken
            );
            onDecline(notification);
        } catch (error) {
            console.error("Greška pri odbijanju kolaboracije:", error);
        }
    };


    return (
        <div className="flex items-start justify-between gap-3 px-4 py-2">
            <img
                src={notification.primaryImage}
                alt="Profilna"
                className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex flex-col text-sm text-gray-800 flex-grow">
                <span>
                    <Link to={`/viewProfile/${notification.idSender}`} 
                    state={{ id: notification.idSender }} 
                    className="font-medium text-blue-600 hover:underline">
                        {notification.displayName}
                    </Link>{" "}
                    vas poziva u kolaboraciju za akciju{" "}
                    <Link to={`/actionView/${notification.idAction}`} 
                    state={{ id: notification.idAction }} 
                    className="font-medium text-blue-600 hover:underline">
                        {notification.name}
                    </Link>
                </span>
            </div>

            <div className=" flex flex-col  items-center gap-2">
                <button onClick={handleAccept} className="text-green-600 hover:text-green-800">
                    <CheckIcon className="h-5 w-5" />
                </button>
                <button onClick={handleDecline} className="text-red-600 hover:text-red-800">
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
