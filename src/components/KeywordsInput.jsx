import React, { useState } from "react";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import SectionFormatControls from "./SectionFormatControls";

const KeywordsInput = ({
  keywords,
  setKeywords,
  sectionFormatting,
  onSectionFormattingChange,
}) => {
  const [currentKeyword, setCurrentKeyword] = useState("");
  const handleAddKeyword = () => {
    if (
      currentKeyword.trim() &&
      !keywords.includes(currentKeyword.trim()) &&
      keywords.length < 5
    ) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };
  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
        5. Keywords
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Provide 3 to 5 keywords that describe your research.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={currentKeyword}
          onChange={(e) => setCurrentKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Public Health"
          disabled={keywords.length >= 5}
          className="flex-grow px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={handleAddKeyword}
          disabled={keywords.length >= 5}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          <PlusCircleIcon className="h-5 w-5" /> Add Keyword
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full"
          >
            {keyword}
            <button
              onClick={() => handleRemoveKeyword(keyword)}
              className="text-blue-500 hover:text-blue-700"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
      <SectionFormatControls
        sectionName="keywords"
        formatting={sectionFormatting}
        onChange={onSectionFormattingChange}
      />
    </div>
  );
};
export default KeywordsInput;
