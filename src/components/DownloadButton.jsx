// src/components/DownloadButton.jsx
import React from "react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

const DownloadButton = ({ onDownload }) => {
  return (
    <div className="flex flex-col items-center p-4 mt-8">
      <button
        onClick={onDownload}
        className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        <DocumentArrowDownIcon className="w-6 h-6 mr-3" />
        Download Abstract
      </button>

      {/* --- NEW NOTICE --- */}
      <p className="mt-3 text-xl font-semibold text-yellow-600 dark:text-yellow-400">
        Don't forget to attach the abstract in your email!
      </p>
      {/* ------------------ */}
    </div>
  );
};

export default DownloadButton;
