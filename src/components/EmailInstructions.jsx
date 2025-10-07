// src/components/EmailInstructions.jsx
import React from "react";
import CopyableField from "./CopyableField";

const EmailInstructions = ({ recipient, subject, body }) => {
  return (
    <div className="p-4 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Next Step: Email Your Abstract
      </h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        After downloading, copy the details below and email the file.
      </p>

      <CopyableField label="To" value={recipient} />
      <CopyableField label="Subject" value={subject} />
      <CopyableField label="Body" value={body} isTextArea />
    </div>
  );
};

export default EmailInstructions;
