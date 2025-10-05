import React from "react";

const PreviewPanel = ({
  title,
  hasOrganism,
  organisms,
  authors,
  affiliations,
  email,
  secondaryEmail,
  body,
  keywords,
}) => {
  // --- NEW: Powerful & Strict Organism Formatting Function ---
  const formatTextWithOrganisms = (text) => {
    if (!hasOrganism || !organisms || organisms.length === 0 || !text) {
      return text;
    }

    let formattedText = text;

    // This function iterates through each defined organism and replaces all occurrences
    organisms.forEach((org) => {
      if (org.genus && org.species) {
        // 1. Define the correct formats
        const correctFullName = `${
          org.genus.charAt(0).toUpperCase() + org.genus.slice(1).toLowerCase()
        } ${org.species.toLowerCase()}`;
        const correctAbbreviation = `${org.genus
          .charAt(0)
          .toUpperCase()}. ${org.species.toLowerCase()}`;

        // 2. Create case-insensitive Regex to find all user variations
        const fullNameRegex = new RegExp(
          `\\b${org.genus}\\s+${org.species}\\b`,
          "gi"
        );
        const abbreviationRegex = new RegExp(
          `\\b${org.genus.charAt(0)}\\.\\s+${org.species}\\b`,
          "gi"
        );

        // 3. Replace found variations with the correctly formatted, italicized version
        formattedText = formattedText.replace(
          fullNameRegex,
          `<em>${correctFullName}</em>`
        );
        formattedText = formattedText.replace(
          abbreviationRegex,
          `<em>${correctAbbreviation}</em>`
        );
      }
    });

    // Use dangerouslySetInnerHTML to render the <em> tags for italics
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  const renderFormattedTitle = () => {
    if (!title) return "Your Title Here";
    const sentenceCaseTitle =
      title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
    return formatTextWithOrganisms(sentenceCaseTitle);
  };

  // --- Author & Affiliation Logic (No changes here) ---
  const usedAffiliationIds = new Set(
    authors.flatMap((author) => author.affiliationIds)
  );
  const affiliationMap = new Map();
  const superscriptChars = "abcdefghijklmnopqrstuvwxyz";
  let charIndex = 0;
  affiliations.forEach((aff) => {
    if (usedAffiliationIds.has(aff.id)) {
      affiliationMap.set(aff.id, superscriptChars[charIndex++]);
    }
  });

  const formattedAuthorsString = authors
    .map((author) => {
      let name = `${author.firstName || ""} ${
        author.middleInitial ? `${author.middleInitial}. ` : ""
      }${author.lastName || ""}`.trim();
      const superscripts = author.affiliationIds
        .map((id) => affiliationMap.get(id))
        .join(",");
      if (superscripts) name += `<sup>${superscripts}</sup>`;
      if (author.isCorresponding) name += `<sup>*</sup>`;
      return name;
    })
    .join(", ");

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full border dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-center">
        {renderFormattedTitle()}
      </h2>
      <div
        className="mb-2 text-center text-gray-800 dark:text-gray-200"
        dangerouslySetInnerHTML={{
          __html: formattedAuthorsString || "Author Names",
        }}
      />
      <div className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">
        {affiliations
          .filter((aff) => usedAffiliationIds.has(aff.id))
          .map((aff) => (
            <p key={aff.id}>
              <sup>{affiliationMap.get(aff.id)}</sup>
              {aff.name}
            </p>
          ))}
      </div>

      {/* NEW: Updated Email Display Format */}
      <div className="mb-4 text-sm">
        {email && (
          <p>
            {email}
            <sup>*</sup>
          </p>
        )}
        {secondaryEmail && <p>{secondaryEmail}</p>}
      </div>

      <div className="mb-4 text-justify">
        <p className="text-base whitespace-pre-wrap">
          {formatTextWithOrganisms(body) ||
            "Your abstract body will appear here."}
        </p>
      </div>

      <div>
        <p className="text-base">
          <span className="font-semibold">Keywords: </span>
          {/* NEW: Keywords now also get formatted */}
          {formatTextWithOrganisms(keywords.join("; "))}
        </p>
      </div>
    </div>
  );
};

export default PreviewPanel;
