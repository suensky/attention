import React from 'react';

const Forecast = ({ forecast }) => {
  if (!forecast) return null;

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="glass-card">
      <h3 style={{ 
        marginBottom: '1.5rem', 
        color: '#fff',
        fontSize: '1.5rem'
      }}>
        5-Day Forecast
      </h3>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        overflowX: 'auto',
        gap: '1rem',
        padding: '0.5rem 0'
      }}>
        {forecast.map((day, index) => (
          <div 
            key={index}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minWidth: '80px'
            }}
          >
            <p style={{ fontWeight: '500', color: '#fff' }}>
              {formatDate(day.dt_txt)}
            </p>
            <img 
              src={getWeatherIcon(day.weather[0].icon)} 
              alt={day.weather[0].description}
            />
            <p style={{ color: '#fff' }}>
              {Math.round(day.main.temp)}°C
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast; 