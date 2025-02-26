# React(.ts) Frontend

A React-based frontend application designed to interact with the Node.js backend API for audio uploads, and report generation via the Speech Assessment Service (SAS).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [License](#license)

## Features

- **User-Friendly Interface**: Intuitive UI for creating and managing reports.
- **Audio Recording/Upload**: Allows stakeholders to upload audio files.
- **Student Details Input**: Form for entering student's details (UID, Name, Story Name).
- **Report Listing**: Displays a list of existing reports with relevant information.
- **Report Generation Trigger**: Enables users to trigger report generation via the backend API.
- **Real-time Updates**: Displays updated report details after generation.
- **Error Handling**: Provides clear error messages for user feedback.

## Tech Stack

- **React**: For building a typesafe user interface.
- **Axios**: For making HTTP requests to the backend API.
- **React Router**: For client-side routing.
- **@reduxjs/toolkit**: To manage global state in a simpler manner than Redux.
- **Material-UI**: For most of the styled components, tables and forms.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A running instance of the backend API (see [README.md](https://github.com/Illuminatus66/iitb-dap-backend#)).

### Installation

1. **Clone the repository:**

```bash
   git clone https://github.com/Illuminatus66/iitb-dap.git
   cd iitb-dap
```

2. **Install Dependencies:**

```bash
   npm install
```

3. **Configuration:**
- Change the BaseURL in the `src/api/index.ts` file to the URL for your backend

## Project Structure

```
frontend/
|-- public/
|   |-- index.html
|   |-- ...
|-- src/
|   |-- pages/
|   |   |-- HomeScreen.tsx
|   |   |-- DetailsScreen.tsx
|   |   |-- ReportsScreen.tsx
|   |-- components/
|   |   |-- AudioUploadModal.tsx
|   |   |-- FormattedTextDisplay.tsx
|   |   |-- Header.tsx
|   |-- reducers/
|   |   |-- reportsSlice.ts
|   |   |-- store.ts
|   |-- api/
|   |   |-- index.ts
|   |-- actions/
|   |   |-- reportActions.ts
|   |-- App.tsx
|   |-- index.tsx
|   |-- hooks.ts
|   |-- ...
|-- package.json
|-- tsconfig.json
|-- README.md
```

## Usage
1. Start the development server:

    ``` bash
    npm start
    ```

2. Open your browser and navigate to http://localhost:3000 (or the port specified).
3. Edit the AudioUploadModal.tsx component to include a form field for Reference_text_ID, and pass it with every new audio upload to store inside MongoDB for report generation later on.
3. Use the form to input student details and upload audio files.
4. View the list of reports and trigger report generation as and when needed.
5. Reports include all metrics along with a formatted text passage to give a visual representation of errors made by students.

## Understanding the Formatted Text

1. If a student omits a word, it is displayed with a strikethrough and the text is coloured black
2. If a student substitutes a word for another word, the incorrect word is displayed preceding the correct word which itself is displayed in round brackets. Both the words are coloured yellow.
3. If a student inserts a word before the next expected word, the inserted word is underlined and both the words are coloured black.
4. A special case is when the student inserts a word before a poorly enunciated word which would cause the SAS model to assign a low confidence score to the poorly enunciated word and a higher confidence score to another similar sounding word. This counts as a substitution against the same word preceding which, a word was inserted earlier. Those cases are handled in this manner `<ul>ins word</ul> subs word in yellow (correct word in yellow)`.
5. This also means that substitution doesn't happen on the index of a deleted word since the word score for the deleted word would be 0, thus causing it to be included in the 'ref_text_word' portion of <"ref_text_word_no_prefix"-"ref_text_word":"substituted_word">. The same goes for insertions.