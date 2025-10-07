import React from "react";
// NEW: Replaced ShareIcon with EnvelopeIcon
import {
  Bars3Icon,
  SunIcon,
  MoonIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

// Renamed onShare to onEmail for clarity
const Header = ({ theme, toggleTheme, onDownload }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
        <Bars3Icon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
      </button>

      <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
        Abstract Builder
      </h1>

      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {theme === "dark" ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-800" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
