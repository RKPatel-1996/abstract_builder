import React, { useState } from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import SectionFormatControls from "./SectionFormatControls";

const AuthorsInput = ({
  authors,
  affiliations,
  onAuthorChange,
  onAddAuthor,
  onRemoveAuthor,
  onAddAffiliation,
  onRemoveAffiliation,
  sectionFormatting,
  onSectionFormattingChange,
}) => {
  const [newAffiliation, setNewAffiliation] = useState("");
  const handleAddAffiliation = () => {
    if (newAffiliation.trim() !== "") {
      onAddAffiliation(newAffiliation);
      setNewAffiliation("");
    }
  };
  const capitalize = (s) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
  const handleAuthorFieldChange = (authorId, field, value) => {
    const updatedAuthors = authors.map((author) => {
      if (author.id === authorId) {
        let formattedValue = value;
        if (field === "firstName" || field === "lastName") {
          formattedValue = capitalize(value);
        } else if (field === "middleInitial" && value.length > 0) {
          formattedValue = value.charAt(0).toUpperCase();
        }
        return { ...author, [field]: formattedValue };
      }
      return author;
    });
    onAuthorChange(updatedAuthors);
  };
  const handleSetCorresponding = (authorId) => {
    const updatedAuthors = authors.map((author) => ({
      ...author,
      isCorresponding: author.id === authorId,
    }));
    onAuthorChange(updatedAuthors);
  };
  const handleToggleAffiliation = (authorId, affiliationId) => {
    const updatedAuthors = authors.map((author) => {
      if (author.id === authorId) {
        const newAffiliationIds = author.affiliationIds.includes(affiliationId)
          ? author.affiliationIds.filter((id) => id !== affiliationId)
          : [...author.affiliationIds, affiliationId];
        return { ...author, affiliationIds: newAffiliationIds };
      }
      return author;
    });
    onAuthorChange(updatedAuthors);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">
        2. Authors & Affiliations
      </h3>
      <div className="p-4 border rounded-md dark:border-gray-700 mb-6">
        <h4 className="font-semibold mb-2 dark:text-gray-200">
          Institutions / Affiliations
        </h4>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={newAffiliation}
            onChange={(e) => setNewAffiliation(e.target.value)}
            placeholder="e.g., National Institute of Virology, Pune"
            className="flex-grow px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            onClick={handleAddAffiliation}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <PlusCircleIcon className="h-5 w-5" /> Add
          </button>
        </div>
        <ul className="space-y-2">
          {affiliations.map((aff, index) => (
            <li
              key={aff.id}
              className="flex justify-between items-center text-sm p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
            >
              <span>
                {index + 1}. {aff.name}
              </span>
              <button
                onClick={() => onRemoveAffiliation(aff.id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {authors.map((author, index) => (
        <div
          key={author.id}
          className="p-4 border rounded-md dark:border-gray-700 mb-4 relative"
        >
          <p className="font-semibold mb-4 dark:text-gray-200">
            Author #{index + 1}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="First Name"
              value={author.firstName}
              onChange={(e) =>
                handleAuthorFieldChange(author.id, "firstName", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Middle Initial"
              value={author.middleInitial}
              onChange={(e) =>
                handleAuthorFieldChange(
                  author.id,
                  "middleInitial",
                  e.target.value
                )
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={author.lastName}
              onChange={(e) =>
                handleAuthorFieldChange(author.id, "lastName", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="mb-4">
            <h5 className="text-sm font-medium mb-2 dark:text-gray-300">
              Assign Affiliation(s)
            </h5>
            {affiliations.length > 0 ? (
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {affiliations.map((aff, affIndex) => (
                  <label
                    key={aff.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={author.affiliationIds.includes(aff.id)}
                      onChange={() =>
                        handleToggleAffiliation(author.id, aff.id)
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm dark:text-gray-200">
                      {affIndex + 1}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please add an affiliation above to assign it.
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id={`corr-${author.id}`}
              checked={author.isCorresponding}
              onChange={() => handleSetCorresponding(author.id)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={`corr-${author.id}`}
              className="text-sm font-medium dark:text-gray-200"
            >
              Set as Corresponding Author
            </label>
          </div>
          {authors.length > 1 && (
            <button
              onClick={() => onRemoveAuthor(author.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={onAddAuthor}
        className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 border-2 border-dashed border-blue-400 text-blue-500 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700"
      >
        <UserPlusIcon className="h-5 w-5" />
        Add Another Author
      </button>
      <SectionFormatControls
        sectionName="authors"
        formatting={sectionFormatting}
        onChange={onSectionFormattingChange}
      />
    </div>
  );
};
export default AuthorsInput;
