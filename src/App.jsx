import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

// All Component Imports...
import Header from "./components/Header";
import ScrollButtons from "./components/ScrollButtons";
import FormattingOptions from "./components/FormattingOptions";
import TitleInput from "./components/TitleInput";
import AuthorsInput from "./components/AuthorsInput";
import EmailInputs from "./components/EmailInputs";
import AbstractBodyInput from "./components/AbstractBodyInput";
import KeywordsInput from "./components/KeywordsInput";
import ViewEditToggle from "./components/ViewEditToggle";
import PreviewPanel from "./components/PreviewPanel";
import "./App.css";

function App() {
  // --- STATE MANAGEMENT ---
  const [globalFormatting, setGlobalFormatting] = useState({
    font: "Arial",
    fontSize: 12,
    lineSpacing: 1.5,
    alignment: "left",
  });
  const [sectionFormatting, setSectionFormatting] = useState({
    title: { alignment: "center" },
    authors: { alignment: "center" },
    affiliations: { alignment: "center" },
    body: { alignment: "justified" },
    emails: {},
    keywords: {},
  });

  const handleGlobalFormattingChange = (option, value) => {
    setGlobalFormatting((prev) => ({ ...prev, [option]: value }));
  };
  const handleSectionFormattingChange = (section, option, value) => {
    setSectionFormatting((prev) => ({
      ...prev,
      [section]: { ...prev[section], [option]: value },
    }));
  };

  // All other state...
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [viewMode, setViewMode] = useState("edit");
  const [title, setTitle] = useState("");
  const [hasOrganism, setHasOrganism] = useState(false);
  const [organisms, setOrganisms] = useState([]);
  const [authors, setAuthors] = useState([
    {
      id: 1,
      firstName: "",
      middleInitial: "",
      lastName: "",
      affiliationIds: [],
      isCorresponding: true,
    },
  ]);
  const [affiliations, setAffiliations] = useState([]);
  const [email, setEmail] = useState("");
  const [secondaryEmail, setSecondaryEmail] = useState("");
  const [abstractBody, setAbstractBody] = useState("");
  const [keywords, setKeywords] = useState([]);

  // All other handlers...
  const addOrganism = () =>
    setOrganisms([...organisms, { id: Date.now(), genus: "", species: "" }]);
  const removeOrganism = (id) =>
    setOrganisms(organisms.filter((org) => org.id !== id));
  const updateOrganism = (id, field, value) =>
    setOrganisms(
      organisms.map((org) => (org.id === id ? { ...org, [field]: value } : org))
    );
  const addAuthor = () =>
    setAuthors([
      ...authors,
      {
        id: Date.now(),
        firstName: "",
        middleInitial: "",
        lastName: "",
        affiliationIds: [],
        isCorresponding: !authors.some((a) => a.isCorresponding),
      },
    ]);
  const removeAuthor = (id) =>
    setAuthors(authors.filter((author) => author.id !== id));
  const updateAuthors = (updatedAuthors) => setAuthors(updatedAuthors);
  const addAffiliation = (name) =>
    setAffiliations([...affiliations, { id: Date.now(), name }]);
  const removeAffiliation = (id) => {
    setAffiliations(affiliations.filter((aff) => aff.id !== id));
    setAuthors(
      authors.map((author) => ({
        ...author,
        affiliationIds: author.affiliationIds.filter((affId) => affId !== id),
      }))
    );
  };
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleDownload = (isForAttachment = false) => {
    const getStyle = (section) => ({
      ...globalFormatting,
      ...sectionFormatting[section],
    });

    const createFormattedTextRuns = (text, section) => {
      const style = getStyle(section);
      const options = {
        size: style.fontSize * 2,
        font: style.font,
        bold: style.bold,
      };

      if (!hasOrganism || organisms.length === 0 || !text) {
        return [new TextRun({ text, ...options })];
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
        return new TextRun({ text: part, italics: isOrganism, ...options });
      });
    };

    const usedAffiliationIds = new Set(
      authors.flatMap((a) => a.affiliationIds)
    );
    const affiliationMap = new Map();
    let charIndex = 0;
    affiliations.forEach((aff) => {
      if (usedAffiliationIds.has(aff.id))
        affiliationMap.set(aff.id, "abcdefghijklmnopqrstuvwxyz"[charIndex++]);
    });

    const authorRuns = [];
    authors.forEach((author, index) => {
      const style = getStyle("authors");
      const name = `${author.firstName} ${
        author.middleInitial ? `${author.middleInitial}. ` : ""
      }${author.lastName}`.trim();
      authorRuns.push(
        new TextRun({ text: name, font: style.font, size: style.fontSize * 2 })
      );
      const superscripts = author.affiliationIds
        .map((id) => affiliationMap.get(id))
        .join(",");
      // SUPERSCRIPT FIX: Use a defined character style for reliability
      if (superscripts)
        authorRuns.push(
          new TextRun({ text: superscripts, style: "superscriptStyle" })
        );
      if (author.isCorresponding)
        authorRuns.push(new TextRun({ text: "*", style: "superscriptStyle" }));
      if (index < authors.length - 1)
        authorRuns.push(
          new TextRun({
            text: ", ",
            font: style.font,
            size: style.fontSize * 2,
          })
        );
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: createFormattedTextRuns(
                title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
                "title"
              ),
              alignment: getStyle("title").alignment.toUpperCase(),
              spacing: {
                after: 240,
                line: getStyle("title").lineSpacing * 240,
              },
            }),
            new Paragraph({
              children: authorRuns,
              alignment: getStyle("authors").alignment.toUpperCase(),
              spacing: { line: getStyle("authors").lineSpacing * 240 },
            }),
            ...affiliations
              .filter((aff) => usedAffiliationIds.has(aff.id))
              .map((aff) => {
                const style = getStyle("affiliations");
                return new Paragraph({
                  children: [
                    new TextRun({
                      text: affiliationMap.get(aff.id),
                      style: "superscriptStyle",
                    }),
                    new TextRun({
                      text: ` ${aff.name}`,
                      font: style.font,
                      size: (style.fontSize - 2) * 2,
                    }),
                  ],
                  alignment: style.alignment.toUpperCase(),
                  spacing: { line: style.lineSpacing * 240 },
                });
              }),
            new Paragraph({
              children: [new TextRun("")],
              spacing: { after: 240 },
            }),
            new Paragraph({
              children: createFormattedTextRuns(abstractBody, "body"),
              alignment: getStyle("body").alignment.toUpperCase(),
              spacing: { after: 240, line: getStyle("body").lineSpacing * 240 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Keywords: ",
                  bold: true,
                  font: getStyle("keywords").font,
                  size: getStyle("keywords").fontSize * 2,
                }),
                ...createFormattedTextRuns(keywords.join("; "), "keywords"),
              ],
              alignment: getStyle("keywords").alignment.toUpperCase(),
              spacing: {
                after: 240,
                line: getStyle("keywords").lineSpacing * 240,
              },
            }),
          ],
        },
      ],
      // SUPERSCRIPT FIX: Define a character style for all superscripts
      characterStyles: [
        {
          id: "superscriptStyle",
          name: "Superscript",
          run: {
            font: getStyle("authors").font, // Base font on author style
            size: getStyle("authors").fontSize * 2,
            superscript: true,
          },
        },
      ],
    });

    const filename = (email.split("@")[0] || "abstract").trim() + ".docx";
    return Packer.toBlob(doc).then((blob) => {
      if (!isForAttachment) {
        saveAs(blob, filename);
      }
      return { blob, filename };
    });
  };

  const handleEmailShare = async () => {
    /* This function remains unchanged */
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onDownload={() => handleDownload(false)}
        onEmail={handleEmailShare}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="md:hidden">
          <ViewEditToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 max-w-7xl mx-auto">
          {/* EDITING PANEL */}
          <div
            className={`${viewMode === "edit" ? "block" : "hidden"} md:block`}
          >
            <FormattingOptions
              options={globalFormatting}
              onChange={handleGlobalFormattingChange}
            />

            <TitleInput
              title={title}
              setTitle={setTitle}
              hasOrganism={hasOrganism}
              setHasOrganism={setHasOrganism}
              organisms={organisms}
              onAddOrganism={addOrganism}
              onRemoveOrganism={removeOrganism}
              onUpdateOrganism={updateOrganism}
              sectionFormatting={sectionFormatting.title}
              onSectionFormattingChange={handleSectionFormattingChange}
            />

            <AuthorsInput
              authors={authors}
              affiliations={affiliations}
              onAuthorChange={updateAuthors}
              onAddAuthor={addAuthor}
              onRemoveAuthor={removeAuthor}
              onAddAffiliation={addAffiliation}
              onRemoveAffiliation={removeAffiliation}
              sectionFormatting={sectionFormatting.authors}
              onSectionFormattingChange={handleSectionFormattingChange}
            />

            <EmailInputs
              email={email}
              setEmail={setEmail}
              secondaryEmail={secondaryEmail}
              setSecondaryEmail={setSecondaryEmail}
            />

            <AbstractBodyInput
              body={abstractBody}
              setBody={setAbstractBody}
              sectionFormatting={sectionFormatting.body}
              onSectionFormattingChange={handleSectionFormattingChange}
            />

            <KeywordsInput
              keywords={keywords}
              setKeywords={setKeywords}
              sectionFormatting={sectionFormatting.keywords}
              onSectionFormattingChange={handleSectionFormattingChange}
            />
          </div>
          <div
            className={`${
              viewMode === "view" ? "block" : "hidden"
            } md:block md:sticky md:top-24 h-fit`}
          >
            {/* PREVIEW PANEL */}
            <div
              className={`${
                viewMode === "view" ? "block" : "hidden"
              } md:block md:sticky md:top-24 h-fit`}
            >
              <PreviewPanel
                title={title}
                hasOrganism={hasOrganism}
                organisms={organisms}
                authors={authors}
                affiliations={affiliations}
                email={email}
                secondaryEmail={secondaryEmail}
                body={abstractBody}
                keywords={keywords}
              />
            </div>
          </div>
        </div>
      </main>
      <ScrollButtons />
    </div>
  );
}

export default App;
