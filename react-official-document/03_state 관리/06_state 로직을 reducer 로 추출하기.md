# state 로직을 Reducer 로 추출하기

## 1. reducer 로 state 로직 통합하기

```jsx
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

- 컴포넌트가 복잡해지면 컴포넌트의 state 가 업데이트되는 다양한 경우를 한 눈에 파악하기 어려워질 수 있다.
- 각 이벤트 핸들러는 state 를 업데이트하기 위해 업데이트 함수를 호출할 것이고, 컴포넌트가 커질수록 여기저기 흩어져 있는 state 로직의 양도 늘어난다
	- 복잡성을 줄이고 모든 로직을 쉽게 한 곳으로 모으기 위해서는 하나의 단일 함수로 모으는 것이 좋을 수 있다.
- 이렇게 복잡한 state 로직을 컴포넌트 외부의 reducer 라는 단일 함수로 옮길 수 있다

- Reducer 는 state 를 관리하는 다른 방법이다. useState 에서 useReducer 로 마이그레이션 하는 방법은 3단계로 이뤄진다.

> 1. state 를 설정하는 것에서 action들을 전달하는 것으로 변경하기
2. reducer 함수 작성하기
3. 컴포넌트에서 reducer 사용하기
>

### Step 1 : state 설정을 action 들의 전달로 바꾸기

```jsx
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

- 모든 state 설정 로직을 제거하니 세 개의 이벤트 핸들러만 남는다.
- reducer 를 사용한 state 관리는 state 를 직접 설정하는 것과 약간 다르다
	- state 를 설정해 React 에게 무엇을 할지 지시하는 것이 아니다.
	- 이벤트 핸들러에서 action 을 전달해 사용자가 방금 한 일을 지정한다
	- state 업데이트 로직은 다른 곳에 있다. 즉, 이벤트 핸들러를 통해 tasks 를 설정하는 대신, task 를 추가/변경/삭제 하는 action 을 전달하는 것
- 이 느낌을 명시화하기 위해 setTasks 라는 함수명보다는 dispatch 를 사용한다

```jsx
**function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: 'changed',
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}**
```

- 그리고 이 dispatch 함수에 넣어준 객체를 action 이라고 한다.
- 이 객체는 일반적인 JavaScript 객체다.
	- 여기에 무엇을 넣을지는 우리가 결정하지만, 일반적으로 무슨 이벤트가 발생했는지에 최소한의 정보를 포함해야 한다.

### Step 2 : reducer 함수 작성하기

- reducer 함수에 state 로직을 둘 수 있다.
- 이 함수는 두 개의 매개 변수를 갖는데, 하나는 현재의 state, 다른 하나는 action 객체다. 그리고 이 함수가 다음 state 를 반환한다.
- React 는 reducer 로부터 반환된 것을 state 로 설정한다.
- state를 설정하는 로직을 이벤트 핸들러에서 reducer 함수로 옮기기 위해서는 다음의 절차를 거쳐야 한다.

1. 현재의 state 를 첫 번째 매개변수로 선언
2. action 객체를 두 번째 매개변수로 선언
3. 다음 state 를 reducer 함수에서 반환  (React 가 알아서 reducer 에서 반환된 값을 state 로 설정한다)

```jsx
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

- reducer 함수는 state 를 매개변수로 갖기 때문에 컴포넌트 밖에서 reducer 를 선언할 수 있다.

### Step 3 : 컴포넌트에서 reducer 사용하기

- 마지막으로 컴포넌트에 taskReducer 를 연결해야 한다.

```jsx
import { useReducer } from 'react';
```

- 그런 다음 useState 대신에 useReducer 로 바꿔준다.

```jsx
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

- useReducer Hook 은 useState 와 비슷하다.
	- 초기 state 값을 전달해야 하고, 그 결과 state 값과 state 설정자 함수를 반환한다.
- 다른 점은
	1. useReducer 는 두 개의 인자 (reducer 함수, 초기 state)를 받는다
	2. useReducer 는 반환된 튜플의 두 번째 요소로 상태 업데이트 함수가 아닌 dispatch  함수를 반환한다.

```jsx
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

- 이 코드에서 원한다면 reducer 파일을 분리할 수 있다.
	- 이 방식으로 하면 관심사가 분리되어 컴포넌트 로직을 더 쉽게 읽을 수 있다.

## 2.  useState 와 useReducer 비교하기

### 코드 크기

- 일반적으로 useState 를 작성하면 보일러 플레이트 코드가 줄어든다.
- useReducer 를 작성하면 reducer 함수, action 을 전달하는 부분을 모두 작성해야 한다

### 가독성

- useState 로 간단하게 state 를 업데이트하는 경우, 가독성이 좋다
	- 하지만,  state 구조가 복잡해지면 가독성을 해친다
- useReducer 를 사용하면 업데이트 로직이 어떻게 동작하는지와 이벤트 핸들러를 통해 무엇이 일어났는지를 깔끔하게 분리할 수 있다.

### 디버깅

- useState 에 버그가 발생했다면 state 가 어디서 잘못 설정됐는지, 왜 그런 에러가 났는지 알기 어려울 수 있다.
- useReducer 를 사용하면 reducer 함수에 콘솔 로그를 추가해서 state 업데이트와 어떤 action 으로 인해 버그가 발생했는지 확인할 수 있다.

### 개인 취향

- 각 사람마다 취향이 다를 뿐
- (취존하자)

## 3. reducer 잘 사용하기

- reducer 를 잘 사용하기 위한 두 가지 팁

### (1) reducer 는 반드시 순수할 것

- state 설정 함수와 비슷하게 reducer 는 렌더링 중에 실행된다
	- action 은 다음 렌더링까지 대기한다.
- reducer 는 반드시 순수해야 한다
	- 이는 입력 값이 같다면 결과 값도 같아야 한다.
	- 요청을 보내거나 timeout 스케쥴링 하는 등의 사이드 이펙트를 수행하면 안 된다.
- reducer 는 객체 및 배열을 변이 없이 업데이트 해야 한다.

### (2) 각 action 은 여러 데이터가 변경돼도 하나의 사용자 상호작용을 설명해야 한다.

- action 의 행위를 명확하게 표현하는 것이 차후 디버깅을 할 대 편하다