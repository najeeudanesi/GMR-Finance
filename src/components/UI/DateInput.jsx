import React from "react";

function DateInput(props) {
  return (
    <div className="flex flex-v-center m-t-10">
      {props.label &&
        <div className="label text-sm text-green">{props.label}</div>
      }
     <input type="date" name="" id="" className="dateinput" />
    </div>
  );
}

export default DateInput;
