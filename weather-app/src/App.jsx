import React from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import NearbyCities from './components/NearbyCities';
import { useWeather } from './hooks/useWeather';
import './index.css';

function App() {
  const { 
    weatherCards, 
    loading, 
    error, 
    nearbyCities, 
    fetchWeather, 
    removeCard, 
    addNearbyCity 
  } = useWeather();

  // Create a handler function for removing cards
  const handleRemoveCard = (cardId) => {
    if (typeof removeCard === 'function' && cardId) {
      removeCard(cardId);
    }
  };

  // Create a handler function here to ensure it exists
  const handleCityClick = (city) => {
    if (city && city.coords) {
      addNearbyCity(city);
    }
  };

  return (
    <div className="container">
      <Header />
      
      <SearchBar onSearch={fetchWeather} />
      
      {loading && weatherCards.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#fff', fontSize: '1.2rem' }}>Loading weather data...</p>
        </div>
      )}
      
      {error && (
        <div className="glass-card" style={{ 
          textAlign: 'center', 
          padding: '2rem',
          borderLeft: '5px solid var(--danger-color)'
        }}>
          <p style={{ color: '#fff', fontSize: '1.2rem' }}>{error}</p>
        </div>
      )}
      
      {!loading && nearbyCities.length > 0 && (
        <NearbyCities 
          cities={nearbyCities} 
          onCityClick={handleCityClick} // Use the local handler function
        />
      )}
      
      <div className="weather-cards-container">
        {weatherCards.length > 0 && (
          <>
            {/* Main Card (First Card) */}
            {weatherCards[0] && (
              <WeatherCard 
                card={weatherCards[0]} 
                onRemove={handleRemoveCard}
                isMainCard={true}
              />
            )}
            
            {/* Additional Cards */}
            {weatherCards.length > 1 && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                {weatherCards.slice(1).map(card => (
                  <WeatherCard 
                    key={card.id} 
                    card={card} 
                    onRemove={handleRemoveCard}
                    isMainCard={false}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.9rem'
      }}>
        <p>Created with React & Vite | Weather data from OpenWeatherMap</p>
      </footer>
    </div>
  );
}

export default App;
