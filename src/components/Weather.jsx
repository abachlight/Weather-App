/* eslint-disable no-empty */
import React, { useEffect, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import snow_icon from '../assets/snow.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const Weather = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(false);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temerature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });

      setQuery(data.name); // update input with proper casing
      setSuggestions([]); // clear suggestions
    } catch (error) {
      setWeatherData(false);
      console.error("Error in fetching weather data");
    }
  };

  useEffect(() => {
    search("Lagos");
  }, []);

  // Fetch city suggestions
  useEffect(() => {
    const fetchCities = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`
        );
        const data = await response.json();

        if (data.results) {
          const names = data.results.map(city => city.name);
          setSuggestions(names);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchCities();
    }, 300); // debounce API call

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className='weather'>
      <div className="search-bar" style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder='Search city'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <img src={search_icon} alt='' onClick={() => search(query)} />

        {suggestions.length > 0 && (
          <ul style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            zIndex: 10,
            listStyle: 'none',
            padding: 0,
            margin: 0,
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            {suggestions.map((item, idx) => (
              <li
                key={idx}
                onMouseDown={() => search(item)}
                style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {weatherData && (
        <>
          <img src={weatherData.icon} alt="" className='weather-icon' />
          <p className='temperature'>{weatherData.temerature}°c</p>
          <p className='location'>{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
