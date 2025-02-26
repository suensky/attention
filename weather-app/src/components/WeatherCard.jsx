import React from 'react';
import { 
  FaTemperatureHigh, 
  FaWind, 
  FaTint,
  FaCompass,
  FaTimes
} from 'react-icons/fa';
import { getWeatherEffectClass } from '../utils/weatherEffects';

const WeatherCard = ({ card, onRemove, isMainCard = false }) => {
  if (!card?.weatherData) return null;

  const { weatherData, location, forecast } = card;
  const weatherCode = weatherData.weather[0].id;
  const weatherEffectClass = getWeatherEffectClass(weatherCode);

  // Safely handle remove click with added checks
  const handleRemoveClick = () => {
    if (typeof onRemove === 'function' && card?.id) {
      onRemove(card.id);
    } else {
      console.error('Remove function not available or card ID missing');
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  return (
    <div className="glass-card" style={{ marginBottom: '1rem', position: 'relative' }}>
      {/* Weather animation effect */}
      <div className={weatherEffectClass}></div>
      
      {!isMainCard && (
        <button 
          onClick={handleRemoveClick} 
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            zIndex: 2
          }}
        >
          <FaTimes size={16} />
        </button>
      )}

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: isMainCard ? '2rem' : '1.5rem', color: '#fff' }}>
          {location.city}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>
          {location.state && `${location.state}, `}{location.country}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div style={{ 
        position: 'relative',
        zIndex: 1,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ textAlign: 'center' }}>
          <img 
            src={getWeatherIcon(weatherData.weather[0].icon)} 
            alt={weatherData.weather[0].description}
            style={{ width: isMainCard ? '120px' : '80px', height: isMainCard ? '120px' : '80px' }}
          />
          <p style={{ 
            textTransform: 'capitalize', 
            fontSize: isMainCard ? '1.2rem' : '1rem', 
            color: '#fff',
            fontWeight: '500'
          }}>
            {weatherData.weather[0].description}
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          padding: '0 1rem',
        }}>
          <h1 style={{ 
            fontSize: isMainCard ? '4rem' : '3rem', 
            fontWeight: '700', 
            color: '#fff',
            margin: 0,
            lineHeight: 1,
          }}>
            {Math.round(weatherData.main.temp)}°C
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>
            Feels like {Math.round(weatherData.main.feels_like)}°C
          </p>
        </div>
      </div>

      <div style={{ 
        position: 'relative',
        zIndex: 1,
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: '1rem',
        marginTop: '2rem',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: '#fff',
          gap: '0.5rem'
        }}>
          <FaTemperatureHigh size={20} />
          <div>
            <p style={{ fontWeight: '500' }}>Min/Max</p>
            <p>{Math.round(weatherData.main.temp_min)}°/{Math.round(weatherData.main.temp_max)}°</p>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: '#fff',
          gap: '0.5rem'
        }}>
          <FaWind size={20} />
          <div>
            <p style={{ fontWeight: '500' }}>Wind</p>
            <p>{Math.round(weatherData.wind.speed * 3.6)} km/h</p>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: '#fff',
          gap: '0.5rem'
        }}>
          <FaTint size={20} />
          <div>
            <p style={{ fontWeight: '500' }}>Humidity</p>
            <p>{weatherData.main.humidity}%</p>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: '#fff',
          gap: '0.5rem'
        }}>
          <FaCompass size={20} />
          <div>
            <p style={{ fontWeight: '500' }}>Pressure</p>
            <p>{weatherData.main.pressure} hPa</p>
          </div>
        </div>
      </div>

      {isMainCard && forecast && (
        <div style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
          <h3 style={{ 
            marginBottom: '1rem', 
            color: '#fff',
            fontSize: '1.2rem'
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
                  minWidth: '70px'
                }}
              >
                <p style={{ fontWeight: '500', color: '#fff' }}>
                  {new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <img 
                  src={getWeatherIcon(day.weather[0].icon)} 
                  alt={day.weather[0].description}
                  style={{ width: '50px', height: '50px' }}
                />
                <p style={{ color: '#fff' }}>
                  {Math.round(day.main.temp)}°C
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard; 