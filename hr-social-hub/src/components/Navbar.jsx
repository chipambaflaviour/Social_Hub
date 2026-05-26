import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../store/useStore";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const user = useStore((state) => state.user);
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return null;

  const notifications = [];

  const links = [
    { to: "/", icon: "dynamic_feed", label: "Feed", mobileOnly: false },
    { to: "/network", icon: "group", label: "Network", mobileOnly: false },
    { to: "/post", icon: "add_circle", label: "Post", mobileOnly: true },
    { to: "/events", icon: "event", label: "Events", mobileOnly: false },
    { to: "/profile", icon: "person", label: "Profile", mobileOnly: false },
    { to: "/settings", icon: "settings", label: "Settings", mobileOnly: false },
  ];

  if (user?.isAdmin) {
    links.push({
      to: "/admin",
      icon: "admin_panel_settings",
      label: "Admin",
      mobileOnly: false,
    });
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src={user.avatar}
            />
          </div>
          <Link to="/" className="flex flex-col justify-center">
            <div className="text-xl font-black font-sans tracking-tight leading-none">
              <span className="text-primary">Axis</span>
              <span className="text-on-surface">Solutions</span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest leading-none mt-1 hidden sm:block">
              Northern Region Social Hub
            </span>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest leading-none mt-1 sm:hidden">
              Social Hub
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-2 flex-1">
          {links
            .filter((l) => !l.mobileOnly)
            .map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary font-bold" : "text-gray-600 hover:bg-gray-50 hover:text-primary"}`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {link.icon}
                  </span>
                  <span className="font-label-md">{link.label}</span>
                </Link>
              );
            })}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              useStore.setState({ user: null });
              window.location.href = "/login";
            }}
            className="flex items-center gap-1 text-red-900 font-label-sm font-bold p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[18px]">
              logout
            </span>
            <span className="hidden sm:block">Sign Out</span>
          </button>
          <button className="p-2 text-red-900 transition-colors duration-200 hover:bg-gray-50 rounded-full">
            <span className="material-symbols-outlined">search</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-500 hover:bg-gray-50 transition-colors duration-200 relative rounded-full"
            >
              <span className="material-symbols-outlined">notifications</span>
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-surface-container overflow-hidden z-50">
                <div className="p-4 border-b border-surface-container flex justify-between items-center bg-surface-container-lowest">
                  <h3 className="font-headline-sm text-on-surface">
                    Notifications
                  </h3>
                  {notifications.length > 0 && (
                    <button className="text-primary font-label-sm hover:underline">
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
                        notifications_paused
                      </span>
                      <p className="font-body-md italic">
                        No new notifications.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-surface-container-highest hover:bg-surface-container-lowest transition-colors flex items-start gap-3 cursor-pointer ${notif.read ? "opacity-60" : "bg-surface-bright"}`}
                      >
                        <div
                          className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"
                          style={{ opacity: notif.read ? 0 : 1 }}
                        ></div>
                        <div>
                          <p className="font-body-md text-on-surface">
                            {notif.text}
                          </p>
                          <p className="font-label-sm text-on-surface-variant mt-1">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 text-center bg-surface-container-lowest hover:bg-surface-container cursor-pointer transition-colors border-t border-surface-container">
                  <span className="font-label-md text-primary">
                    View all notifications
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center transition-transform scale-95 active:scale-90 ${isActive ? "text-red-900" : "text-gray-500 hover:text-red-800"}`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {link.icon}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold font-sans uppercase tracking-wider mt-1 truncate max-w-[50px] text-center">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
