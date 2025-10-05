import React from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

const FormattingOptions = ({ options, onChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">
        <Cog6ToothIcon className="h-6 w-6" />
        Global Document Formatting
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Font Family */}
        <div>
          <label
            htmlFor="fontFamily"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Font Family
          </label>
          <select
            id="fontFamily"
            name="font"
            value={options.font}
            onChange={(e) => onChange("font", e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option>Arial</option>
            <option>Calibri</option>
            <option>Times New Roman</option>
            <option>Helvetica</option>
          </select>
        </div>
        {/* Font Size */}
        <div>
          <label
            htmlFor="fontSize"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Base Font Size
          </label>
          <select
            id="fontSize"
            name="fontSize"
            value={options.fontSize}
            onChange={(e) => onChange("fontSize", parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="10">10 pt</option>
            <option value="11">11 pt</option>
            <option value="12">12 pt</option>
          </select>
        </div>
        {/* Line Spacing */}
        <div>
          <label
            htmlFor="lineSpacing"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Line Spacing
          </label>
          <select
            id="lineSpacing"
            name="lineSpacing"
            value={options.lineSpacing}
            onChange={(e) =>
              onChange("lineSpacing", parseFloat(e.target.value))
            }
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="1">Single</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5</option>
            <option value="2">Double</option>
          </select>
        </div>
        {/* Default Alignment */}
        <div>
          <label
            htmlFor="alignment"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Alignment
          </label>
          <select
            id="alignment"
            name="alignment"
            value={options.alignment}
            onChange={(e) => onChange("alignment", e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justified">Justified</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FormattingOptions;
