import { Router, Link } from "react-router-dom";

// CSS
import "./Nav.css";

function Nav({ loggedIn }) {
  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    window.location.href = "/";
  };

  return (
    <div className="nav__wrapper">
      Robins Editor{" "}
      <div className="nav__menu">
        <Link to="/" className="nav__link">
          Hem
        </Link>
        {!loggedIn ? (
          <>
            <Link to="/register" className="nav__link">
              Registrera dig
            </Link>
            <Link to="/login" className="nav__link">
              Logga in
            </Link>
          </>
        ) : (
          <>
            <button className="nav__button" onClick={handleLogout}>
              Logga ut
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Nav;
