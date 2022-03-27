import React, { useState, useEffect, useCallback } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import axios from "axios";

// CSS
import "./Editor.css";

// Components
import Toolbar from "../Toolbar/Toolbar";
import Documents from "../Documents/Documents";
import Errors from "../Errors/Errors";

// Socket
import socketIOClient from "socket.io-client";

function Editor() {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  // All documents fetched
  const [documents, setDocuments] = useState([]);

  // Document states
  const [currentName, setCurrentName] = useState("Default titel");
  const [currentDocumentId, setCurrentDocumentId] = useState("");

  // If a doc gets updated, fetch list again
  const [documentsUpdated, setDocumentsUpdated] = useState(false);

  // Variables
  const API_URL = process.env.REACT_APP_API_DEV_URL;
  const SOCKET_URL = "http://127.0.0.1:1338";
  const token = localStorage.getItem("auth-token") || "";

  // Error
  const [error, setError] = useState(false);
  const [customError, setCustomError] = useState("");
  const [message, setMessage] = useState("");

  // Quill editor
  const quillRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, { theme: "snow" });

    setQuill(q);

    return () => {
      quillRef.innerHTML = "";
    };
  }, []);

  // Socket connection
  useEffect(() => {
    const s = socketIOClient(SOCKET_URL, {
      query: { token },
    });

    console.log("Connected to socket");

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [token]);

  // Send socket changes
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.emit("doc-joined", currentDocumentId);

    const handleDocUpdate = (delta, oldDelta, source) => {
      if (source !== "user") return;

      let data = {
        _id: currentDocumentId,
        delta,
      };

      socket.emit("send-doc-changes", data);
    };

    quill.on("text-change", handleDocUpdate);

    return () => {
      quill.off("text-change", handleDocUpdate);
    };
  }, [socket, quill, currentDocumentId]);

  // Receive socket change
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleDocUpdate = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-doc-changes", handleDocUpdate);

    return () => {
      socket.off("receive-doc-changes", handleDocUpdate);
    };
  }, [socket, quill]);

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

  // Update document
  const updateDocument = () => {
    axios
      .patch(
        API_URL + "/update/" + currentDocumentId,
        {
          _id: currentDocumentId,
          text: quill.getContents(),
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
          text: quill.getContents(),
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

  // Loading a new document
  const setNewDocumentValue = (document) => {
    quill.setContents(document.text);
    setCurrentName(document.name);
    setCurrentDocumentId(document._id);
  };

  // Resetting to blank document
  const resetDocumentValue = () => {
    quill.setContents();
    setCurrentName("");
    setCurrentDocumentId("");
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

      <div className="quill__container" ref={quillRef}></div>

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
