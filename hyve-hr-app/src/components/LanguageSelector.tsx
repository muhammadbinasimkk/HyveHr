import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronUp } from 'react-icons/fa'; // For a drop-up icon

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="font-tahoma fixed bottom-4 left-4 z-50">
      <div className="relative">
        {/* Button to open the drop-up menu */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex text-sm items-center py-2 px-4 bg-transparent text-black hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
        >
          {i18n.language === 'en' ? 'English' : 'Français'}
          <FaChevronUp className="ml-2" />
        </button>

        {/* Drop-up menu */}
        {isOpen && (
          <div className="absolute left-0 bottom-10 w-36 bg-gray-100 bg-opacity-90 text-black rounded-sm shadow-lg">
            <button
              onClick={() => changeLanguage('en')}
              className="block w-full py-2 px-4 text-left hover:bg-gray-300 focus:outline-none"
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('fr')}
              className="block w-full py-2 px-4 text-left hover:bg-gray-300 focus:outline-none"
            >
              Français
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
