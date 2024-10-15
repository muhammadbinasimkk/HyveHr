import React, { useState } from 'react';

const UserProfile: React.FC = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('User details updated:', userDetails);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit User Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={userDetails.firstName}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={userDetails.lastName}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
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

export default UserProfile;
