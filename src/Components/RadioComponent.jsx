import React, { useState } from 'react';

function RadioComponent() {
  const [selectedValue, setSelectedValue] = useState('onlyMyTasks');

  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <div>
      <label>
        <input
          type="radio"
          value="onlyMyTasks"
          checked={selectedValue === 'onlyMyTasks'}
          onChange={() => handleRadioChange('onlyMyTasks')}
        />
        Только свои задачи
      </label>
      <label>
        <input
          type="radio"
          value="allTasks"
          checked={selectedValue === 'allTasks'}
          onChange={() => handleRadioChange('allTasks')}
        />
        Все задачи
      </label>
    </div>
  );
}

export default RadioComponent;
