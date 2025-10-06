import JSZip from "jszip";

// This is the raw XML code that Word uses for a superscript.
// We will wrap the placeholder content with this code.
const SUPER_SCRIPT_XML = (text) =>
  `<w:rPr><w:vertAlign w:val="superscript"/></w:rPr><w:t>${text}</w:t>`;

export const postProcessDocx = async (draftBlob) => {
  try {
    const zip = await JSZip.loadAsync(draftBlob);
    const docFile = zip.file("word/document.xml");

    if (!docFile) {
      console.error("word/document.xml not found in the DOCX file.");
      return draftBlob; // Return original blob if something is wrong
    }

    let xmlContent = await docFile.async("string");

    // This regular expression finds all our placeholders, like ##a## or ##*##
    // It looks for text wrapped in <w:t> tags that contains our ##...## markers.
    // The 'g' flag ensures it replaces ALL occurrences.
    // This is the new, more robust regex
    const placeholderRegex = /<w:t[^>]*>##(.*?)##<\/w:t>/g;

    // We replace the found placeholder with the correct XML.
    // The '$1' in the replacement string refers to the content *inside* the ##...##
    // e.g., for "##a##", $1 is "a".
    const correctedXmlContent = xmlContent.replace(
      placeholderRegex,
      (match, content) => SUPER_SCRIPT_XML(content)
    );

    // Update the zip file with our corrected XML content
    zip.file("word/document.xml", correctedXmlContent);

    // Generate the final, corrected blob
    const finalBlob = await zip.generateAsync({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    return finalBlob;
  } catch (error) {
    console.error("Error post-processing DOCX file:", error);
    return draftBlob; // In case of error, return the original file
  }
};
