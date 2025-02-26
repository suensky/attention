import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'API_KEY'; // Replace with your API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const REVERSE_GEO_URL = 'https://api.openweathermap.org/geo/1.0/reverse';

export const useWeather = () => {
  const [weatherCards, setWeatherCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nearbyCities, setNearbyCities] = useState([]);
  
  // Format location to display city, state, country
  // Moving this function to the top so it's defined before being used
  const formatLocation = (city, state, country) => {
    let result = city;
    if (state) result += `, ${state}`;
    if (country) result += `, ${country}`;
    return result;
  };
  
  // Fetch weather for a specific location
  const fetchWeather = async (searchLocation, addAsNewCard = true) => {
    try {
      setLoading(true);
      setError(null);
      
      // Step 1: Get coordinates from city name using geocoding API
      const geoResponse = await axios.get(GEO_URL, {
        params: {
          q: searchLocation || 'London',
          limit: 1,
          appid: API_KEY
        }
      });
      
      if (!geoResponse.data || geoResponse.data.length === 0) {
        throw new Error(`City "${searchLocation}" not found. Please try another location.`);
      }
      
      const { lat, lon, name, state, country } = geoResponse.data[0];
      
      // Step 2: Get nearby cities (only when adding a new card)
      if (addAsNewCard) {
        fetchNearbyCities(lat, lon);
      }
      
      // Step 3: Get current weather
      const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: API_KEY
        }
      });
      
      // Step 4: Get forecast
      const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: API_KEY
        }
      });
      
      // Process forecast data to get one forecast per day
      const dailyForecasts = forecastResponse.data.list.filter((forecast, index) => index % 8 === 0);
      
      const locationData = {
        city: name,
        state: state || '',
        country,
        formattedName: formatLocation(name, state, country)
      };
      
      const newCard = {
        id: Date.now(),
        location: locationData,
        weatherData: weatherResponse.data,
        forecast: dailyForecasts,
        coords: { lat, lon }
      };
      
      if (addAsNewCard) {
        // Limit to max 4 cards
        setWeatherCards(prevCards => {
          const updatedCards = [newCard, ...prevCards];
          return updatedCards.slice(0, 4);
        });
      } else {
        // Replace the first card with updated data
        setWeatherCards(prevCards => {
          const updatedCards = [...prevCards];
          updatedCards[0] = newCard;
          return updatedCards;
        });
      }
      
    } catch (err) {
      console.error('Error fetching weather data:', err);
      
      if (err.response) {
        if (err.response.status === 401) {
          setError('API key invalid or inactive. Please check your API key.');
        } else if (err.response.status === 404) {
          setError(`Location not found. Please try another location.`);
        } else {
          setError(`Error: ${err.response.data.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        setError('No response from server. Please check your internet connection.');
      } else {
        setError(err.message || 'Failed to fetch weather data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch weather using geolocation coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get location name from coordinates
      const reverseGeoResponse = await axios.get(REVERSE_GEO_URL, {
        params: {
          lat,
          lon,
          limit: 1,
          appid: API_KEY
        }
      });
      
      let locationData = { city: 'Unknown Location', state: '', country: '' };
      
      if (reverseGeoResponse.data && reverseGeoResponse.data.length > 0) {
        const { name, state, country } = reverseGeoResponse.data[0];
        locationData = {
          city: name,
          state: state || '',
          country,
          formattedName: formatLocation(name, state, country)
        };
      }
      
      // Get nearby cities
      fetchNearbyCities(lat, lon);
      
      // Get current weather
      const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: API_KEY
        }
      });
      
      // Get forecast
      const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: API_KEY
        }
      });
      
      // Process forecast data
      const dailyForecasts = forecastResponse.data.list.filter((forecast, index) => index % 8 === 0);
      
      const newCard = {
        id: Date.now(),
        location: locationData,
        weatherData: weatherResponse.data,
        forecast: dailyForecasts,
        coords: { lat, lon }
      };
      
      setWeatherCards(prevCards => {
        // If it's the initial load, set as the only card,
        // otherwise add it to existing cards (up to max 4)
        if (prevCards.length === 0) {
          return [newCard];
        } else {
          const updatedCards = [newCard, ...prevCards];
          return updatedCards.slice(0, 4);
        }
      });
      
    } catch (err) {
      console.error('Error fetching weather with coordinates:', err);
      setError('Failed to fetch weather data. Please try again later.');
      
      // If no cards are displayed yet, fallback to default location
      if (weatherCards.length === 0) {
        fetchWeather('London');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Find nearby cities based on coordinates
  const fetchNearbyCities = async (lat, lon) => {
    try {
      // Find cities within a roughly 50 km radius
      // This is a simplified approach - ideally you would use a dedicated "nearby cities" API
      const cities = [];
      const distances = [0.5, 0.7, 0.9, 1.1]; // Roughly 50-100km offsets
      const directions = [
        { latOffset: 1, lonOffset: 0, name: 'north' },
        { latOffset: -1, lonOffset: 0, name: 'south' },
        { latOffset: 0, lonOffset: 1, name: 'east' },
        { latOffset: 0, lonOffset: -1, name: 'west' }
      ];
      
      // Generate nearby points and get cities
      for (let i = 0; i < directions.length; i++) {
        const dir = directions[i];
        const distance = distances[i % distances.length];
        
        // Approx conversion (not accurate for large distances)
        const newLat = lat + (dir.latOffset * distance);
        const newLon = lon + (dir.lonOffset * distance);
        
        const reverseGeoResponse = await axios.get(REVERSE_GEO_URL, {
          params: {
            lat: newLat,
            lon: newLon,
            limit: 1,
            appid: API_KEY
          }
        });
        
        if (reverseGeoResponse.data && reverseGeoResponse.data.length > 0) {
          const { name, state, country } = reverseGeoResponse.data[0];
          
          // Skip if it's too similar to current location
          if (weatherCards.length > 0 && name === weatherCards[0]?.location.city) continue;
          
          cities.push({
            id: `${name}-${country}-${i}-${Date.now()}`, // More unique ID combining multiple values
            name,
            state: state || '',
            country,
            formattedName: formatLocation(name, state, country),
            coords: { lat: newLat, lon: newLon }
          });
        }
      }
      
      setNearbyCities(cities);
    } catch (err) {
      console.error('Error fetching nearby cities:', err);
      // Continue without nearby cities if there's an error
      setNearbyCities([]);
    }
  };

  useEffect(() => {
    // Get user's location on initial load (if available)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Get weather directly with coordinates
            const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
              params: {
                lat: latitude,
                lon: longitude,
                units: 'metric',
                appid: API_KEY
              }
            });
            
            // Get forecast with coordinates
            const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
              params: {
                lat: latitude,
                lon: longitude,
                units: 'metric',
                appid: API_KEY
              }
            });
            
            setWeatherCards([{
              id: Date.now(),
              location: {
                city: weatherResponse.data.name,
                state: '',
                country: '',
                formattedName: formatLocation(weatherResponse.data.name, '', '')
              },
              weatherData: weatherResponse.data,
              forecast: forecastResponse.data.list.filter((forecast, index) => index % 8 === 0),
              coords: { lat: latitude, lon: longitude }
            }]);
          } catch (err) {
            console.error('Error fetching weather with geolocation:', err);
            fetchWeather(); // Fallback to default
          }
        }, 
        () => fetchWeather() // Fallback to default if user denies location
      );
    } else {
      fetchWeather(); // Fallback for browsers not supporting geolocation
    }
  }, []);

  // Add nearby city as a new card
  const addNearbyCity = (cityData) => {
    if (cityData && cityData.coords && cityData.coords.lat && cityData.coords.lon) {
      fetchWeatherByCoords(cityData.coords.lat, cityData.coords.lon);
    } else {
      console.error("Invalid city data provided:", cityData);
    }
  };

  // Remove a weather card
  const removeCard = (cardId) => {
    if (!cardId) {
      console.error('No card ID provided to removeCard function');
      return;
    }
    
    setWeatherCards(prev => prev.filter(card => card.id !== cardId));
  };

  return { weatherCards, loading, error, nearbyCities, fetchWeather, fetchWeatherByCoords, addNearbyCity, removeCard };
}; 