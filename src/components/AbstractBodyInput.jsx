import React from "react";

const AbstractBodyInput = ({ body, setBody, charLimit = 1500 }) => {
  const charCount = body.length;
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const limitExceeded = charCount > charLimit;
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
        4. Abstract Body
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        The body should be a single paragraph and must not exceed {charLimit}{" "}
        characters.
      </p>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onBlur={() => setBody(body.trim())}
        placeholder="Paste the main text of your abstract here..."
        className={`w-full h-48 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${
          limitExceeded
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300"
        }`}
      />
      <div
        className={`text-sm mt-2 flex justify-end gap-4 ${
          limitExceeded ? "text-red-500" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        <span>{wordCount} word(s)</span>
        <span>
          {charCount} / {charLimit} characters
        </span>
      </div>
    </div>
  );
};
export default AbstractBodyInput;
