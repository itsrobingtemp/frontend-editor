// CSS
import "./Toolbar.css";

function Toolbar({ newDocument, updateDocument, createDocument }) {
  return (
    <div className="toolbar__wrapper">
      <button className="toolbar__btn" onClick={() => newDocument()}>
        Nytt dokument
      </button>
      <button className="toolbar__btn" onClick={() => updateDocument()}>
        Spara dokument
      </button>
      <button className="toolbar__btn" onClick={() => createDocument()}>
        Spara som nytt dokument
      </button>
    </div>
  );
}

export default Toolbar;
