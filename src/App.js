import React, { useState, useEffect } from "react";
import './App.css'
import FileHandler from "./FileHandler";

function App() {

  return (
    <div className="page">
      <h1 className="header">Merry Christmas!</h1>
      <h2 className ="subtitle">Welcome to... your Mar Word Counter, a new site for all your translation word count needs!</h2>
        <FileHandler />
    </div>
  );
}

export default App;
