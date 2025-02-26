import React from 'react';
import { FaCloudSunRain } from 'react-icons/fa';

const Header = () => {
  return (
    <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <FaCloudSunRain size={32} color="#fff" />
        <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: '700' }}>
          WeatherNow
        </h1>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '0.5rem' }}>
        Your beautiful weather companion
      </p>
    </header>
  );
};

export default Header; 