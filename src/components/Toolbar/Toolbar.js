// CSS
import "./Toolbar.css";

function Toolbar({
  currentDocumentId,
  setMessage,
  setCustomError,
  setError,
  updateDocument,
  createDocument,
  resetDocumentValue,
  generatePdf,
  handleEditor,
  editorIsCode,
  executeCode,
}) {
  return (
    <>
      <div className="toolbar__wrapper">
        <button
          className="toolbar__btn"
          onClick={() => {
            resetDocumentValue();
            setMessage("");
            setCustomError("");
            setError(false);
          }}
        >
          Nytt dokument
        </button>
        {currentDocumentId && (
          <button className="toolbar__btn" onClick={updateDocument}>
            Spara dokument
          </button>
        )}
        <button className="toolbar__btn" onClick={createDocument}>
          Spara som nytt dokument
        </button>
        {!editorIsCode && (
          <button className="toolbar__btn" onClick={generatePdf}>
            Ladda ned PDF
          </button>
        )}
        <button className="toolbar__btn" onClick={handleEditor}>
          Byt editor
        </button>
        {editorIsCode && (
          <button className="toolbar__btn" onClick={executeCode}>
            Exekvera kod
          </button>
        )}
      </div>
    </>
  );
}

export default Toolbar;
