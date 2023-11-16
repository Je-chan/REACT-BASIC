# 여러 state 업데이트를 큐에 담기

## 1. state 업데이트 일괄 처리

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

- 이전 챕터에서 이 코드에서 onClick 의 결과로 h1 에 보여질 number 값은 +1 된 값임을 확인했다.
- 여기에서 한 가지 더 논의 될 사항이 존재한다

### React 는 state 업데이트를 하기 전에 이벤트 핸들러의 모든 코드가 실행될 때까지 기다린다

- 이 원칙에 의거해 리렌더링은 모든 setNumber() 호출이 완료된 이후에나 일어난다.
- 이렇게 하면 너무 많은 리렌더링을 촉발하지 않고 여러 컴포넌트에서 나온 다수의 state 변수를 업데이트할 수 있다.
- 하지만, 이 방법은 이벤트 핸들러와 그 안의 코드가 완료될 때까지 UI 가 업데이트 되지 않음을 의미한다.
- 이를 일괄처리 (Batching) 이라고 하는데, 이 방법은 React 앱을 더 빠르게 실행할 수 있도록 한다.
- 단, React 는 여러 의도적인 이벤트에 대해서는 일괄처리 하지 않는다.
	- 즉 사용자가, 클릭을 두 번 했다면 각 클릭 한 번 당, Batching 이 이뤄진다.
	- 키보드를 타이핑 여러번 타이핑 했다 하더라도 키보드 한 번 누른 것에 대해서만 Batching 이 이뤄진다.

---

## 2. 다음 렌더링 전에 동일한 State 변수를 여러 번 업데이트하기

- 흔한 사례는 아니지만, 만약 다음 렌더링 전에 동일한 state 변수를 여러 번 업데이트하고 싶다면, 다음 state 값을 전달하는 대신, setStaete((n) ⇒ n+1) 처럼, 큐의 이전 state 를 기반으로 다음 state 를 계산하는 함수를 전달할 수 있다
	- setState 안의 함수가 인자로 받는 값은, state 를 업데이트할 때, 큐에서 이전 작업으로 바뀐 state 값을 의미한다
- 이는 단순히 state 값을 대체하는 것이 아니라 state 값을 활용해 무엇인 가를 하라고 지시하는 것이다.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1); {/* (0 + 1) */}
        setNumber(number => number + 1); {/* (1 => 1 + 1) */}
        setNumber(number => number + 1); {/* (2 => 2 + 1) */}
      }}>+3</button>
    </>
  )
}
```

- 그렇게 하면 이 코드에서는 주석에 달린 것처럼 동작하여, 결국 우리가 원하는 3 이라는 3이라는 값을 얻게 된다.
- 이 이벤트 핸들러가 React 에 지시하는 작업은 다음과 같다

1. 첫 번째 setNumber(number ⇒ number + 1)
	- 여기에서 number 는 0 이므로, React 는 큐에 <number + 1 값으로 교체하기> 를 추가한다
2. 두 번째 setNumber(number ⇒ number + 1)
	- 여기에서는 number ⇒ number + 1 이라는 함수를 큐에 추가한다
3. 세 번째 setNumber(number ⇒ number  + 1)
	- 이것도 마찬가지로 number ⇒ number + 1 이라는 함수를 큐에 추가한다

- 이렇게 하면 다음 렌더링 동안에 React 는 state 큐를 순회할 때 다음의 내용을 확인한다

| Queue 에 업데이트 된 내용 | number 값 | returns |
| --- | --- | --- |
| number + 1 값으로 교체하기 | 0 | 1 |
| number ⇒ number + 1 | 1 | 1 + 1 = 2 |
| number ⇒ number + 1 | 2 | 2 + 1 = 3 |
- 이후, 최종으로 결정된 값 3을 저장하고 useState 에서 반환한다.

---

## 3. 업데이트 후 state 를 바꾸면 어떻게 될까?

```jsx
<button onClick={() => {
  setNumber(number + 5);
  setNumber(number => number + 1);
  setNumber(42);
}}>
```

- 이런 경우, 어떻게 될까?
- 이 코드의 동작은 다음과 같다

| Queue 에 업데이트 된 내용 | number 값 | returns |
| --- | --- | --- |
| number + 5 값으로 교체하기 | 0 | 5 |
| number ⇒ number + 1 | 5 | 5 + 1 = 6 |
| 42 값으로 교체하기 | 42 | 42 |

### setState 의 결론

1. setState 안에 함수를 넣으면 함수가 큐에 추가된다.
	- 이때, 인자는 큐에서 먼저 실행된 값이다
2. setState 안에 값을 넣으면 <해당 값으로 대체하기> 가 큐에 추가된다.

- 이후, 이벤트 핸들러가 완료되면 React 는 리렌더링한다.
- 리렌더링하는 동안에 React 는 큐를 처리한다.
- 업데이터 함수는 렌더링 중에 실행되므로, 업데이터 함수는 순수해야 하며 결과만 반환해야 한다.
- 업데이터 함수 내부에서 state 를 변경하거나 다른 사이드 이펙트를 실행하려고 하면 안 된다