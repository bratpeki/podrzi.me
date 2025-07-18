// src/components/NotificationDropdown.js
import { Menu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const dummyNotifications = [
  {
    id: 1,
    message: "Zahtjev za kolaboraciju od Marka",
    type: "collab",
    seen: false,
  },
  {
    id: 2,
    message: "Akcija 'Donacija' dostigla cilj!",
    type: "goal",
    seen: false,
  },
  { id: 3, message: "Podsjetnik: Rok se bliži", type: "reminder", seen: false },
];

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const unseenCount = notifications.filter((n) => !n.seen).length;

  const markAllAsSeen = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        onClick={markAllAsSeen}
        className="flex items-center space-x-2 text-white hover:underline"
      >
        <div className="relative">
          <BellIcon className="w-6 h-6" />
          {unseenCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {dummyNotifications.length}
            </span>
          )}
        </div>
        <span>Notifikacije</span>
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-72 bg-white divide-y divide-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 text-black">
        {dummyNotifications.map((notification) => (
          <Menu.Item key={notification.id}>
            {({ active }) => (
              <div
                className={`px-4 py-2 text-sm ${active ? "bg-gray-100" : ""}`}
              >
                {notification.message}
              </div>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
