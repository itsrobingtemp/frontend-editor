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

function Editor({ socket }) {
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
  const [customError, setCustomError] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_DEV_URL;
  // const API_DEV_URL = process.env.REACT_APP_API_DEV_URL;
  const token = localStorage.getItem("auth-token");

  // Get all documents on load
  useEffect(() => {
    if (token) {
      axios
        .get(API_URL + "/get", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          if (res.data.length > 0) {
            setDocuments(res.data);
          } else {
            setMessage("Denna användare har inga nuvarande dokument");
          }
        });
    }
  }, [documentsUpdated, API_URL, token]);

  // Joining room for the document
  useEffect(() => {
    socket.emit("create", currentDocument._id);
  }, [currentDocument, socket]);

  // Data to be emitted
  let data = {
    _id: currentDocument._id,
    html: currentText,
  };

  // Emitting data to server
  socket.emit("doc", data);

  // Receiving data from server
  socket.on("doc", (data) => {
    setCurrentText(data.html);
  });

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
      .patch(
        API_URL + "/update/" + currentDocument._id,
        {
          _id: currentDocument._id,
          text: currentText,
          name: currentName,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((res) => {
        setError("");
        setDocumentsUpdated(!documentsUpdated);
        setMessage("Dokumentet har uppdaterats");
      })
      .catch((err) => {
        setMessage("");
        setError(true);
      });
  };

  // Add new document
  const createDocument = () => {
    axios
      .post(
        API_URL + "/post",
        {
          text: currentText,
          name: currentName,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((res) => {
        setError("");
        setDocumentsUpdated(!documentsUpdated);
        setMessage("Dokumentet har skapats");
      })
      .catch((err) => {
        setMessage("");
        setError(true);
      });
  };

  return (
    <>
      <Toolbar
        newDocument={resetDocumentValue}
        updateDocument={updateDocument}
        createDocument={createDocument}
      />
      <input
        type="text"
        className="input__name"
        placeholder="Namn på dokument"
        value={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
      />
      <ReactQuill theme="snow" value={currentText} onChange={setCurrentText} />

      {error && <Error />}
      {customError && <Error customError={customError} />}
      {message && <div className="message__wrapper">{message}</div>}

      {documents.length > 0 && (
        <Documents
          documents={documents}
          setNewDocumentValue={setNewDocumentValue}
        />
      )}
    </>
  );
}

export default Editor;
