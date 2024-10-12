import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './weather.css';
import DailyForecastCard from './DailyForecastCard';

const Weather = () => {
  const [city, setCity] = useState('Tirana');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

  const fetchWeatherData = async (cityName) => {
    if (!cityName) {
      setError('Please enter a city name.');
      setWeatherData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5184/api/weather/${cityName}`);
      setWeatherData(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('City not found. Please enter a valid city name.');
      } else {
        setError('Error fetching weather data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherData(`${latitude},${longitude}`);
    }, (err) => {
      console.error(err);
      fetchWeatherData(city); 
    });
  }, []);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = () => {
    fetchWeatherData(city);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemperature = (temp) => {
    return isCelsius ? Math.round(temp) : Math.round(temp * 9 / 5 + 32);
  };

  
  const dailyForecasts = [];
  weatherData?.list.forEach(dayData => {
    const date = new Date(dayData.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
    const temp = convertTemperature(dayData.main.temp);
    const minTemp = convertTemperature(dayData.main.temp_min);
    const maxTemp = convertTemperature(dayData.main.temp_max);
    const icon = dayData.weather[0]?.icon;
    const description = dayData.weather[0]?.description;

    const existingForecast = dailyForecasts.find(forecast => forecast.date === date);
    
    if (existingForecast) {
      existingForecast.temp = Math.max(existingForecast.temp, temp);
      existingForecast.minTemp = Math.min(existingForecast.minTemp, minTemp);
    } else {
      dailyForecasts.push({
        date: date,
        icon: icon,
        temp: temp,
        minTemp: minTemp,
        maxTemp: maxTemp,
        description: description,
      });
    }
  });

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Weather Forecast</h1>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city"
        />
        <div className="input-group-append">
          <button onClick={handleSearch} className="btn btn-primary">Search</button>
        </div>
      </div>

      <button onClick={toggleTemperatureUnit} className="btn btn-secondary mb-4">
        Switch to {isCelsius ? 'Fahrenheit' : 'Celsius'}
      </button>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {weatherData && !loading && !error && (
        <div className="row d-flex justify-content-center py-5">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card text-body" style={{ borderRadius: '35px' }}>
              <div className="card-body p-4">
                <div className="d-flex">
                  <h6 className="flex-grow-1">{city}</h6>
                  <h6>{new Date(weatherData.list[0].dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</h6>
                </div>

                <div className="d-flex flex-column text-center mt-5 mb-4">
                  <h6 className="display-4 mb-0 font-weight-bold">
                    {convertTemperature(weatherData.list[0].main.temp)}°{isCelsius ? 'C' : 'F'}
                  </h6>
                  <span className="small" style={{ color: '#868B94' }}>
                    {weatherData.list[0].weather[0].description}
                  </span>
                </div>

                <div className="d-flex align-items-center">
                  <div className="flex-grow-1" style={{ fontSize: '1rem' }}>
                    <div>
                      <i className="fas fa-wind fa-fw" style={{ color: '#868B94' }}></i>
                      <span className="ms-1"> {weatherData.list[0].wind.speed} km/h </span>
                    </div>
                    <div>
                      <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i>
                      <span className="ms-1"> {weatherData.list[0].main.humidity}% </span>
                    </div>
                    <div>
                      <i className="fas fa-sun fa-fw" style={{ color: '#868B94' }}></i>
                      <span className="ms-1"> {weatherData.list[0].clouds.all}% </span>
                    </div>
                  </div>
                  <div>
                    <img
                      src={`http://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`}
                      width="100px"
                      alt={weatherData.list[0].weather[0].description}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {weatherData && !loading && !error && (
        <div className="daily-forecast-container d-flex justify-content-center flex-wrap mt-5">
          {dailyForecasts.slice(1, 5).map((forecast, index) => (
            <DailyForecastCard key={index} dayData={forecast} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Weather;
