import React, { useState, useEffect, useCallback } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import axios from "axios";
import { pdfExporter } from "quill-to-pdf";
import { saveAs } from "file-saver";

// CodeMirror
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

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

  // For the code editor
  const [editorIsCode, setEditorIsCode] = useState(false);
  const [codeEditorContent, setCodeEditorContent] = useState("false");

  // Variables
  const API_URL = process.env.REACT_APP_API_PROD_URL;
  const SOCKET_URL = process.env.REACT_APP_API_PROD_URL;
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
    if (token == null) return;

    if (!editorIsCode) {
      axios
        .get(API_URL + "/get", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          if (res.data.length > 0) {
            console.log(res);
            setDocuments(res.data);
          }
        });
    } else {
      axios
        .get(API_URL + "/get/code", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          if (res.data.length > 0) {
            setDocuments([]);
            setDocuments(res.data);
          }
        });
    }
  }, [documentsUpdated, API_URL, token, editorIsCode]);

  // Update document
  const updateDocument = () => {
    let text;

    if (editorIsCode) {
      text = codeEditorContent;
    } else {
      text = quill.getContents();
    }

    if (
      currentDocumentId == null ||
      text == null ||
      currentName == null ||
      token == null
    )
      return;

    axios
      .patch(
        API_URL + "/update/" + currentDocumentId,
        {
          _id: currentDocumentId,
          text: text,
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
    let text;
    let code;

    if (editorIsCode) {
      text = codeEditorContent;
      code = true;
    } else {
      text = quill.getContents();
      code = false;
    }

    if (text == null || currentName == null || token == null) return;

    axios
      .post(
        API_URL + "/post",
        {
          text: text,
          name: currentName,
          iscode: code,
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
    if (editorIsCode) {
      setCodeEditorContent(document.text);
    } else {
      quill.setContents(document.text);
    }

    setCurrentName(document.name);
    setCurrentDocumentId(document._id);
  };

  // Resetting to blank document
  const resetDocumentValue = () => {
    quill.setContents();
    setCurrentName("Default titel");
    setCurrentDocumentId("");
    setCodeEditorContent("");
    setMessage("");
    setError(false);
  };

  // Generates & downloads a PDF
  const generatePdf = async () => {
    if (editorIsCode) return;

    const quillDelta = quill.getContents();
    const pdfBlob = await pdfExporter.generatePdf(quillDelta);
    saveAs(pdfBlob, currentName + ".pdf");
  };

  // Switch editor type
  const handleEditor = () => {
    setEditorIsCode(!editorIsCode);
    resetDocumentValue();
    setDocuments([]);
  };

  // Executes code through API
  const executeCode = () => {
    if (!editorIsCode) return;

    try {
      const base64 = btoa(codeEditorContent);

      axios
        .post("https://execjs.emilfolino.se/code", {
          code: base64,
        })
        .then((response) => {
          let decodedOutput = atob(response.data.data);
          setMessage("Kod exekverad. Kolla konsolen!");
          console.log(decodedOutput);
        })
        .catch((error) => {
          setCustomError("Nått gick snett..");
        });
    } catch (err) {
      setCustomError("Nått gick snett med konverteringen till base64");
    }
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
        generatePdf={generatePdf}
        handleEditor={handleEditor}
        editorIsCode={editorIsCode}
        executeCode={executeCode}
      />

      <Errors error={error} customError={customError} message={message} />

      <input
        type="text"
        className="input__name"
        placeholder="Namn på dokument"
        value={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
      />

      {editorIsCode ? (
        <CodeMirror
          value={codeEditorContent}
          height="300px"
          extensions={[javascript({ jsx: true })]}
          onChange={(value, viewUpdate) => {
            setCodeEditorContent(value);
          }}
        />
      ) : (
        <div className="quill__container" ref={quillRef}></div>
      )}

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
