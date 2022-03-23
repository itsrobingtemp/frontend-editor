// CSS
import "./index.css";

// Components
import Editor from "./components/Editor/Editor";

// Socket
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://127.0.0.1:1337");
// const ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT;

function App() {
  return (
    <div className="editor__wrapper">
      <Editor socket={socket} />
    </div>
  );
}

export default App;
