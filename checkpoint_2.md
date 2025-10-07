Of course. It's an excellent practice to document the project's status. This checkpoint will serve as a comprehensive guide for anyone, including AI assistants, who might work on this project in the future.

---

## Project Checkpoint: Abstract Builder v1.1

**Date:** October 7, 2025
**Status:** Core functionality is stable, with a simplified UI and a new Abstract ID system. The application is successfully deployed as a static site on GitHub Pages.

### 1\. Core Architecture & Design Philosophy

The application is built on a robust and scalable architecture designed for maintainability and a focused user experience.

- **Technology Stack:** The project is a modern frontend application built with **React** and **Vite**, and styled with **Tailwind CSS**.
- **Component-Based Structure:** The UI is broken down into logical, reusable React components (e.g., `TitleInput`, `AuthorsInput`, `SubmissionDetails`), each responsible for a specific piece of the interface. This keeps the code clean and manageable.
- **Centralized State Management (`App.jsx`):** The main `App.jsx` component acts as the "single source of truth." It holds all the state for the abstract content (title, authors, category, etc.) and passes data and handler functions down to child components as props. **Any new feature requiring state should be managed here.**
- **Simplified, Hardcoded Formatting:** A key design decision was to **remove all dynamic formatting controls**. The initial vision of global and section-level formatting was replaced with a fixed, professional style defined directly in the document generator (`generateDocxWithMarkers.js`). This drastically simplifies the user interface and ensures all outputs have a consistent, high-quality format.

### 2\. Key Functionalities & Features

- **Dynamic Abstract ID Generation:** A unique ID is generated in real-time based on user input. This is a critical feature for tracking submissions.
  - **ID Format:** `Category_AuthorInitials_Date_Time` (e.g., `YIT_RP_710_837AM`).
  - **Real-time Display:** The `AbstractIdDisplay.jsx` component shows the user their ID as they type and explains how it's constructed.
  - **File Naming:** The downloaded `.docx` file is automatically named using this ID.
- **Fixed Academic Formatting:** The generated `.docx` adheres to a strict, non-editable style for fonts (Times New Roman), alignments, and spacing to ensure a professional look.
- **Author & Affiliation Management:** A dynamic system for adding multiple authors and affiliations. The final document correctly links them using **numeric superscripts**.
- **Scientific Name Formatting:** A helper function finds and correctly italicizes binomial names (e.g., _Escherichia coli_) in the title, body, and keywords.
- **Dark/Light Mode:** A persistent theme switcher in the header allows users to choose their preferred interface.
- **Static Site Deployment:** The project is fully configured for automated deployment to **GitHub Pages**.

### 3\. Critical Implementation Details (MUST READ for Future Modifications)

These are the most important technical details that anyone modifying the project must understand to avoid breaking key functionality.

#### **A. The `.docx` Generation: A Two-Step "Draft & Correct" Method**

This is the most critical piece of the application's logic. It was implemented to bypass a persistent bug where the `docx` library's superscript feature fails within the Vite build environment.

1.  **Step 1: The Draft (`generateDocxWithMarkers.js`):** This script **DOES NOT** create superscripts. Instead, it generates a document with simple, plain-text placeholders wherever a superscript should be (e.g., `##1##`, `##*##`). This avoids triggering the bug.
2.  **Step 2: The Correction (`postProcessDocx.js`):** This script runs in the browser _after_ the draft is generated. It uses the `jszip` library to unzip the `.docx` file in memory, reads the `word/document.xml`, and performs a string replacement. It finds the `##...##` placeholders and replaces them with the raw, correct XML code that Word uses for a superscript.

**Conclusion:** This two-step process is the **only reliable method** for generating superscripts in this project. Any changes to author or affiliation formatting in the `.docx` file must be made within this framework.

#### **B. Vite Configuration for GitHub Pages**

The `vite.config.js` file contains a critical line for deployment:

```javascript
base: '/repository-name/',
```

This `base` property **must exactly match the name of the GitHub repository**. If it is missing or incorrect, the deployed site will fail to load its CSS and JavaScript files, resulting in a blank page with 404 errors.

#### **C. GitHub Actions Deployment Workflow**

The project is deployed automatically via the `.github/workflows/deploy.yml` file.

- **Trigger:** The workflow runs on every `push` to the `main` branch.
- **Process:** It installs dependencies, runs `npm run build`, and deploys the contents of the `dist` folder to a separate `gh-pages` branch.
- **Permissions:** The workflow file includes a `permissions: contents: write` block. This is **essential**. Without it, the action will fail with a `git error 128` because it lacks permission to push the `gh-pages` branch back to the repository.

### 4\. Path for Future Development

The next logical major feature is to handle submissions automatically.

- **Save to Conference Google Drive:** This will require creating a **backend server** (e.g., using Node.js). The frontend will send the generated abstract to the backend, and the backend will use a secure **Google Service Account** to upload the file to a designated conference Google Drive folder. This architecture avoids exposing any private credentials to the client and provides a seamless "one-click-submit" experience for the user.
