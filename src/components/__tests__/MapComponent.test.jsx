// MapTest.jsx

import React, { useState } from 'react';
import MapComponent from '../MapComponent';

const MapTest = () => {
//  const [position, setPosition] = useState([51.505, -0.09]);

  return (
    <div>
      <h1>Test du composant MapComponent</h1>
      <MapComponent   />
    </div>
  );
};

export default MapTest;
