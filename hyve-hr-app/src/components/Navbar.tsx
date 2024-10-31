import React, { useState } from 'react';
import { FaCog, FaQuestion, FaSignOutAlt, FaBars } from 'react-icons/fa'; // Import the hamburger icon
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
  onNavbarChange: (option: string) => void; // Callback to update content in Dashboard
}

const Navbar: React.FC<NavbarProps> = ({ onNavbarChange }) => {
  const { currentUser, logout } = useAuth();
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false); // For mobile menu
  const [activeOption, setActiveOption] = useState<string>('/dashboard'); // Track active option

  const handleLogout = () => {
    logout();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const navbarOptions = [
    { label: t('navbar.dashboard'), path: '/dashboard', hasSubmenu: false },
    { label: t('navbar.company'), path: '/company', hasSubmenu: true },
    { label: t('navbar.employee'), path: '/employee', hasSubmenu: true },
    { label: t('navbar.recruitment'), path: '/recruitment', hasSubmenu: true },
    { label: t('navbar.compliance'), path: '/compliance', hasSubmenu: false },
    { label: t('navbar.benefits'), path: '/benefits', hasSubmenu: true },
    { label: t('navbar.leave'), path: '/leave', hasSubmenu: true },
    { label: t('navbar.learnDevelop'), path: '/learn-develop', hasSubmenu: true },
    { label: t('navbar.performance'), path: '/performance', hasSubmenu: true },
    { label: t('navbar.expenses'), path: '/expenses', hasSubmenu: true },
    { label: t('navbar.reports'), path: '/reports', hasSubmenu: false },
  ];

  const handleOptionClick = (option: string, hasSubmenu: boolean) => {
    setActiveOption(option); // Set the active option
    onNavbarChange(option);
    if (!hasSubmenu) {
      onNavbarChange(''); // Hide sidebar if no submenu
    }
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <nav className="bg-black p-4 text-xs font-tahoma">
      <div className="container mx-auto flex justify-between items-center">
        {/* Hamburger icon for mobile */}
        <button
          className="text-white md:hidden block"
          onClick={toggleMobileMenu}
        >
          <FaBars />
        </button>

        {/* Navbar options for larger screens */}
        <div className="hidden md:flex space-x-4 items-center">
          {navbarOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => handleOptionClick(option.path, option.hasSubmenu)}
              className={`text-white hover:text-gray-300 px-4 py-2 rounded ${
                activeOption === option.path ? 'bg-[#444444] text-gray-300' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-black z-50">
            {navbarOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => handleOptionClick(option.path, option.hasSubmenu)}
                className={`block text-left w-full px-4 py-2 hover:text-gray-400 hover:bg-[#444444] ${
                  activeOption === option.path ? 'bg-[#444444] text-gray-300' : 'text-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Right section with icons */}
        <div className="flex space-x-4 items-center relative text-lg">
          <button onClick={toggleDropdown} className="text-white hover:text-gray-400 focus:outline-none">
            <FaCog className="inline-block mr-1" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
              <Link to="/user-profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                {t('settings.editUserProfile')}
              </Link>
              <Link to="/company-profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                {t('settings.editCompanyProfile')}
              </Link>
            </div>
          )}

          <Link to="/help" className="text-white hover:text-gray-400">
            <FaQuestion className="inline-block mr-1" />
          </Link>
          {currentUser && (
            <button onClick={handleLogout} className="text-white hover:text-gray-400">
              <FaSignOutAlt className="inline-block mr-1" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
