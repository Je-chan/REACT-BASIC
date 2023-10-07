import logo from "./logo.svg";
import "./App.css";
import TodoItemCreator from "./components/TodoItemCreator";
import { useRecoilValue } from "recoil";
import { todoListState } from "./todoAtoms";
import TodoItem from "./components/TodoItem";

function App() {
  const todoList = useRecoilValue(todoListState);
  console.log(todoList);
  return (
    <div>
      <TodoItemCreator />
      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </div>
  );
}

export default App;
