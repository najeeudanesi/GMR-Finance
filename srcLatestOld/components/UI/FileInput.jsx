import React from "react";

function FileInput(props) {
  return (
    <div className="flex flex-v-center m-t-20">
      <input
        className="text-area-input-field"
        type={props.type}
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
      />
    </div>
  );
}

export default FileInput;
