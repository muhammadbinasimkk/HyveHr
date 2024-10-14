// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth(); // Access currentUser and logout from AuthContext

  const handleLogout = () => {
    logout(); // Call the logout function to log the user out
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">HyveHR</div>
        <div className="flex space-x-4">
          <Link to="/settings" className="text-white hover:text-gray-400">
            Settings
          </Link>
          <Link to="/help" className="text-white hover:text-gray-400">
            Help
          </Link>
          {currentUser && (
            <button onClick={handleLogout} className="text-white hover:text-gray-400">
              Log Out
            </button>
          )}
        </div>
      </div>
      <div className="mt-2">
        <div className="container mx-auto flex space-x-4 gap-4">
          <Link to="/company" className="text-gray-300 hover:text-gray-400">
            Company
          </Link>
          <Link to="/employee" className="text-gray-300 hover:text-gray-400">
            Employee
          </Link>
          <Link to="/recruitment" className="text-gray-300 hover:text-gray-400">
            Recruitment
          </Link>
          <Link to="/compliance" className="text-gray-300 hover:text-gray-400">
            Compliance
          </Link>
          <Link to="/benefits" className="text-gray-300 hover:text-gray-400">
            Benefits
          </Link>
          <Link to="/leave" className="text-gray-300 hover:text-gray-400">
            Leave
          </Link>
          <Link to="/learn-develop" className="text-gray-300 hover:text-gray-400">
            Learn & Develop
          </Link>
          <Link to="/performance" className="text-gray-300 hover:text-gray-400">
            Performance
          </Link>
          <Link to="/expenses" className="text-gray-300 hover:text-gray-400">
            Expenses
          </Link>
          <Link to="/reports" className="text-gray-300 hover:text-gray-400">
            Reports
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
