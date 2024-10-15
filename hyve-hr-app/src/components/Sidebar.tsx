// src/components/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-1/4 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <ul className="space-y-2">
        {/* Links to different settings options */}
        <li>
          <Link to="/dashboard/settings/user-profile" className="hover:text-gray-400">
            Edit User Profile
          </Link>
        </li>
        <li>
          <Link to="/dashboard/settings/company-profile" className="hover:text-gray-400">
            Edit Company Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
