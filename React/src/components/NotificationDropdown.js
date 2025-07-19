import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { BellIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState } from 'react';
import { apiRequest } from '../utility/FetchAPI';
import { AuthStateContext } from '../components/UseAuthState';
import CollabNotification from './CollabNotifications';

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
          <span>Notifikacije</span>
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
                className="w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 focus:outline-none"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={notification.primaryImage}
                    alt="Profilna"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{notification.name}</span>
                    <span className="text-gray-700">{notification.text}</span>
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
