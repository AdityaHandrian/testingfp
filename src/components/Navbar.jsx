import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '../utils/constants';
import { useAuthContext } from '../contexts/AuthContext';

// Desktop Authentication Section
function AuthSection() {
  const { user, logout } = useAuthContext();

  if (user) {
    return (
      <div className="hidden md:flex items-center space-x-4">
        <span className="text-sm">{user.name}</span>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link
        to={ROUTES.LOGIN}
        className="px-4 py-2 rounded-md bg-white text-blue-600 font-medium hover:bg-gray-100 transition-colors"
      >
        Login
      </Link>
    </div>
  );
}

// Mobile Authentication Section (untuk tampilan HP)
function MobileAuthSection({ setIsOpen }) {
  const { user, logout } = useAuthContext();

  if (user) {
    return (
      <div className="border-t border-blue-500 mt-2 pt-2">
        <div className="px-3 py-2 rounded-md text-base font-medium">
          {user.name}
        </div>
        <button
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
          className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link
      to={ROUTES.LOGIN}
      onClick={() => setIsOpen(false)}
      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500"
    >
      Login
    </Link>
  );
}

// Main Navbar
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Beranda', path: ROUTES.HOME },
    { name: 'Rekomendasi', path: ROUTES.RECOMMENDATION },
    { name: 'Analisis Sentimen', path: ROUTES.SENTIMENT },
    { name: 'Dashboard', path: ROUTES.DASHBOARD },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white text-blue-600 rounded-lg flex items-center justify-center font-bold">
              RS
            </div>
            <span className="hidden sm:inline text-lg font-bold">RecSystem</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-blue-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Links (Desktop) */}
          <AuthSection />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-blue-500 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-800 text-white'
                    : 'hover:bg-blue-500'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Login / Username + Logout */}
            <MobileAuthSection setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </nav>
  );
}
