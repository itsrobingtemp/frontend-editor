import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

// CSS
import "./index.css";

// Pages
import Editor from "./components/Editor/Editor";
import Login from "./pages/Login/Login.js";
import Register from "./pages/Register/Register.js";

// components
import Nav from "./components/Nav/Nav";

// const ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT;

function App() {
  const token = localStorage.getItem("auth-token");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (token !== null) {
      setLoggedIn(true);
    }
  }, [token]);

  return (
    <>
      <Router>
        <Nav loggedIn={loggedIn} />
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? (
                <div className="editor__wrapper">
                  <Editor />
                </div>
              ) : (
                <Login />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
