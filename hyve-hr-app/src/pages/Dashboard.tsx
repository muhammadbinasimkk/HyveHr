// src/components/Dashboard.tsx
import React from 'react';
import Navbar from '../components/Navbar'; // Import the Navbar component

const Dashboard: React.FC = () => {
  return (
    <div>
      <Navbar /> {/* Add Navbar at the top */}
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* Dashboard content goes here */}
      </div>
    </div>
  );
};

export default Dashboard;
