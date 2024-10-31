import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the translation hook

interface SidebarProps {
  selectedNavbarOption: string;
  onFirstLevelChange: (option: string) => void;
  selectedFirstLevelOption: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedNavbarOption,
  onFirstLevelChange,
  selectedFirstLevelOption,
}) => {
  const { t } = useTranslation(); // Use translation hook

  // First-level and second-level options based on the navbar selection
  const sidebarOptions: { [key: string]: { [key: string]: string[] } } = {
    '/company': {
      [t('sidebar.home')]: [],
      [t('sidebar.setup')]: [t('sidebar.details'), t('sidebar.payrollSchedule')],
      [t('sidebar.authorize')]: [
        `${t('sidebar.active')} (${t('sidebar.employeeUpdate')}, ${t('sidebar.employeeAdd')})`,
        `${t('sidebar.inactive')} (${t('sidebar.appDownload')})`,
        t('sidebar.reimburse'),
        t('sidebar.travel'),
      ],
      [t('sidebar.teams')]: [],
      [t('sidebar.deptts')]: [t('sidebar.home'), `${t('sidebar.setup')} (${t('sidebar.addNewDeptt')}, ${t('sidebar.updateDeptt')})`],
      [t('sidebar.jobTitle')]: [t('sidebar.addNew'), t('sidebar.update')],
    },
    '/employee': {
      [t('sidebar.home')]: [],
      [t('sidebar.setup')]: [t('sidebar.manual'), t('sidebar.fileImport'), t('sidebar.api')],
      [t('sidebar.salary')]: [t('sidebar.manual'), t('sidebar.fileImport'), t('sidebar.td1Fed'), t('sidebar.td1Prov')],
      [t('sidebar.selfServe')]: [t('sidebar.home'), t('sidebar.setup')],
      [t('sidebar.benefits')]: [t('sidebar.listOfEmployees')],
      [t('sidebar.evaluation')]: [t('sidebar.listOfEmployees')],
      [t('sidebar.training')]: [t('sidebar.listOfEmployees')],
    },
    '/recruitment': {
      [t('sidebar.home')]: [],
      [t('sidebar.hiring')]: [t('sidebar.newJob'), t('sidebar.posted'), t('sidebar.interview'), t('sidebar.completed')],
      [t('sidebar.onBoarding')]: [t('sidebar.preBoarding'), t('sidebar.welcome')],
      [t('sidebar.offBoarding')]: [t('sidebar.listOfEmployees')],
    },
    '/benefits': {
      [t('sidebar.home')]: [],
      [t('sidebar.setup')]: [t('sidebar.addNew'), `${t('sidebar.active')} (${t('sidebar.health')}, ${t('sidebar.cellPhone')}, ${t('sidebar.spHolidays')})`, `${t('sidebar.inactive')} (${t('sidebar.sick')}, ${t('sidebar.extraDays')})`],
      [t('sidebar.providers')]: [t('sidebar.addNew'), t('sidebar.listOfProviders')],
    },
    '/leave': {
      [t('sidebar.home')]: [],
      [t('sidebar.employees')]: [t('sidebar.listOfEmployees')],
      [t('sidebar.vacation')]: [t('sidebar.home'), t('sidebar.provRules'), t('sidebar.customRules')],
      [t('sidebar.benefits')]: [t('sidebar.home'), t('sidebar.setup')],
    },
    '/learn-develop': {
      [t('sidebar.home')]: [],
      [t('sidebar.setup')]: [t('sidebar.addNew'), t('sidebar.listOfDesignations')],
    },
    '/performance': {
      [t('sidebar.home')]: [],
      [t('sidebar.manage')]: [t('sidebar.current'), t('sidebar.completed')],
    },
    '/expenses': {
      [t('sidebar.home')]: [],
      [t('sidebar.setup')]: [t('sidebar.addNew'), `${t('sidebar.active')} (${t('sidebar.travel')}, ${t('sidebar.fuel')}, ${t('sidebar.food')})`, `${t('sidebar.inactive')} (${t('sidebar.purchases')})`],
    },
  };

  const firstLevelOptions = Object.keys(sidebarOptions[selectedNavbarOption] || {});
  const secondLevelOptions = sidebarOptions[selectedNavbarOption]?.[selectedFirstLevelOption] || [];

  return (
    <div className="flex font-tahoma">
      {/* First-level Sidebar */}
      <div className="w-40 bg-[#333333] text-white p-4">
        {firstLevelOptions.map((option) => (
          <button
            key={option}
            onClick={() => onFirstLevelChange(option)}
            className={`hover:bg-[#444444] block w-full text-left px-4 py-2 mb-8 ${
              selectedFirstLevelOption === option ? 'bg-[#222222]' : ''
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Second-level Sidebar */}
      {secondLevelOptions.length > 0 && (
        <div className="w-60 bg-[#ededed] p-4">
          {secondLevelOptions.map((subOption) => (
            <button key={subOption} className="block w-full text-left px-4 py-2 mb-2 hover:bg-[#dad7d7]">
              {subOption}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
