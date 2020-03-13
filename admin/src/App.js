import React from 'react';
import './App.css';
import {Header} from './components/Header'
import {HighlightedStats} from "./components/HighlightedStats";

function App() {
  return (
    <div className="App">
        <Header/>
        <HighlightedStats/>
    </div>
  );
}

export default App;
