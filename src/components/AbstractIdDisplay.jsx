// src/components/AbstractIdDisplay.jsx
import React from "react";

const AbstractIdDisplay = ({ id, theme, category }) => {
  if (!id) return null;

  return (
    <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Your Unique Abstract ID:
      </p>
      <p className="text-lg font-bold text-blue-800 dark:text-blue-300 break-words">
        {id}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        This ID is generated from: <strong>{theme}</strong> (Theme) +{" "}
        <strong>{category}</strong> (Category) + Your Initials + Date + Time
      </p>
    </div>
  );
};

export default AbstractIdDisplay;
