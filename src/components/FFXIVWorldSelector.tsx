import React, { useState, useEffect } from 'react';
import '../styles/ffxiv-selector.css';
interface World {
  id: number;
  name: string;
}

interface FFXIVWorldSelectorProps {
  message: string;
}

const FFXIVWorldSelector: React.FC<FFXIVWorldSelectorProps> = ({ message = "Select a World" }) => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        const response = await fetch('https://universalis.app/api/v2/worlds');
        const data = await response.json();
        setWorlds(data);
      } catch (error) {
        console.error('Error fetching worlds:', error);
      }
    };

    fetchWorlds();

    // Load selected world from localStorage
    const savedWorld = localStorage.getItem('selectedWorld');
    if (savedWorld) {
      setSelectedWorld(savedWorld);
    }
  }, []);

  const handleWorldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWorld = event.target.value;
    setSelectedWorld(selectedWorld);
    localStorage.setItem('selectedWorld', selectedWorld); // Save to localStorage
  };

  const handleApplyClick = () => {
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="ffxiv-container">
      <label htmlFor="world-select" className="ffxiv-label">{message}</label>
      <select id="world-select" onChange={handleWorldChange} value={selectedWorld || ''} className="ffxiv-select">
        <option value="">--Please choose an option--</option>
        {worlds.map((world) => (
          <option key={world.id} value={world.name}>
            {world.name}
          </option>
        ))}
      </select>
      <button onClick={handleApplyClick} className="ffxiv-button">Apply</button>
    </div>
  );
};

export default FFXIVWorldSelector;