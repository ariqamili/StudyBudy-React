import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.jsx";
import { Bars3Icon } from "@heroicons/react/24/outline";

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="hidden md:flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>

      <div className="md:hidden">
        <header
          ref={menuRef}
          className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-purple-100 sticky top-0 z-50"
        >
          <div className="flex items-center justify-between p-4">
            <button
              onClick={toggleMobileMenu}
              className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StudyBudy
            </h1>
            <div className="w-11"></div>
          </div>

          <div
            className={`bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileMenuOpen ? "max-h-64 shadow-2xl" : "max-h-0"
            }`}
          >
            <Sidebar isMobile={true} onNavClick={closeMobileMenu} />
          </div>
        </header>

        <main className="min-h-screen">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
