import React, { Component } from 'react';
import logo from './logo.svg';
import './assets/css/App.css';
import './assets/css/main.css';

import img from './assets/images/background.png';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className='test-scss'>{'TEST SCSS'}</div>
        <img src={img} alt='' />
      </div>
    );
  }
}

export default App;
