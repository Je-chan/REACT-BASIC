import "./App.css";
import TodoItemCreator from "./components/TodoItemCreator";
import { useRecoilValue } from "recoil";
import { filteredTodoListState, todoListState } from "./todoAtoms";
import TodoItem from "./components/TodoItem";
import TodoListFilters from "./components/TodoListFilters";
import TodoListState from "./components/TodoListState";

function App() {
  const todoList = useRecoilValue(todoListState);
  const filteredTodoList = useRecoilValue(filteredTodoListState);
  console.log(todoList);
  console.log(filteredTodoList);
  return (
    <div>
      <TodoListState />
      <TodoListFilters />
      <TodoItemCreator />
      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </div>
  );
}

export default App;
