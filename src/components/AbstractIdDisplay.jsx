import React from "react";

const AbstractIdDisplay = ({ id }) => {
  if (!id) return null;

  const [cat, author, date, time] = id.split("_");

  return (
    <div className="bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6 text-sm">
      <p className="font-bold text-blue-800 dark:text-blue-300">
        Your Unique Abstract ID:
      </p>
      <p className="font-mono text-lg text-blue-900 dark:text-blue-200 break-all">
        {id}
      </p>
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
        <p>
          This ID is generated from: <br />
          <span className="font-semibold">{cat}</span> (Category) +
          <span className="font-semibold"> {author}</span> (Author Initials) +
          <span className="font-semibold"> {date}</span> (Date) +
          <span className="font-semibold"> {time}</span> (Time)
        </p>
      </div>
    </div>
  );
};

export default AbstractIdDisplay;
