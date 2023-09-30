import React from "react";
import "./App.css";

type Props = {
  value: any;
  onIncrement: () => void;
  onDecrement: () => void;
};

function App({ value, onIncrement, onDecrement }: Props) {
  return (
    <div className={"App"}>
      {/*Clicked: {value} times*/}
      <br />
      <button onClick={onIncrement}>+</button>
      <br />
      <button onClick={onDecrement}>-</button>
    </div>
  );
}

export default App;
