import React from "react";

function TextField(props) {
  return (
    <div className="flex flex-v-center m-t-10">
      {props.label &&
        <div className="label-textarea  text-sm text-green ">{props.label}</div>
      }
      <textarea
       className="text-area-input-field"
       
      />
    </div>
  );
}

export default TextField;
