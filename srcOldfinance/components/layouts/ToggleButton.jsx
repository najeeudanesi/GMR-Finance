import React, { useState } from 'react';

const ToggleButton = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <label className="flex items-center cursor-pointer">
      <div className="ml-3 text-gray-700 font-medium mr-3">
        {isToggled ? 'Applicable' : 'Not Applicable'}
      </div>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isToggled}
          onChange={() => setIsToggled(!isToggled)}
        />
        <div className={`block w-14 h-6 rounded-full ${isToggled ? 'bg-green-200' : 'bg-gray-300'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-6 h-4 rounded-full transition-transform duration-300 ease-in-out ${isToggled ? 'transform translate-x-6' : ''}`}></div>
      </div>
    </label>
  );
};

export default ToggleButton;