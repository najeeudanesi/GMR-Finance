import React from 'react';
import { BsChevronDown } from "react-icons/bs";

const SortInput = ({ value, onChange, options, placeholder }) => (
  <div className="flex flex-v-center search-input bg-white relative h-11">
    <select
      value={value}
      onChange={onChange}
      className='w-full bg-transparent appearance-none border-none outline-none'
      style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
    >
      <option value="">{placeholder || 'Select filter'}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <BsChevronDown className="absolute right-2 pointer-events-none" />
  </div>
);

export default SortInput;