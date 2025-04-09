import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function SideBar() {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if screen is mobile on component mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on small screens
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Generate placeholder overlay gradient instead of using image
  const overlayStyle = {
    background: "radial-gradient(circle, rgba(251,188,5,0.1) 0%, rgba(0,0,0,0) 70%)",
    position: "absolute",
    left: 0,
    top: "33%",
    height: "50%",
    width: "100%",
    pointerEvents: "none",
    opacity: 0.2,
  };

  return (
    <>
      {/* Toggle button for mobile - fixed to the side of the screen */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-30 bg-gray-800 text-white p-2 rounded-md shadow-lg"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? (
          <i className="fi-rs-cross text-lg"></i>
        ) : (
          <i className="fi-rs-menu-burger text-lg"></i>
        )}
      </button>
      
      {/* Overlay for mobile - only shown when sidebar is open on mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`h-screen fixed inset-y-0 left-0 bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out z-20 border-r border-gray-800 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isMobile ? 'w-64' : 'w-64 md:translate-x-0'}`}
      >
        <div className="relative h-full flex flex-col">
          {/* Logo area */}
          <div className="px-6 py-8 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Music App</h1>
            {/* Close button only visible on mobile when sidebar is open */}
            {isMobile && (
              <button 
                onClick={toggleSidebar}
                className="text-gray-300 hover:text-white"
                aria-label="Close Sidebar"
              >
                <i className="fi-rs-cross text-lg"></i>
              </button>
            )}
          </div>
          
          {/* Background overlay */}
          <div style={overlayStyle}></div>
          
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
                  onClick={() => isMobile && setSidebarOpen(false)}
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
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  <span className="ml-3 font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
      
      {/* Content spacing for desktop */}
      <div className={`transition-all duration-300 ease-in-out ${
        !isMobile && 'md:ml-64'
      }`}>
      </div>
    </>
  );
}

export default SideBar;