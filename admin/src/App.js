import React from 'react';
import './App.css';
import {Header} from './components/Header'
import {HighlightedStats} from "./components/HighlightedStats";
import {TabView} from "./components/TabView";

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#00c5c4',
            main: '#01a7a6',
            // dark: '#000',
            contrastText: '#f8f8f8',
        },
        secondary: {
            light: '#000',
            main: '#ea5962',
            dark: '#000',
            contrastText: '#000',
        },
    },
});


function App() {
  return (
    <div className="App">
        <MuiThemeProvider theme={theme}>
        <Header/>
        <HighlightedStats/>
        <TabView/>
        </MuiThemeProvider>
    </div>
  );
}

export default App;
