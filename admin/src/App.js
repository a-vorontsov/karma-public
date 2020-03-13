import React from 'react';
import './App.css';
import {Header} from './components/Header'
import {HighlightedStats} from "./components/HighlightedStats";
import {TabView} from "./components/TabView";

function App() {
  return (
    <div className="App">
        <Header/>
        <HighlightedStats/>
        <TabView/>
    </div>
  );
}

export default App;
