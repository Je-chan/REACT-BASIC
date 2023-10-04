import "./App.css";
import { atom, selector, useRecoilState } from "recoil";
import TextInput from "./components/TextInput";
import CharacterCount from "./components/CharacterCount";

export const textState = atom({
  key: "textState",
  default: "",
});

export const characterCountState = selector({
  key: "characterCount",
  get: (recoilValue) => {
    console.log(recoilValue);
    const test = recoilValue.get(textState);

    return test.length;
  },
});
function App() {
  return (
    <div>
      <TextInput />
      <CharacterCount />
    </div>
  );
}

export default App;
