import React, { useState, useEffect } from 'react';

const AnotherComponent: React.FC = () => {
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);

  useEffect(() => {
    // Load selected world from localStorage
    const savedWorld = localStorage.getItem('selectedWorld');
    if (savedWorld) {
      setSelectedWorld(savedWorld);
    }
  }, []);

  return (
    <div>
      <p>Selected World: {selectedWorld}</p>
      <button onClick={() => {
        const newWorld = 'New World';
        setSelectedWorld(newWorld);
        localStorage.setItem('selectedWorld', newWorld); // Save to localStorage
      }}>
        Change World
      </button>
    </div>
  );
};

export default AnotherComponent;