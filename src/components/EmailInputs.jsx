import React from "react";

const EmailInputs = ({
  email,
  setEmail,
  secondaryEmail,
  setSecondaryEmail,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">
        3. Contact Information
      </h3>

      {/* Corresponding Author's Email */}
      <div className="mb-4">
        <label
          htmlFor="correspondingEmail"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Corresponding Author's Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="correspondingEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g., priya.sharma@email.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>

      {/* Secondary Email (Optional) */}
      <div>
        <label
          htmlFor="secondaryEmail"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Secondary Email (Optional)
        </label>
        <input
          type="email"
          id="secondaryEmail"
          value={secondaryEmail}
          onChange={(e) => setSecondaryEmail(e.target.value)}
          placeholder="Optional backup email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
    </div>
  );
};

export default EmailInputs;
