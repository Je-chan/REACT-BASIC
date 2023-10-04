import React from "react";
import { useRecoilState } from "recoil";
import { textState } from "../App";

function TextInput(props) {
  const [text, setText] = useRecoilState(textState);

  const handleChange = (event) => {
    setText(event.target.value);
  };
  return (
    <div>
      <input type="text" value={text} onChange={handleChange} />
      Echo: {text}
    </div>
  );
}

export default TextInput;
