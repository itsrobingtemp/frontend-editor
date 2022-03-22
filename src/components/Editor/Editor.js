import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

// Components
import Toolbar from "../Toolbar/Toolbar";
import Documents from "../Documents/Documents";
import Error from "../Error/Error";

// CSS
import "./Editor.css";

function Editor() {
  // All documents fetched
  const [documents, setDocuments] = useState([]);

  // Current text in editor
  const [currentText, setCurrentText] = useState("");

  // Current name for document
  const [currentName, setCurrentName] = useState("Untitled");

  // Current document loaded
  const [currentDocument, setCurrentDocument] = useState({});

  // If a doc gets updated, fetch them again
  const [documentsUpdated, setDocumentsUpdated] = useState(false);

  // Error
  const [error, setError] = useState(false);

  const API_URL = process.env.REACT_APP_API_PROD_URL;
  // const API_DEV_URL = process.env.REACT_APP_API_DEV_URL;

  // Get all documents on load
  useEffect(() => {
    fetch(API_URL + "/get")
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data);
      });
  }, [documentsUpdated, API_URL]);

  // Setting new document
  const setNewDocumentValue = (document) => {
    setCurrentText(document.text);
    setCurrentName(document.name);
    setCurrentDocument(document);
  };

  const resetDocumentValue = () => {
    setCurrentText("");
    setCurrentName("");
    setCurrentDocument({});
  };

  // Update document
  const updateDocument = () => {
    axios
      .patch(API_URL + "/update/" + currentDocument._id, {
        _id: currentDocument._id,
        text: currentText,
        name: currentName,
      })
      .then((res) => {
        console.log(res);
        setDocumentsUpdated(!documentsUpdated);
      })
      .catch((err) => setError(true));
  };

  // Add new document
  const createDocument = () => {
    axios
      .post(API_URL + "/post", {
        text: currentText,
        name: currentName,
      })
      .then((res) => {
        console.log(res);
        setDocumentsUpdated(!documentsUpdated);
      })
      .catch((err) => setError(true));
  };

  return (
    <>
      <Toolbar
        newDocument={resetDocumentValue}
        updateDocument={updateDocument}
        createDocument={createDocument}
      />

      {error && <Error />}

      <input
        type="text"
        className="input__name"
        placeholder="Namn på dokument"
        value={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
      />

      <ReactQuill theme="snow" value={currentText} onChange={setCurrentText} />
      <Documents
        documents={documents}
        setNewDocumentValue={setNewDocumentValue}
      />
    </>
  );
}

export default Editor;
