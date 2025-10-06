import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

// Helper function to capitalize the first letter of each sentence.
const capitalizeSentences = (text) => {
  if (!text) return "";
  return text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
};

export const generateDocxWithMarkers = (data) => {
  const {
    title,
    hasOrganism,
    organisms,
    authors,
    affiliations,
    email,
    secondaryEmail,
    abstractBody,
    keywords,
  } = data;

  const FONT_CHOICE = "Times New Roman";

  // This function correctly finds and italicizes organism names.
  const createFormattedTextRuns = (text, options = {}) => {
    const baseOptions = { size: 12 * 2, font: FONT_CHOICE, ...options };

    if (!hasOrganism || organisms.length === 0 || !text) {
      return [new TextRun({ text, ...baseOptions })];
    }
    let processedText = text;
    organisms.forEach((org) => {
      if (org.genus && org.species) {
        const correctFullName = `${
          org.genus.charAt(0).toUpperCase() + org.genus.slice(1).toLowerCase()
        } ${org.species.toLowerCase()}`;
        const correctAbbreviation = `${org.genus
          .charAt(0)
          .toUpperCase()}. ${org.species.toLowerCase()}`;
        const fullNameRegex = new RegExp(
          `\\b${org.genus}\\s+${org.species}\\b`,
          "gi"
        );
        const abbreviationRegex = new RegExp(
          `\\b${org.genus.charAt(0)}\\.?\\s+${org.species}\\b`,
          "gi"
        );
        processedText = processedText.replace(
          fullNameRegex,
          `|||${correctFullName}|||`
        );
        processedText = processedText.replace(
          abbreviationRegex,
          `|||${correctAbbreviation}|||`
        );
      }
    });

    return processedText.split("|||").map((part) => {
      const isOrganism = organisms.some((org) => {
        const correctFullName = `${
          org.genus.charAt(0).toUpperCase() + org.genus.slice(1).toLowerCase()
        } ${org.species.toLowerCase()}`;
        const correctAbbreviation = `${org.genus
          .charAt(0)
          .toUpperCase()}. ${org.species.toLowerCase()}`;
        return part === correctFullName || part === correctAbbreviation;
      });
      return new TextRun({ text: part, italics: isOrganism, ...baseOptions });
    });
  };

  // REPLACE IT WITH THIS

  const usedAffiliationIds = new Set(authors.flatMap((a) => a.affiliationIds));
  const affiliationMap = new Map();
  let affiliationCounter = 1; // Start counting from 1
  affiliations.forEach((aff) => {
    if (usedAffiliationIds.has(aff.id)) {
      // Map the ID to the current number (as a string) and then increment
      affiliationMap.set(aff.id, String(affiliationCounter));
      affiliationCounter++;
    }
  });
  const twoLinesSpace = { after: 480 };

  const titleParagraph = new Paragraph({
    // FIXED: Now correctly calls createFormattedTextRuns for organism names in title
    children: createFormattedTextRuns(title, { bold: true, size: 14 * 2 }),
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: twoLinesSpace.after, line: 276 },
  });

  // FIXED: Restored the complete, correct logic for building author runs
  const authorRuns = [];
  authors.forEach((author, index) => {
    const name = `${author.firstName} ${
      author.middleInitial ? `${author.middleInitial}. ` : ""
    }${author.lastName}`.trim();
    // This now correctly sets the font size to 12pt
    authorRuns.push(
      new TextRun({ text: name, size: 12 * 2, font: FONT_CHOICE })
    );

    const superscripts = author.affiliationIds
      .map((id) => affiliationMap.get(id))
      .join("");
    // This now correctly adds the placeholders back
    if (superscripts) {
      authorRuns.push(new TextRun(`##${superscripts}##`));
    }
    if (author.isCorresponding) {
      authorRuns.push(new TextRun("##*##"));
    }
    if (index < authors.length - 1) {
      authorRuns.push(
        new TextRun({ text: ", ", size: 12 * 2, font: FONT_CHOICE })
      );
    }
  });

  const authorsParagraph = new Paragraph({
    children: authorRuns,
    alignment: AlignmentType.LEFT,
    spacing: { after: 360 }, // ADDED: 1.5 line space between authors and affiliations
  });

  // REPLACE IT WITH THIS

  const affiliationParagraphs = affiliations
    .filter((aff) => usedAffiliationIds.has(aff.id))
    .map((aff, index, arr) => {
      const isLastAffiliation = index === arr.length - 1;
      return new Paragraph({
        children: [
          new TextRun(`##${affiliationMap.get(aff.id)}##`),
          new TextRun({
            text: ` ${aff.name}`,
            size: 12 * 2,
            font: FONT_CHOICE,
            italics: true,
          }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: {
          line: 276, // ADDED: This sets 1.15 line spacing
          after: isLastAffiliation ? twoLinesSpace.after : 0, // This keeps the 2-line space after the block
        },
      });
    });
  const isCorresponding = authors.some((a) => a.isCorresponding);
  const emailParagraph = new Paragraph({
    children: [
      new TextRun({
        text: email,
        size: 12 * 2,
        font: FONT_CHOICE,
        color: "3B3B3B",
      }),
      isCorresponding
        ? new TextRun({
            text: "*",
            size: 12 * 2,
            font: FONT_CHOICE,
            color: "3B3B3B",
          })
        : null,
    ].filter(Boolean),
    alignment: AlignmentType.LEFT,
    spacing: secondaryEmail ? {} : twoLinesSpace,
  });

  const secondaryEmailParagraph = secondaryEmail
    ? new Paragraph({
        children: [
          new TextRun({
            text: secondaryEmail,
            size: 12 * 2,
            font: FONT_CHOICE,
            color: "3B3B3B",
          }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: twoLinesSpace,
      })
    : null;

  const abstractHeading = new Paragraph({
    children: [
      new TextRun({
        text: "Abstract",
        bold: true,
        size: 12 * 2,
        font: FONT_CHOICE,
      }),
    ],
    spacing: twoLinesSpace,
  });

  const bodyParagraph = new Paragraph({
    children: createFormattedTextRuns(capitalizeSentences(abstractBody)),
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, after: twoLinesSpace.after },
  });

  // FIXED: Restored the complete, correct logic for the keywords section
  const keywordsParagraph = new Paragraph({
    children: [
      new TextRun({
        text: "Keywords: ",
        bold: true,
        size: 12 * 2,
        font: FONT_CHOICE,
      }),
      ...createFormattedTextRuns(keywords.join("; ")),
    ],
    alignment: AlignmentType.LEFT,
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          titleParagraph,
          authorsParagraph,
          ...affiliationParagraphs,
          emailParagraph,
          secondaryEmailParagraph,
          abstractHeading,
          bodyParagraph,
          keywordsParagraph,
        ].filter(Boolean),
      },
    ],
  });

  return Packer.toBlob(doc);
};
