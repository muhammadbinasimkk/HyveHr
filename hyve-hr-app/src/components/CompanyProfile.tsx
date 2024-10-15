import React, { useState } from 'react';

const CompanyProfile: React.FC = () => {
  const [companyDetails, setCompanyDetails] = useState({
    companyName: 'Tech Corp',
    address: '123 Tech Street',
    industry: 'Software',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyDetails({
      ...companyDetails,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Company details updated:', companyDetails);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Company Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={companyDetails.companyName}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={companyDetails.address}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <input
            type="text"
            name="industry"
            value={companyDetails.industry}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded-md">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default CompanyProfile;
