import { useState } from "react";
import axios from "axios";

// CSS
import "./Register.css";

const API_URL = process.env.REACT_APP_API_DEV_URL;

function Register() {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const handleRegister = () => {
    if (password !== passwordRepeat) return setError("Lösenorden matchar inte");
    if (email !== "" || password !== "" || passwordRepeat === password) {
      axios
        .post(API_URL + "/user/register", {
          email: email,
          password: password,
        })
        .then((res) => {
          localStorage.setItem("auth-token", res.data.token);
          window.location.href = "/";
        })
        .catch((err) => {
          setError("Nått gick snett, försök pånytt");
        });
    }
  };

  return (
    <div className="form__wrapper">
      <h1>Registrera dig</h1>
      <input
        type="email"
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="input"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        className="input"
        placeholder="Repetera lösenord"
        value={passwordRepeat}
        onChange={(e) => setPasswordRepeat(e.target.value)}
      />
      <button className="toolbar__btn" onClick={handleRegister}>
        Registrera dig
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Register;
