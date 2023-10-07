import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { todoListState } from "../todoAtoms";

function TodoItem({ item }) {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const targetIdx = todoList.findIndex((listItem) => listItem === item);
  const editItemText = ({ target: { value } }) => {
    const newList = replaceItemAtIndex(todoList, targetIdx, {
      ...item,
      text: value,
    });
    setTodoList(newList);
  };
  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
    </div>
  );
}

export default TodoItem;

const replaceItemAtIndex = (arr, idx, newValue) => {
  return [...arr.slice(0, idx), newValue, ...arr.slice(idx + 1)];
};
