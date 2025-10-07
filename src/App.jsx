import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { generateDocxWithMarkers } from "./utils/generateDocxWithMarkers.js";
import { postProcessDocx } from "./utils/postProcessDocx.js";

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

  // --- All Handler Functions ---

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

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleDownload = async (isForAttachment = false) => {
    const abstractData = {
      abstractId, // ADDED: Pass the ID to the generator
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

    // FIXED: Corrected the filename generation
    const filename = `${abstractId || "abstract"}.docx`;

    const draftBlob = await generateDocxWithMarkers(abstractData);
    const finalBlob = await postProcessDocx(draftBlob);

    if (!isForAttachment) {
      saveAs(finalBlob, filename);
    }
    return { blob: finalBlob, filename };
  };

  const handleEmailShare = async () => {
    alert(
      "The .docx file will be downloaded first. Please attach it to the email that will open."
    );
    await handleDownload(false);

    const subject = title || "Scientific Abstract";
    const body = `Dear Recipient,\n\nPlease find the attached abstract titled "${subject}".\n\nBest regards,\n${
      authors.find((a) => a.isCorresponding)?.firstName || ""
    }`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  // --- JSX Return ---

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
