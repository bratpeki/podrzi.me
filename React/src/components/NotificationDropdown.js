import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { BellIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState } from 'react';
import { apiRequest } from '../utility/FetchAPI';
import { AuthStateContext } from '../components/UseAuthState';
import CollabNotification from './CollabNotifications';
import { Link } from 'react-router-dom';


export default function NotificationDropdown() {
  const { authState } = useContext(AuthStateContext);
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiRequest("notifications/get", "GET", authState.accessToken);
        const data = await res;

        setNotifications(data);
        setUnseenCount(data.filter(n => !n.seen).length);
      } catch (err) {
        console.error("Greška pri dohvatanju notifikacija:", err);
      }
    };

    fetchNotifications();
  }, [authState.accessToken]);

  //Ove dvije funkcije (handleAccept/Decline Collab)sluze da ako korisnik prihvati ili odbije kolaboraciju da se ona izbrise sa notifikacija
  const handleAcceptCollab = (notification) => {
    setNotifications((prev) =>
      prev.filter((n) => n.idNotification !== notification.idNotification)
    );
    setUnseenCount((prev) => Math.max(0, prev - 1));
  };


  const handleDeclineCollab = (notification) => {
    setNotifications((prev) =>
      prev.filter((n) => n.idNotification !== notification.idNotification)
    );
    setUnseenCount((prev) => Math.max(0, prev - 1));
  };








  const markAllAsSeen = async () => {
    const unseenIds = notifications.filter(n => !n.seen).map(n => n.idNotification);

    if (unseenIds.length === 0) return;

    try {
      await apiRequest("notifications/seen", "POST", authState.accessToken, unseenIds);
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
      setUnseenCount(0);
    } catch (error) {
      console.error("Greška pri slanju oznake da su notifikacije viđene:", error);
    }
  };



  return (
    <DropdownMenu.Root onOpenChange={(open) => {
      if (open) markAllAsSeen();
    }}>
      <DropdownMenu.Trigger asChild>
        <button
          onClick={markAllAsSeen}
          className="flex items-center space-x-2 text-white hover:underline relative"
        >
          <div className="relative">
            <BellIcon className="w-6 h-6" />
            {unseenCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {unseenCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline">Notifikacije</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="z-50 w-72 max-h-96 overflow-auto bg-white divide-y divide-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-black"
        align="end"
        sideOffset={8}
      >
        {notifications.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            Nema novih notifikacija
          </div>
        ) : (
          notifications.map((notification) => {
            if (notification.type === 0) {
              return (
                <DropdownMenu.Item key={notification.id} asChild>
                  <div>
                    <CollabNotification
                      notification={notification}
                      onAccept={handleAcceptCollab}
                      onDecline={handleDeclineCollab}
                    />
                  </div>
                </DropdownMenu.Item>
              );
            }

    return (
              <DropdownMenu.Item
                key={notification.id}
                className={`w-full text-left px-4 py-2 text-sm cursor-pointer focus:outline-none transition-colors duration-1000
                  ${notification.seen ? "bg-gray-50 text-gray-500" : "hover:bg-gray-100"}`}
              >
                <div className="flex items-start gap-3">
                  {notification.type !== 2 && (
                    <img
                      src={notification.primaryImage}
                      alt="Profilna"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="flex flex-col">
                    {notification.type === 2 ? (
                      <>
                        <span className="font-semibold text-cyan-700 mb-1">Globalna notifikacija</span>
                        <span className="font-bold text-gray-700">
                          {notification.text}
                        </span>
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/actionView/${notification.idAction}`}
                          state={{ id: notification.idAction }}
                          className={`font-medium text-blue-600 hover:underline transition-colors duration-300 ${notification.seen ? "text-gray-500 font-normal" : ""}`}
                        >
                          {notification.name}
                        </Link>
                        <span className={`transition-colors duration-300 ${notification.seen ? "text-gray-400 font-normal" : "text-gray-700 font-semibold"}`}>
                          {notification.text}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </DropdownMenu.Item>
            );
          })
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
