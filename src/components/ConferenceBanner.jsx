// src/components/ConferenceBanner.jsx
import React from "react";
import guLogo from "/gu.png";
import iitLogo from "/iit.png";

const ConferenceBanner = () => {
  return (
    // Main container now always uses a column layout
    <div className="bg-[#5c0d48] text-gray-100 shadow-lg rounded-lg p-6 sm:p-8 mb-8 max-w-7xl mx-auto flex flex-col items-center gap-4">
      {/* --- NEW: Dedicated container for logos --- */}
      <div className="flex items-center justify-center gap-8 w-full">
        {/* Gujarat University Logo */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-100 p-2 rounded-full shadow-md flex items-center justify-center h-24 w-24">
          <img
            src={guLogo}
            alt="Gujarat University Logo"
            className="h-full w-full object-contain"
          />
        </div>

        {/* IIT Gandhinagar Logo */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-100 p-2 rounded-full shadow-md flex items-center justify-center h-24 w-24">
          <img
            src={iitLogo}
            alt="IIT Gandhinagar Logo"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
      {/* ----------------------------------------- */}

      {/* Conference Details (Centered Text) */}
      <div className="text-center">
        <p className="text-yellow-400 font-semibold tracking-wide">
          International Conference on
        </p>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white my-2">
          Advances in Biological Sciences for Sustainable Development
        </h1>

        <p className="mt-3 text-sm text-gray-200">
          Organized by the <br />
          <strong className="font-semibold text-xl text-white">
            Department of Microbiology and Biotechnology, Gujarat University
          </strong>
          <br />
          in collaboration with the <br />
          <strong className="font-semibold text-xl text-white">
            Indian Institute of Technology-Gandhinagar
          </strong>
        </p>

        <p className="mt-4 text-md font-semibold bg-black/20 text-white rounded-full px-4 py-2 inline-block">
          22-23 December 2025
        </p>
      </div>
    </div>
  );
};

export default ConferenceBanner;
