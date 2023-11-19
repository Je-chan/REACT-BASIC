# Reducer 와 Context 로 확장하기

## 1. reducer 와 context 결합하기

```jsx
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Day off in Kyoto</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];

// AddTask.js
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}

// TaskList.js
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

- Reducer 를 사용하면 이벤트 핸들러를 간결하고 명확하게 만들 수 있다
- 하지만, 위의 코드에서 봤을 때, reducer 의 데이터는 최상위 컴포넌트인 App.js 에서만 사용할 수 있다.
- 다른 컴포넌트들에서 tasks 의 리스트를 읽고 변경하려면 prop을 통해 현재 state 와 state 를 변경할 수 있는 이벤트 핸들러를 명시적으로 전달해야 한다.

```jsx
<TaskList
  tasks={tasks}
  onChangeTask={handleChangeTask}
  onDeleteTask={handleDeleteTask}
/>
```

- 이렇게 TaskList 에 state 와 이벤트 핸들러를 전달하고

```jsx
<Task
  task={task}
  onChange={onChangeTask}
  onDelete={onDeleteTask}
/>
```

- TaskList 컴포넌트에서 Task 컴포넌트로 이벤트 핸들러를 전달해야 한다
- 지금이야 depth 가 한 개지만 앱이 커지면 전달하는 것이 쉽지 않다.
- 이런 경우, Context 와 결합해서 편하게 사용할 수 있다.

### Step 1 : Cotext 생성하기

- useReducer 혹은 tasks 와 업데이트할 수 있는 dispatch 함수를 반환한다.

```jsx
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

- 트리를 통해 전달하려면, 두 개의 별개의 context 를 생성해야 한다.
	- TaskContext 는 현재 tasks 리스트를 제공한다
	- TasksDispatchContext 는 컴포넌트에서 action 을 dispatch 하는 함수를 제공한다
- 두 Context 는 나중에 다른 파일에서 가져올 수 잇도록 별도의 파일에서 내보낸다.

```jsx
// TasksContext.js

import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

- 두 개의 context 에 기본값을 null 로 전달하고 있다.

### Step 2 : State 와 dispatch 함수를 Context 에 넣기

- 이제 TaskApp 컴포넌트에서 두 Cotnext 를 모두 불러올 수 있다. useReducer 를 통해 반환된 tasks 와 dispatch 를 받고 아래 트리 전체에 전달한다.

```jsx
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  // ...
  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        ...
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
```

- 지금은 prosp 와 context 를 모두 이용해 정보를 전달하고 있다

### Step 3 : 트리 안에서 context 사용하기

- 이제 tasks 리스트나 이벤트 핸들러를 트리 아래에 전달할 필요가 없어졌다

```jsx
<TasksContext.Provider value={tasks}>
  <TasksDispatchContext.Provider value={dispatch}>
    <h1>Day off in Kyoto</h1>
    <AddTask />
    <TaskList />
  </TasksDispatchContext.Provider>
</TasksContext.Provider>
```

- 대신, TaskContext 를 활용해 task 리스트를 읽을 수 있다.

```jsx
export default function TaskList() {
  const tasks = useContext(TasksContext);
  // ...
```

- tasks 리스트를 업데이트 하기 위해서 컴포넌트에서  context 의 dispatch함수를 읽고 호출할 수 있다

```jsx
export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  // ...
  return (
    // ...
    <button onClick={() => {
      setText('');
      dispatch({
        type: 'added',
        id: nextId++,
        text: text,
      });
    }}>Add</button>
    // ...
```

- TaskBoard 컴포넌트는 자식 컴포넌트에, TaskList 는 Task 컴포넌트에 이벤트 핸들러를 전달하지 않고 필요한 데이터를 context 로 읽어올 수 있다.

## 3. 하나의 파일로 합치기

- reducer 와 context 를 모두 하나의 파일에 작성하면 컴포넌트들을 조금 더 정리할 수 있다.
- 현재의  TasksContext.js 는 두 개의 context 만을 선언하고 있다

```jsx
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

- 이제 Reducer 를 같은 파일로 옮기고 TasksProvider 컴포넌트를 새로 선언한다.

```jsx
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
```

- 이렇게 하면 TaskApp 컴포넌트에서 복잡하게 얽힌 부분을 깔끔하게 정리할 수 있다

```jsx
// App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}

// TasksContext.js
import { createContext, useReducer } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];

// AddTask.js
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Add</button>
    </>
  );
}

let nextId = 3;

// TaskList.js
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Delete
      </button>
    </label>
  );
}
```

- TasksContext.js 에서 context 를 사용하기 위한 use 함수들도 내보낼 수 있다

```jsx
export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
```

- 이렇게 만들어진 함수를 사용해 컴포넌트에서 context 를 읽을 수 있다

```jsx
const tasks = useTasks();
const dispatch = useTasksDispatch();
```

- 이렇게 하면 동작이 바뀌는 건 아니지만 다음 context 를 더 분리하거나 함수를 로직에 추가하기 쉬워진다. (즉 유지보수를 위한 것)
	- 여기서 useTasks, useTasksDispatch 와 같은 함수를 커스텀 hook 이라고 한다.