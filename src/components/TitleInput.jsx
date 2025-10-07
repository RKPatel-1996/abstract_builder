import React from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

const TitleInput = ({
  title,
  setTitle,
  hasOrganism,
  setHasOrganism,
  organisms,
  onAddOrganism,
  onRemoveOrganism,
  onUpdateOrganism,
}) => {
  const handleOrganismChange = (id, field, value) => {
    if (field === "genus") {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    } else if (field === "species") {
      value = value.toLowerCase();
    }
    onUpdateOrganism(id, field, value);
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">
        1. Abstract Title
      </h3>
      <div className="mb-4">
        <label
          htmlFor="abstractTitle"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Enter the full title of your abstract
        </label>
        <input
          type="text"
          id="abstractTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTitle(title.trim())} // <-- ADD THIS LINE
          placeholder="e.g., A Comparative Study of Escherichia coli and Staphylococcus aureus"
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="hasOrganism"
          checked={hasOrganism}
          onChange={(e) => setHasOrganism(e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          htmlFor="hasOrganism"
          className="ml-2 block text-sm text-gray-900 dark:text-gray-200"
        >
          Does your text contain scientific names for organisms?
        </label>
      </div>
      {hasOrganism && (
        <div className="p-4 border-t dark:border-gray-700 space-y-4">
          {organisms.map((org) => (
            <div
              key={org.id}
              className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center"
            >
              <div className="sm:col-span-2">
                <label
                  htmlFor={`genus-${org.id}`}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Genus
                </label>
                <input
                  type="text"
                  id={`genus-${org.id}`}
                  value={org.genus}
                  onChange={(e) =>
                    handleOrganismChange(org.id, "genus", e.target.value)
                  }
                  placeholder="e.g., Escherichia"
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor={`species-${org.id}`}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Species
                </label>
                <input
                  type="text"
                  id={`species-${org.id}`}
                  value={org.species}
                  onChange={(e) =>
                    handleOrganismChange(org.id, "species", e.target.value)
                  }
                  placeholder="e.g., coli"
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="self-end text-right">
                <button
                  onClick={() => onRemoveOrganism(org.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={onAddOrganism}
            className="flex items-center justify-center gap-2 w-full mt-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 border-2 border-dashed rounded-md hover:bg-blue-50 dark:hover:bg-gray-700"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Add Organism
          </button>
        </div>
      )}
    </div>
  );
};
export default TitleInput;
