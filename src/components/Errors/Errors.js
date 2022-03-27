import Error from "../Error/Error";

function Errors({ error, customError, message }) {
  return (
    <div className="toolbar__error-wrapper">
      {error && <Error />}
      {customError && <Error customError={customError} />}
      {message && <div className="message__wrapper">{message}</div>}
    </div>
  );
}

export default Errors;
