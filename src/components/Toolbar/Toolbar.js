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
      </div>
    </>
  );
}

export default Toolbar;
