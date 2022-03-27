import { useState } from "react";
import axios from "axios";

// CSS
import "./Login.css";

const API_URL = process.env.REACT_APP_API_PROD_URL;

function Login() {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email !== "" || password !== "") {
      const query = `mutation {
        loginUser(email: "${email}", password: "${password}") {
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
          localStorage.setItem("auth-token", data.data.loginUser.token);
          window.location.href = "/";
        })
        .catch((err) => {
          setError("Nått gick snett, försök pånytt");
        });
    } else {
      setError("Ange inloggningsuppgifter");
    }
  };

  return (
    <div className="form__wrapper">
      <h1>Logga in</h1>
      <p>
        Applikationen kan testas med email: test@test.com & lösenord: test123
      </p>
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
      <button className="toolbar__btn" onClick={handleLogin}>
        Logga in
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;
