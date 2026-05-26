import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../store/useStore";

export default function Sidebar() {
  const location = useLocation();
  const user = useStore((state) => state.user);

  const links = [
    { to: "/", icon: "dynamic_feed", label: "Feed", fill: true },
    { to: "/network", icon: "group", label: "Network", fill: false },
    {
      to: "/post",
      icon: "add_circle",
      label: "Post",
      fill: false,
      mobileOnly: true,
    },
    { to: "/events", icon: "event", label: "Events", fill: false },
    { to: "/profile", icon: "person", label: "Profile", fill: false },
    { to: "/settings", icon: "settings", label: "Settings", fill: false },
  ];

  if (user.isAdmin) {
    links.push({
      to: "/admin",
      icon: "admin_panel_settings",
      label: "Admin",
      fill: false,
    });
  }

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-primary border-r border-primary-container p-4">
        <nav className="flex flex-col gap-2">
          {links
            .filter((l) => !l.mobileOnly)
            .map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? "bg-white/10 text-white font-bold" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings:
                        isActive || link.fill ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {link.icon}
                  </span>
                  <span className="font-label-md">{link.label}</span>
                </Link>
              );
            })}
        </nav>
      </aside>

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
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings:
                    isActive || link.fill ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {link.icon}
              </span>
              <span className="text-[11px] font-semibold font-sans uppercase tracking-wider mt-1">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
