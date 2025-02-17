import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<ChatWindow />} />
      </Routes>
    </Router>
  );
};

export default App;
