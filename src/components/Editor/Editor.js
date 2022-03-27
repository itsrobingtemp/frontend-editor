import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

// CSS
import "./Editor.css";

// Components
import Toolbar from "../Toolbar/Toolbar";
import Documents from "../Documents/Documents";
import Errors from "../Errors/Errors";

// Socket
import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://127.0.0.1:1337");

function Editor() {
  // All documents fetched
  const [documents, setDocuments] = useState([]);

  // Document states
  const [currentText, setCurrentText] = useState("");
  const [currentName, setCurrentName] = useState("Untitled");
  const [currentDocumentId, setCurrentDocumentId] = useState("");

  // If a doc gets updated, fetch them again
  const [documentsUpdated, setDocumentsUpdated] = useState(false);

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
          }
        });
    }
  }, [documentsUpdated, API_URL, token]);

  // Joining room for the document id
  useEffect(() => {
    socket.emit("create", currentDocumentId);
  }, [currentDocumentId]);

  // Sockets
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    // Receiving data from server
    socket.on("doc", (data) => {
      setCurrentText(data.html);
    });

    let data = {
      _id: currentDocumentId,
      html: currentText,
    };

    // Emitting data to server
    socket.emit("doc", data);

    return () => socket.off("doc");
  }, [currentText, currentDocumentId]);

  // Setting new document
  const setNewDocumentValue = (document) => {
    setCurrentText(document.text);
    setCurrentName(document.name);
    setCurrentDocumentId(document._id);
  };

  const resetDocumentValue = () => {
    setCurrentText("");
    setCurrentName("");
    setCurrentDocumentId("");
  };

  // Error
  const [error, setError] = useState(false);
  const [customError, setCustomError] = useState("");
  const [message, setMessage] = useState("");

  // Update document
  const updateDocument = () => {
    axios
      .patch(
        API_URL + "/update/" + currentDocumentId,
        {
          _id: currentDocumentId,
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
        setCurrentDocumentId(res.data._id);
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
        currentDocumentId={currentDocumentId}
        setMessage={setMessage}
        setCustomError={setCustomError}
        setError={setError}
        updateDocument={updateDocument}
        createDocument={createDocument}
        resetDocumentValue={resetDocumentValue}
      />

      <Errors error={error} customError={customError} message={message} />

      <input
        type="text"
        className="input__name"
        placeholder="Namn på dokument"
        value={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
      />

      <ReactQuill theme="snow" value={currentText} onChange={setCurrentText} />

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
