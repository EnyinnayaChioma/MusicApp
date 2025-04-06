import React from "react";
import overlay from "../assets/overlay.png";
import { Link, useLocation } from "react-router-dom";

function SideBar() {
  const location = useLocation();
  
  // Navigation items grouped by category
  const mainNavItems = [
    { icon: "fi-rs-home", label: "Home", path: "/home" },
    { icon: "fi-rs-folder-music", label: "Library", path: "/library" },
    { icon: "fi-rs-album-collection", label: "Albums", path: "/albums" },
    { icon: "fi-rs-mouse-pointer-heart", label: "Favorites", path: "/favorites" },
  ];
  
  const accountNavItems = [
    { icon: "fi-rs-user-trust", label: "Profile", path: "/profile" },
    { icon: "fi-rs-settings", label: "Settings", path: "/settings" },
    { icon: "fi-rs-sign-out-alt", label: "Logout", path: "/logout" },
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="h-screen w-64 fixed inset-y-0 left-0 bg-gray-900 text-white shadow-lg z-10 border-r border-gray-800">
      <div className="relative h-full flex flex-col">
        {/* Logo area */}
        <div className="px-6 py-8">
          <h1 className="text-2xl font-semibold">Music App</h1>
        </div>
        
        {/* Background overlay */}
        <div className="absolute left-0 top-1/3 h-1/2 w-full pointer-events-none overflow-hidden opacity-20">
          <img
            src={overlay}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Main navigation */}
        <nav className="flex-1 px-4 py-4 z-10">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-[#FBBC05] text-white"
                    : "text-gray-300 hover:bg-[#FBBC05] hover:text-white"
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
        
        {/* Account section */}
        <div className="px-4 py-4 border-t border-gray-800">
          <p className="px-4 text-xs uppercase tracking-wider text-gray-400 mb-2">
            Account
          </p>
          <div className="space-y-1">
            {accountNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-[#FBBC05] text-white"
                    : "text-gray-300 hover:bg-[#FBBC05] hover:text-white"
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;