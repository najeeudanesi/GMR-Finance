import React from "react";

function SelectField({ name, disabled, options, value, onChange, label }) {
  return (
    <div className="flex flex-v-center m-t-10">
      <div className="label text-sm text-green">{label}</div>
      <select
        disabled={disabled}
        className="input-field"
        value={value}
        onChange={onChange}
      >
        <option value="">Select {name}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;
