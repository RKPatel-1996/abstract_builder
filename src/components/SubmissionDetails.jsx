// src/components/SubmissionDetails.jsx
import React from "react";

const SubmissionDetails = ({
  category,
  setCategory,
  selectedTheme,
  setSelectedTheme,
  themes,
  presentingAuthor,
  setPresentingAuthor,
}) => {
  const selectClasses = `mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white`;
  const promptClasses = ` text-red-500 dark:text-yellow-400 font-semibold`;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">
        Submission Details
      </h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="conference-theme"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select Conference Theme <span className="text-red-500">*</span>
          </label>
          <select
            id="conference-theme"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            // Apply conditional styling here
            className={
              !selectedTheme ? selectClasses + promptClasses : selectClasses
            }
            required
          >
            {/* Add this disabled "prompt" option */}
            <option value="" disabled>
              -- Please select a theme --
            </option>
            {themes.map((theme) => (
              <option key={theme.code} value={theme.code}>
                {theme.code}: {theme.title}
              </option>
            ))}
          </select>
        </div>
        {/* ------------------------- */}

        <div>
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Presentation Type
          </p>
          <div className="flex gap-10 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value="YIT"
                checked={category === "YIT"}
                onChange={(e) => setCategory(e.target.value)}
                className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-900 dark:text-gray-100">
                Young Investigator Talk
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value="PP"
                checked={category === "PP"}
                onChange={(e) => setCategory(e.target.value)}
                className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-900 dark:text-gray-100">
                Poster Presentation
              </span>
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="presenting-author"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name of Presenting Author
          </label>
          <input
            type="text"
            id="presenting-author"
            value={presentingAuthor}
            onChange={(e) => setPresentingAuthor(e.target.value)}
            onBlur={() => setPresentingAuthor(presentingAuthor.trim())}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Priya Sharma"
          />
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;
