import React from "react";
import { useRecoilValue } from "recoil";
import { characterCountState } from "../App";

function CharacterCount(props) {
  const count = useRecoilValue(characterCountState);
  return <div>Character Count : {count}</div>;
}

export default CharacterCount;
