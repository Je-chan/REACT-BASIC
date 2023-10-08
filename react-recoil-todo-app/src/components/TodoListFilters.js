import React from "react";
import { useRecoilState } from "recoil";
import { todoListFilterState } from "../todoAtoms";

function TodoListFilters(props) {
  const [filter, setFilter] = useRecoilState(todoListFilterState);

  const updateFilter = ({ target: { value } }) => {
    setFilter(value);
  };

  return (
    <div>
      Filters : &nbsp;
      <select value={filter} onChange={updateFilter}>
        <option value={"all"}>All</option>
        <option value={"completed"}>Completed</option>
        <option value={"uncompleted"}>Uncompleted</option>
      </select>
    </div>
  );
}

export default TodoListFilters;
