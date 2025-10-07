import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { generateDocxWithMarkers } from "./utils/generateDocxWithMarkers.js";
import { postProcessDocx } from "./utils/postProcessDocx.js";
import ConferenceBanner from "./components/ConferenceBanner";

// Component Imports
import SubmissionDetails from "./components/SubmissionDetails";
import AbstractIdDisplay from "./components/AbstractIdDisplay";
import Header from "./components/Header";
import ScrollButtons from "./components/ScrollButtons";
import TitleInput from "./components/TitleInput";
import AuthorsInput from "./components/AuthorsInput";
import EmailInputs from "./components/EmailInputs";
import AbstractBodyInput from "./components/AbstractBodyInput";
import KeywordsInput from "./components/KeywordsInput";
import ViewEditToggle from "./components/ViewEditToggle";
import PreviewPanel from "./components/PreviewPanel";
import DownloadButton from "./components/DownloadButton";
import EmailInstructions from "./components/EmailInstructions";
import "./App.css";

function App() {
  // --- All State Hooks are now correctly inside the App component ---

  // New states for submission details

  const [category, setCategory] = useState("YIT");
  const [presentingAuthor, setPresentingAuthor] = useState("");
  const [submissionDateTime, setSubmissionDateTime] = useState(new Date());
  const [abstractId, setAbstractId] = useState("");

  // Original states
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [viewMode, setViewMode] = useState("edit");
  const [title, setTitle] = useState("");
  const [capitalizedTitle, setCapitalizedTitle] = useState("");
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

  // --- All useEffects are now correctly inside the App component ---

  // useEffect to generate the Abstract ID
  useEffect(() => {
    const categoryAbbr = category;
    const authorInitials = presentingAuthor
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    const d = submissionDateTime;
    const dateStr = `${d.getDate()}${d.getMonth() + 1}`;
    let hours = d.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const timeStr = `${hours}${minutes}${ampm}`;

    if (authorInitials) {
      setAbstractId(`${categoryAbbr}_${authorInitials}_${dateStr}_${timeStr}`);
    } else {
      setAbstractId("");
    }
  }, [category, presentingAuthor, submissionDateTime]);

  // useEffect for theme
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    if (title.length > 0) {
      const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
      setCapitalizedTitle(formattedTitle);
    } else {
      setCapitalizedTitle("");
    }
  }, [title]);

  // --- All Handler Functions ---

  const addOrganism = () =>
    setOrganisms([...organisms, { id: Date.now(), genus: "", species: "" }]);
  const removeOrganism = (id) =>
    setOrganisms(organisms.filter((org) => org.id !== id));
  const updateOrganism = (id, field, value) =>
    setOrganisms(
      organisms.map(
        (org) => (org.id === id ? { ...org, [field]: value.trim() } : org) // Trim here
      )
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
  const updateAuthors = (updatedAuthors) => {
    const trimmedAuthors = updatedAuthors.map((author) => ({
      ...author,
      firstName: author.firstName.trim(),
      middleInitial: author.middleInitial.trim(),
      lastName: author.lastName.trim(),
    }));
    setAuthors(trimmedAuthors);
  };

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

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleBlurTrim = (value, setterFunction) => {
    setterFunction(value.trim());
  };

  const handleDownload = async (isForAttachment = false) => {
    const abstractData = {
      abstractId, // ADDED: Pass the ID to the generator
      title: capitalizedTitle,
      hasOrganism,
      organisms,
      authors,
      affiliations,
      email,
      secondaryEmail,
      abstractBody,
      keywords,
    };

    // FIXED: Corrected the filename generation
    const filename = `${abstractId || "abstract"}.docx`;

    const draftBlob = await generateDocxWithMarkers(abstractData);
    const finalBlob = await postProcessDocx(draftBlob);

    if (!isForAttachment) {
      saveAs(finalBlob, filename);
    }
    return { blob: finalBlob, filename };
  };

  const handleEmailShare = () => {
    // Step 1: Gather all the data for the email first.
    const recipientEmail = "mibit.conf.2025@gmail.com";

    const subject = `Submission: ${abstractId || "Abstract"} - ${
      presentingAuthor || "Author"
    }`;

    const body = `Dear Organizing Committee,

Please find my abstract submission attached to this email.

--- Submission Details ---
Abstract ID: ${abstractId}
Abstract Title: ${capitalizedTitle}
Presenting Author: ${presentingAuthor}
Corresponding Author Email: ${email}
--------------------------

A .docx file of this abstract has been downloaded to my device, and I have attached it to this email.

Thank you for your consideration.

Sincerely,
${presentingAuthor}
`;

    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // --- NEW, MORE ROBUST METHOD ---
    // Step 2: Create a temporary link, click it, and then remove it.
    // This is more reliable across different browsers.
    const link = document.createElement("a");
    link.href = mailtoLink;
    document.body.appendChild(link); // Append to the DOM
    link.click(); // Programmatically click the link
    document.body.removeChild(link); // Clean up and remove the link

    // Step 3: Use a small timeout before starting the download.
    setTimeout(() => {
      handleDownload(false);
    }, 100);
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
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <ConferenceBanner />
        <div className="md:hidden">
          <ViewEditToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 max-w-7xl mx-auto">
          {/* EDITING PANEL */}
          <div
            className={`${viewMode === "edit" ? "block" : "hidden"} md:block`}
          >
            <SubmissionDetails
              category={category}
              setCategory={setCategory}
              presentingAuthor={presentingAuthor}
              setPresentingAuthor={setPresentingAuthor}
            />
            <AbstractIdDisplay id={abstractId} />
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
          {/* PREVIEW PANEL */}
          <div
            className={`${
              viewMode === "view" ? "block" : "hidden"
            } md:block md:sticky md:top-24 h-fit`}
          >
            <PreviewPanel
              // Pass new props for the ID display in the preview
              abstractId={abstractId}
              presentingAuthor={presentingAuthor}
              category={category}
              // Original props
              title={capitalizedTitle}
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
          //...
          {/* This is the closing tag of the main 2-column grid */}
        </div>

        {/* --- ADD THIS NEW SECTION BELOW THE GRID --- */}
        <div className="max-w-7xl mx-auto md:grid md:grid-cols-2 md:gap-8">
          {/* This div acts as a placeholder for the left column */}
          <div>
            <DownloadButton onDownload={() => handleDownload(false)} />
            <EmailInstructions
              recipient="mibit.conf.2025@gmail.com"
              subject={`Submission: ${abstractId || "Abstract"} - ${
                presentingAuthor || "Author"
              }`}
              body={`Dear Organizing Committee,

This email contains my abstract submission for the conference, titled "${title}".

My unique Abstract ID is: ${abstractId}

--- Submission Details ---
1. Abstract Title: ${capitalizedTitle}
2. Presenting Author: ${presentingAuthor}
3. Corresponding Author Email: ${email}
--------------------------

The formatted .docx file is attached to this email.

Thank you for your consideration.

Sincerely,
${presentingAuthor}`}
            />
          </div>
          {/* The right column is empty, ensuring correct alignment */}
          <div></div>
        </div>
        {/* ------------------------------------------- */}
      </main>
      <ScrollButtons />
    </div>
  );
}

export default App;
