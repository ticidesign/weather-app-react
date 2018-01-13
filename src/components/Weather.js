import React, { Component } from 'react';
import axios from 'axios'

export default class WeatherApp extends Component {
  constructor(){
    super();
    //get Initial State
    this.state = {
      geolocationError: '',
      currentCity: '', 
      currentCountry: '',
      currentTemp: '',
      currentImg: '',
      description: '',
      humidity: '',
      windSpeed: '',
      windDegree: '',
      icon:'',
      isCelcius: true
    };
  }

  componentWillMount() {
    this.getCurrentLocation();
  }
  
  convertToFarenheit = () => {
    let temp = Math.round(this.state.currentTemp * 1.8 + 32);
    this.setState({
      isCelcius: false,
      currentTemp: temp
    })
  };

  convertToCelcius = () => {
    let temp = Math.round(((this.state.currentTemp - 32) / 1.8) * 100) /100
    this.setState({
      isCelcius: true,
      currentTemp: temp
    })
  };

  //get Current Location
  getCurrentLocation = () => {
    let latitude = '';
    let longitude = '';
    let userWeather = this.getWeather
    if(!navigator.geolocation){
      this.setState({geolocationError: 'Geolocation is not supported in your browser'})
    }
    
    function success(position){
      latitude  = position.coords.latitude;
      longitude = position.coords.longitude;
      userWeather(latitude, longitude);
    };
    
    function error(position) {
      this.setState({geolocationError: "Unable to retrieve location"})
    };
    
    navigator.geolocation.getCurrentPosition(success, error)
  };

  getWeather = (latitude, longitude) => {
    /* TODO: change to an other API to get more info */
    axios.get('https://fcc-weather-api.glitch.me/api/current?lat='+ latitude + '&lon=' + longitude)
    .then((response) => {
      let weather = response.data;
      let icon = weather.weather[0].main.toLowerCase() + '.svg';
      // console.log(response.data)
        this.setState(
          {
           currentTemp: Math.round(weather.main.temp *100) /100,
           currentCity: weather.name,
           description: weather.weather[0].description,
           currentCountry: weather.sys.country,
           currentImg: weather.name,
           humidity: weather.main.humidity,
           windSpeed: weather.wind.speed,
           windDegree: weather.wind.deg,
           icon: icon
          }
        )
        if(this.state.currentCountry === 'US') {
          this.convertToFarenheit()
        } 
      })
      .catch(error => {
      });
  };
  
  renderCelsius = () => {
    return (
      <div>
        {this.state.currentTemp} 
        <a onClick={() =>this.convertToFarenheit()}> &#8451; </a>
      </div>
    )
  };

  renderFarenheit = () => {
    return (
      <div>
        {this.state.currentTemp} 
        <a onClick={() => this.convertToCelcius()}> &#8457;</a>
      </div>
    )
  };


  render () {
    const { icon, currentCity, currentCountry, isCelcius, description, humidity, windSpeed, windDegree } = this.state;
    return (
      <section>
        <div className="geolocationError">{this.state.geolocationError}</div>
        <img src={icon ? icon : 'sun.svg'} alt={description}/>
        <div>
          <h3>{currentCity}, {currentCountry}</h3>
          <div className="degrees">
          {isCelcius ? 
            this.renderCelsius() :
            this.renderFarenheit()
          }
          </div>
          <div className="data">
            <h2>{description}</h2>
            <div>Wind: {windDegree} deg / {windSpeed} mph</div>
            <div>Humidity: {humidity}%</div>
          </div>
        </div>
      </section>
    )
  }
}