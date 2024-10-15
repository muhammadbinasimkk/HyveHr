import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import logo from '../assets/HHrLogo1.png';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth(); // Access currentUser and logout from AuthContext
  const { t } = useTranslation(); // Use t function to access translations
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Call the logout function to log the user out
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown state
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img
            src={logo} // Replace with your logo path
            alt="Logo"
            className="h-8 w-16" // Adjust height and width of the logo as needed
          />
        </Link>

        {/* Right Side Menu Links */}
        <div className="flex space-x-4 items-center relative">
          {/* Dropdown for Settings */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-white hover:text-gray-400 focus:outline-none"
            >
              {t('navbar.settings')} {/* Translation for "Settings" */}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <Link
                  to="/user-profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)} // Close dropdown when clicked
                >
                  {t('settings.editUserProfile')}
                </Link>
                <Link
                  to="/company-profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)} // Close dropdown when clicked
                >
                  {t('settings.editCompanyProfile')}
                </Link>
              </div>
            )}
          </div>

          <Link to="/help" className="text-white hover:text-gray-400">
            {t('navbar.help')} {/* Translation for "Help" */}
          </Link>

          {/* Display Log Out button if user is logged in */}
          {currentUser && (
            <button onClick={handleLogout} className="text-white hover:text-gray-400">
              {t('navbar.logout')} {/* Translation for "Log Out" */}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Menu Links */}
      <div className="mt-2">
        <div className="container mx-auto flex space-x-4 gap-4">
          <Link to="/company" className="text-gray-300 hover:text-gray-400">
            {t('navbar.company')} {/* Translation for "Company" */}
          </Link>
          <Link to="/employee" className="text-gray-300 hover:text-gray-400">
            {t('navbar.employee')} {/* Translation for "Employee" */}
          </Link>
          <Link to="/recruitment" className="text-gray-300 hover:text-gray-400">
            {t('navbar.recruitment')} {/* Translation for "Recruitment" */}
          </Link>
          <Link to="/compliance" className="text-gray-300 hover:text-gray-400">
            {t('navbar.compliance')} {/* Translation for "Compliance" */}
          </Link>
          <Link to="/benefits" className="text-gray-300 hover:text-gray-400">
            {t('navbar.benefits')} {/* Translation for "Benefits" */}
          </Link>
          <Link to="/leave" className="text-gray-300 hover:text-gray-400">
            {t('navbar.leave')} {/* Translation for "Leave" */}
          </Link>
          <Link to="/learn-develop" className="text-gray-300 hover:text-gray-400">
            {t('navbar.learnDevelop')} {/* Translation for "Learn & Develop" */}
          </Link>
          <Link to="/performance" className="text-gray-300 hover:text-gray-400">
            {t('navbar.performance')} {/* Translation for "Performance" */}
          </Link>
          <Link to="/expenses" className="text-gray-300 hover:text-gray-400">
            {t('navbar.expenses')} {/* Translation for "Expenses" */}
          </Link>
          <Link to="/reports" className="text-gray-300 hover:text-gray-400">
            {t('navbar.reports')} {/* Translation for "Reports" */}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
