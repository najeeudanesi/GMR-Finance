import React from "react";

function SelectField2({ name, disabled, options, value, onChange, label }) {
  return (
    <div className="flex flex-v-center m-t-10">
      <div className="label text-sm text-green">{label}</div>
      <select
        name={name} // Add the name attribute here
        disabled={disabled}
        className="input-field"
        value={value}
        onChange={onChange} // This will now include the name attribute
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option.id || option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField2;