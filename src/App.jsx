import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
// This is the corrected import
import { generateDocxWithMarkers } from "./utils/generateDocxWithMarkers.js";
import { postProcessDocx } from "./utils/postProcessDocx.js";

// All Component Imports...
import Header from "./components/Header";
import ScrollButtons from "./components/ScrollButtons";
import TitleInput from "./components/TitleInput";
import AuthorsInput from "./components/AuthorsInput";
import EmailInputs from "./components/EmailInputs";
import AbstractBodyInput from "./components/AbstractBodyInput";
import KeywordsInput from "./components/KeywordsInput";
import ViewEditToggle from "./components/ViewEditToggle";
import PreviewPanel from "./components/PreviewPanel";
import "./App.css";

function App() {
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

  // In App.jsx, replace both of your existing handleDownload and handleEmailShare functions with this:

  // In App.jsx

  const handleDownload = async (isForAttachment = false) => {
    const abstractData = {
      // ... all your abstract data ...
      title,
      hasOrganism,
      organisms,
      authors,
      affiliations,
      email,
      secondaryEmail,
      abstractBody,
      keywords,
    };

    const filename =
      (title.substring(0, 20).replace(/\s+/g, "_") || "abstract") + ".docx";

    // Step 1: Generate the draft file with placeholders
    const draftBlob = await generateDocxWithMarkers(abstractData);

    // Step 2: Run our new correction script on the draft file
    const finalBlob = await postProcessDocx(draftBlob);

    // Step 3: Save the FINAL, corrected file
    if (!isForAttachment) {
      saveAs(finalBlob, filename);
    }

    return { blob: finalBlob, filename };
  };
  const handleEmailShare = async () => {
    alert(
      "The .docx file will be downloaded first. Please attach it to the email that will open."
    );

    // FAULT 3 FIXED:
    // This now correctly calls handleDownload and waits for it to finish.
    // It receives the `filename` from the handleDownload function instead of trying to guess it.
    const { filename } = await handleDownload(false); // We call with `false` to trigger the download for the user.

    // Now the rest of the function will work correctly.
    const subject = title || "Scientific Abstract";
    const body = `Dear Recipient,\n\nPlease find the attached abstract titled "${subject}".\n\nBest regards,\n${
      authors.find((a) => a.isCorresponding)?.firstName || ""
    }`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
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
            <TitleInput
              title={title}
              setTitle={setTitle}
              hasOrganism={hasOrganism}
              setHasOrganism={setHasOrganism}
              organisms={organisms}
              onAddOrganism={addOrganism}
              onRemoveOrganism={removeOrganism}
              onUpdateOrganism={updateOrganism}
            />
            <AuthorsInput
              authors={authors}
              affiliations={affiliations}
              onAuthorChange={updateAuthors}
              onAddAuthor={addAuthor}
              onRemoveAuthor={removeAuthor}
              onAddAffiliation={addAffiliation}
              onRemoveAffiliation={removeAffiliation}
            />
            <EmailInputs
              email={email}
              setEmail={setEmail}
              secondaryEmail={secondaryEmail}
              setSecondaryEmail={setSecondaryEmail}
            />
            <AbstractBodyInput body={abstractBody} setBody={setAbstractBody} />
            <KeywordsInput keywords={keywords} setKeywords={setKeywords} />
          </div>
          <div
            className={`${
              viewMode === "view" ? "block" : "hidden"
            } md:block md:sticky md:top-24 h-fit`}
          >
            {/* PREVIEW PANEL */}
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
      </main>
      <ScrollButtons />
    </div>
  );
}

export default App;
