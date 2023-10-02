import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./reducers";
import { PostPayload } from "./reducers/posts";
import { fetchPosts } from "./actions/post";

type Props = {
  onIncrement: () => void;
  onDecrement: () => void;
};

function App({ onIncrement, onDecrement }: Props) {
  const dispatch = useDispatch();
  // COUNTER
  // useSelector : Store 의 값에 접근할 수 있는 Hooks
  const counter = useSelector((state: RootState) => state.counter);

  // TODO_STATE
  const todos: string[] = useSelector((state: RootState) => state.todos);

  const [todoValue, setTodoValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoValue(e.target.value);
  };

  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "ADD_TODO", text: todoValue });
    setTodoValue("");
  };

  // THUNK
  const posts: PostPayload[] = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className={"App"}>
      Clicked: {counter} times
      <br />
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
      <br />
      <ul>
        {todos.map((todo, idx) => (
          <li key={idx}>{todo}</li>
        ))}
      </ul>
      <form onSubmit={addTodo}>
        <input type="text" value={todoValue} onChange={handleChange} />
        <input type="submit" />
      </form>
      <ul>
        {posts.map((post, idx) => (
          <li key={idx}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
