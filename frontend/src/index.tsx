import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainController from "./Controllers/MainController";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// index is like Main.java
root.render(
  <React.StrictMode>
    <MainController />
  </React.StrictMode>
);
