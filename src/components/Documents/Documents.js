// import { useState } from "react";

// CSS
import "./Documents.css";
// import { getDocumentPreview } from "../../helpers/helpers.js";

function Documents({ documents, setNewDocumentValue }) {
  return (
    <div className="documents__wrapper">
      <h2>Ladda dokument</h2>
      {documents.map((document) => {
        return (
          <div
            className="document__wrapper"
            key={document._id}
            onClick={() => setNewDocumentValue(document)}
          >
            <div className="document__id">Dokumentnamn: {document.name}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Documents;
