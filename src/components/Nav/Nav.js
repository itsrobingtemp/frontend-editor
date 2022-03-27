import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// CSS
import "./Nav.css";

function Nav({ loggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    navigate("/");
  };

  return (
    <div className="nav__wrapper">
      Robins Editor{" "}
      <div className="nav__menu">
        {!loggedIn ? (
          <>
            <Link to="/register" className="nav__link">
              Registrera dig
            </Link>
            <Link to="/" className="nav__link">
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
