import { HashRouter as Router, Routes, Route } from "react-router-dom";

// CSS
import "./index.css";

// Pages
import Editor from "./components/Editor/Editor";
import Login from "./pages/Login/Login.js";
import Register from "./pages/Register/Register.js";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/editor"
            element={
              <div className="editor__wrapper">
                <Editor />
              </div>
            }
          ></Route>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
