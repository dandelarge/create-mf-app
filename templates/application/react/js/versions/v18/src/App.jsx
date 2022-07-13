import React from "react";
import * as ReactDOM from 'react-dom/client';

import "./index.{{CSS_EXTENSION}}";

const App = () => (
  <div className="{{CONTAINER}}">
    <div>Name: {{ NAME }}</div>
    <div>Framework: {{ FRAMEWORK }}</div>
    <div>Language: {{ LANGUAGE }}</div>
    <div>CSS: {{ CSS }}</div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
