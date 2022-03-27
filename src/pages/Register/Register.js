import { useState } from "react";
import axios from "axios";

// CSS
import "./Register.css";

const API_URL = process.env.REACT_APP_API_PROD_URL;

function Register() {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const handleRegister = () => {
    if (password !== passwordRepeat) return setError("Lösenorden matchar inte");
    if (email !== "" || password !== "" || passwordRepeat === password) {
      const query = `mutation {
        registerUser(email: "${email}", password: "${password}") {
          token
        }
      }`;

      fetch(API_URL + "/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          localStorage.setItem("auth-token", data.data.registerUser.token);

          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          setError("Nått gick snett, försök pånytt");
        });
    } else {
      setError("Ange all uppgifter");
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
