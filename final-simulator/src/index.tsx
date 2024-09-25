import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageQuery from "./page/PageQuery";
import QuestionList from "./components/QuestionList";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<QuestionList />} />
        <Route path="/page" element={<PageQuery />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// Measure performance
reportWebVitals();
