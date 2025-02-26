import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setSearchTerm('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="glass-card"
      style={{ 
        display: 'flex', 
        marginBottom: '2rem',
        padding: '0.75rem',
      }}
    >
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search city..."
        style={{
          flex: 1,
          padding: '0.75rem 1rem',
          border: 'none',
          borderRadius: '50px',
          outline: 'none',
          fontSize: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
        }}
      />
      <button 
        type="submit"
        className="btn"
        style={{ 
          marginLeft: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.75rem',
        }}
      >
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar; 