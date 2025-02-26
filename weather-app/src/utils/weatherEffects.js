// Map OpenWeatherMap condition codes to our animation types
export const getWeatherEffect = (weatherCode) => {
  // Weather codes based on OpenWeatherMap API
  // https://openweathermap.org/weather-conditions
  
  if (weatherCode >= 200 && weatherCode < 300) {
    return 'thunderstorm';
  } else if ((weatherCode >= 300 && weatherCode < 400) || 
            (weatherCode >= 500 && weatherCode < 600)) {
    return 'rain';
  } else if (weatherCode >= 600 && weatherCode < 700) {
    return 'snow';
  } else if (weatherCode >= 700 && weatherCode < 800) {
    if (weatherCode === 771 || weatherCode === 781) {
      return 'wind'; // For squalls and tornado
    }
    return 'mist'; // For mist, fog, haze, etc.
  } else if (weatherCode === 800) {
    return 'clear';
  } else if (weatherCode > 800 && weatherCode < 900) {
    return 'clouds';
  }
  
  return 'default';
};

// Get CSS class name for the weather effect
export const getWeatherEffectClass = (weatherCode) => {
  const effect = getWeatherEffect(weatherCode);
  return `weather-effect ${effect}-effect`;
}; 