import React from "react";
import { PencilSquareIcon, EyeIcon } from "@heroicons/react/24/outline";

const ViewEditToggle = ({ viewMode, setViewMode }) => {
  const baseClasses =
    "flex-1 flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold rounded-md transition-colors";
  const activeClasses = "bg-blue-600 text-white shadow";
  // Replace it with this line
  const inactiveClasses =
    "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <div className="max-w-md mx-auto flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
      <button
        onClick={() => setViewMode("edit")}
        className={`${baseClasses} ${
          viewMode === "edit" ? activeClasses : inactiveClasses
        }`}
      >
        <PencilSquareIcon className="h-5 w-5" />
        Edit Form
      </button>
      <button
        onClick={() => setViewMode("view")}
        className={`${baseClasses} ${
          viewMode === "view" ? activeClasses : inactiveClasses
        }`}
      >
        <EyeIcon className="h-5 w-5" />
        View Abstract
      </button>
    </div>
  );
};

export default ViewEditToggle;
