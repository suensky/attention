import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const NearbyCities = ({ cities, onCityClick }) => {
  if (!cities || cities.length === 0) return null;

  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <h3 style={{ 
        marginBottom: '1rem', 
        color: '#fff',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <FaMapMarkerAlt />
        Nearby Cities
      </h3>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {cities.map((city, index) => (
          <button 
            key={`${city.name}-${city.country}-${index}`}
            onClick={() => onCityClick(city)}
            className="btn"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              color: '#fff',
              transition: 'all 0.2s ease'
            }}
          >
            <FaMapMarkerAlt size={14} />
            {city.name}
            {city.state && `, ${city.state}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NearbyCities; 