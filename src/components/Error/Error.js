import "./Error.css";

function Error({ customError }) {
  return (
    <>
      {customError ? (
        <p className="error__wrapper">{customError}</p>
      ) : (
        <p className="error__wrapper">Något gick snett, försök pånytt</p>
      )}
    </>
  );
}

export default Error;
