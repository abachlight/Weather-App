import React, { useState } from 'react';

const Autosuggest = ({ inputProps, suggestion = [] }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSelect = (value) => {
    inputProps.onChange({ target: { name: inputProps.name, value } });
    setShowSuggestions(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        {...inputProps}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      />
      {showSuggestions && suggestion.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          zIndex: 999,
          maxHeight: '150px',
          overflowY: 'auto',
        }}>
          {suggestion.map((item, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelect(item)}
              style={{ padding: '8px', cursor: 'pointer' }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autosuggest;
