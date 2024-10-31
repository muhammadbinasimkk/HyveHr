import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import translation hook
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Dashboard: React.FC = () => {
  const { t } = useTranslation(); // Translation hook for internationalization
  const [selectedNavbarOption, setSelectedNavbarOption] = useState<string>(''); // Tracks the selected navbar option
  const [selectedFirstLevelOption, setSelectedFirstLevelOption] = useState<string>(''); // Tracks selected first-level option
  const [showSidebar, setShowSidebar] = useState<boolean>(true); // Manages whether to display the sidebar

  const handleNavbarChange = (option: string) => {
    setSelectedNavbarOption(option); // Update the selected navbar option
    setSelectedFirstLevelOption(''); // Reset first-level selection when navbar changes
    setShowSidebar(!!option); // Show or hide sidebar based on the navbar option
  };

  const handleFirstLevelChange = (option: string) => {
    setSelectedFirstLevelOption(option); // Update the selected first-level sidebar option
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Full-width Navbar */}
      <div className="w-full">
        <Navbar onNavbarChange={handleNavbarChange} />
      </div>

      {/* Sidebar and Content below Navbar */}
      <div className="flex flex-1">
        {/* Sidebar on the left */}
        {showSidebar && (
          <Sidebar
            selectedNavbarOption={selectedNavbarOption}
            onFirstLevelChange={handleFirstLevelChange}
            selectedFirstLevelOption={selectedFirstLevelOption}
          />
        )}

        {/* Main content area */}
        <div className={`flex-1 p-4 ${!showSidebar ? 'w-full' : ''}`}>
          <h1 className="text-2xl font-bold mb-4">
            {t('dashboard.selectedOption')}
          </h1>
          <p>
            {selectedNavbarOption && selectedFirstLevelOption
              ? `${t(selectedNavbarOption)} > ${t(selectedFirstLevelOption)}`
              : t('dashboard.selectOption')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
