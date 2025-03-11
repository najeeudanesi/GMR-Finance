import React from "react";

function DateInput(props) {
  return (
    <div className="flex flex-v-center m-t-10">
      {props.label &&
        <div className="label text-sm text-green">{props.label}</div>
      }
      <input type="date" name={props.name} id={props.id} className="dateinput" onChange={props.onChange} value={props.value} disabled={props.disabled} />
    </div>
  );
}

export default DateInput;
