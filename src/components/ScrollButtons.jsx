import React from "react";
import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/solid";

const ScrollButtons = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      <button
        onClick={scrollToTop}
        className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Scroll to top"
      >
        <ArrowUpCircleIcon className="h-8 w-8" />
      </button>
      <button
        onClick={scrollToBottom}
        className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Scroll to bottom"
      >
        <ArrowDownCircleIcon className="h-8 w-8" />
      </button>
    </div>
  );
};

export default ScrollButtons;
