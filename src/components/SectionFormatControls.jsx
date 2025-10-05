import React from "react";

const SectionFormatControls = ({ sectionName, formatting, onChange }) => {
  const handleUpdate = (key, value) => {
    // Convert value to number if it's a numeric input
    const numericValue = ["fontSize", "lineSpacing"].includes(key)
      ? parseFloat(value)
      : value;
    onChange(sectionName, key, numericValue);
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-3 mt-4 rounded-md border dark:border-gray-700">
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
        Section Formatting
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Alignment */}
        <div>
          <label
            htmlFor={`${sectionName}-alignment`}
            className="block text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            Alignment
          </label>
          <select
            id={`${sectionName}-alignment`}
            value={formatting.alignment || ""}
            onChange={(e) => handleUpdate("alignment", e.target.value)}
            className="w-full mt-1 text-sm py-1 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Default</option>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justified">Justified</option>
          </select>
        </div>
        {/* Font Size */}
        <div>
          <label
            htmlFor={`${sectionName}-fontSize`}
            className="block text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            Font Size
          </label>
          <select
            id={`${sectionName}-fontSize`}
            value={formatting.fontSize || ""}
            onChange={(e) => handleUpdate("fontSize", e.target.value)}
            className="w-full mt-1 text-sm py-1 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Default</option>
            <option value="10">10 pt</option>
            <option value="11">11 pt</option>
            <option value="12">12 pt</option>
            <option value="14">14 pt</option>
            <option value="16">16 pt</option>
          </select>
        </div>
        {/* Line Spacing */}
        <div>
          <label
            htmlFor={`${sectionName}-lineSpacing`}
            className="block text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            Line Spacing
          </label>
          <select
            id={`${sectionName}-lineSpacing`}
            value={formatting.lineSpacing || ""}
            onChange={(e) => handleUpdate("lineSpacing", e.target.value)}
            className="w-full mt-1 text-sm py-1 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Default</option>
            <option value="1">Single</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5</option>
            <option value="2">Double</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SectionFormatControls;
