// src/components/CopyableField.jsx
import React from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

const CopyableField = ({ label, value, isTextArea = false }) => {
  const [wasCopied, setWasCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setWasCopied(true);
      setTimeout(() => setWasCopied(false), 2000);
    });
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}:
        </label>
        <button
          onClick={handleCopy}
          className="flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 dark:text-blue-400 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {wasCopied ? (
            <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
          )}
          {wasCopied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="p-2 mt-1 text-gray-800 whitespace-pre-wrap bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-200">
        {value}
      </div>
    </div>
  );
};

export default CopyableField;
