import "./App.css";
import TodoItemCreator from "./components/TodoItemCreator";
import { useRecoilValue } from "recoil";
import { filteredTodoListState, todoListState } from "./todoAtoms";
import TodoItem from "./components/TodoItem";
import TodoListFilters from "./components/TodoListFilters";
import TodoListState from "./components/TodoListState";
import { currentUserNameQuery } from "./userAtoms";
import { Suspense } from "react";

/**
 * Suspense
 * => React 렌더 함수가 동기인데 Promise 가 resolve 되기 전에 렌더하기 위한 목적
 * => Recoil 은 보류중인 데이터를 다루기 위해 React Suspense 와 함께 동작하도록 디자인돼 있음
 * => 컴포넌트를 Suspense 의 경계로 ㅅ감싸는 것으로 아직 보류 중인 하위 항목들을 잡아내고 대체하기 위한 UI를 렌더함
 */

function App() {
  const filteredTodoList = useRecoilValue(filteredTodoListState);
  return (
    <div>
      <Suspense fallback={LoadingComponent()}>
        <CurrentUserInfo />
      </Suspense>
      <TodoListState />
      <TodoListFilters />
      <TodoItemCreator />
      {filteredTodoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </div>
  );
}

export default App;

function CurrentUserInfo() {
  const userName = useRecoilValue(currentUserNameQuery);
  return <div>{userName}</div>;
}

function LoadingComponent() {
  return <div>Loading...</div>;
}
