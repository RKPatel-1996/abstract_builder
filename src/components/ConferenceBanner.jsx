// src/components/ConferenceBanner.jsx

import React from "react";
import guLogo from "/gu.png";
import iitLogo from "/iit.png";

const ConferenceBanner = () => {
  return (
    // Main container with a rich purple background and white text
    <div className="bg-[#5c0d48] text-gray-100 shadow-lg rounded-lg p-6 sm:p-8 mb-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Gujarat University Logo */}
        <div className="flex-shrink-0">
          {/* Added a subtle drop shadow to lift the logo off the background */}
          <img
            src={guLogo}
            alt="Gujarat University Logo"
            className="h-20 sm:h-28 filter drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
          />
        </div>

        {/* Conference Details (Centered Text) */}
        <div className="text-center">
          <p className="text-yellow-400 font-semibold tracking-wide">
            International Conference on
          </p>

          {/* Elegant serif font for the main title */}
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white my-2">
            Advances in Biological Sciences for Sustainable Development
          </h1>

          <p className="mt-3 text-sm text-gray-200">Organized by the </p>
          <p>
            <strong className="font-semibold text-xl text-white">
              Department of Microbiology and Biotechnology, Gujarat University
            </strong>{" "}
            <br />
            || in collaboration with the ||
            <strong className="font-semibold text-xl text-white">
              {" "}
              <br />
              Indian Institute of Technology-Gandhinagar
            </strong>
          </p>

          {/* "Pill" style for the date */}
          <p className="mt-4 text-md font-semibold bg-black/20 text-white rounded-full px-4 py-2 inline-block">
            22-23 December 2025
          </p>
        </div>

        {/* IIT Gandhinagar Logo */}
        <div className="flex-shrink-0">
          <img
            src={iitLogo}
            alt="IIT Gandhinagar Logo"
            className="h-20 sm:h-28 filter drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
          />
        </div>
      </div>
    </div>
  );
};

export default ConferenceBanner;
