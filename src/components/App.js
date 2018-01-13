import React, { Component } from 'react';
import WeatherApp from './Weather';

export default class App extends Component {
  render() {
    return (
      <main>
        <h1>Weather App</h1>
        <WeatherApp />
      </main>
    );
  }
}

