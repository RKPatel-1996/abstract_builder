Project Checkpoint 1: Abstract Builder v1.0Date: October 7, 2025Status: Core functionality complete. The application successfully allows users to create, format, preview, download, and share a scientific abstract.This document outlines the key achievements, architecture, and important code implementations of the Abstract Builder project as of this checkpoint.1. Core Architecture & Design PhilosophyThe application is built on a robust and scalable architecture designed for maintainability and future expansion.Component-Based Structure: The UI is broken down into logical, reusable React components (e.g., TitleInput, AuthorsInput), each responsible for a specific piece of the interface. This makes the code clean and easy to manage.Centralized State Management (App.jsx): The main App.jsx component acts as the "single source of truth." It holds all the data for the abstract (title, authors, body, etc.) and all the formatting options. Data and functions are passed down to child components as props. This pattern is crucial for ensuring that the Edit Form, Preview Panel, and Download function all work with the exact same data.Mobile-First Responsive Design: Styled with Tailwind CSS, the application features a responsive layout that adapts from a single-column, tabbed view on mobile (View/Edit toggle) to a two-column, side-by-side view on desktops.2. File & Component BreakdownThe project is organized into a src/components directory containing all the key UI pieces.Core Application Filesrc/App.jsx: The orchestrator of the entire application.State Management: Holds all useState hooks for abstract content and formatting styles. This is the most important file for understanding the application's data flow.Handler Functions: Contains all logic for adding/removing authors, updating formatting, and handling downloads/emails.Layout: Renders all the components and defines the main responsive grid layout.Input & Control ComponentsFormattingOptions.jsx: The "Global" settings panel. Allows the user to define the base font, font size, line spacing, and alignment for the entire document.SectionFormatControls.jsx: A reusable component that provides override controls for individual sections (Title, Body, etc.). This allows for granular control over the final document's appearance.TitleInput.jsx: Manages the abstract title and the dynamic list of scientific organism names.AuthorsInput.jsx: A complex component for managing a dynamic list of authors and affiliations, including linking them and setting a corresponding author. Contains important auto-capitalization logic for names.AbstractBodyInput.jsx & KeywordsInput.jsx: Manage their respective text areas and include the section-specific formatting controls.Display & Utility ComponentsPreviewPanel.jsx: Renders a live, formatted preview of the abstract. Contains the critical logic for correctly displaying italicized organism names.Header.jsx: The main navigation bar, holding the theme switcher and the Download/Email action buttons.ScrollButtons.jsx: Provides persistent "Scroll to Top/Bottom" functionality for better mobile UX.3. Key Functionality & Important CodeThese are the most critical functions that power the application's core features.A. Two-Level Formatting State (App.jsx)The formatting system is controlled by two useState hooks, allowing for both global defaults and specific overrides.// In App.jsx
const [globalFormatting, setGlobalFormatting] = useState({
font: 'Arial',
fontSize: 12,
lineSpacing: 1.5,
alignment: 'left',
});

const [sectionFormatting, setSectionFormatting] = useState({
title: { alignment: 'center' },
authors: { alignment: 'center' },
// ... other sections
});
B. Strict Scientific Name Formatting (PreviewPanel.jsx)This function is the intellectual property of the app. It finds and corrects any user-typed variations of scientific names (case, punctuation) and wraps them in <em> tags for italicization. This ensures 100% compliance with scientific standards.// In PreviewPanel.jsx
const formatTextWithOrganisms = (text) => {
// ...
organisms.forEach(org => {
if (org.genus && org.species) {
const correctFullName = `${org.genus.charAt(0).toUpperCase() + org.genus.slice(1).toLowerCase()} ${org.species.toLowerCase()}`;
const correctAbbreviation = `${org.genus.charAt(0).toUpperCase()}. ${org.species.toLowerCase()}`;

      const fullNameRegex = new RegExp(`\\b${org.genus}\\s+${org.species}\\b`, 'gi');
      const abbreviationRegex = new RegExp(`\\b${org.genus.charAt(0)}\\.?\\s+${org.species}\\b`, 'gi');

      formattedText = formattedText.replace(fullNameRegex, `<em>${correctFullName}</em>`);
      formattedText = formattedText.replace(abbreviationRegex, `<em>${correctAbbreviation}</em>`);
    }

});
return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
};
C. Reliable .docx Generation (App.jsx)The handleDownload function uses the docx library to build a professional-grade Word document directly from the state data. This approach is far more reliable than HTML conversion.Key Snippet: The Superscript FixThe most critical part of this function is the definition of a characterStyles block. This solved the file corruption bug by creating a reusable, reliable style for all superscripts.// In handleDownload function in App.jsx
const doc = new Document({
// ... sections and paragraphs
characterStyles: [{
id: 'superscriptStyle',
name: 'Superscript',
run: {
font: getStyle('authors').font,
size: getStyle('authors').fontSize * 2,
superscript: true, // Correct, all-lowercase property
},
}],
});

// Superscripts are then applied using this style:
// new TextRun({ text: superscripts, style: "superscriptStyle" })
D. Intelligent Email Workflow (App.jsx)The handleEmailShare function provides a professional workflow by first triggering the .docx download and then opening the user's default mail client with a pre-filled message, ready for the user to attach the file.// In handleEmailShare function in App.jsx
alert("The .docx file will be downloaded first. Please attach it to the email that will open.");
const { blob, filename } = await handleDownload(true);
saveAs(blob, filename);

const subject = title || "Scientific Abstract";
// ... create body text ...
const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
window.location.href = mailtoLink; 4. Project Setup & Dependenciespackage.json: Key dependencies include:react, react-dom: Core framework.tailwindcss: For styling.docx: For reliable .docx file generation.file-saver: For triggering browser file downloads.@heroicons/react: For UI icons.vite.config.js: The configuration is now clean and simple, with no complex plugins or polyfills required.5. Path for Future DevelopmentThe current architecture provides a solid foundation for new features.User Accounts & Database: Integrate Firebase or a similar backend to allow users to save, load, and manage multiple abstracts.Additional Export Formats: Add options to download the abstract as a .txt file or generate a PDF.Template/Guideline System: Create a feature where users can select a journal (e.g., "Nature," "Science") and have the formatting options automatically adjust to match that journal's submission guidelines.UI Expansion: Implement a side navigation menu (from the hamburger button) to accommodate future pages like "My Abstracts," "Settings," or "Help."
