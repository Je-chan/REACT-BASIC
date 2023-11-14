# 스냅샷으로서의 state
## 1. state 를 설정하면 렌더링이 촉발된다

- state 를 설정하고 이 값을 업데이트 하면 React 의 리렌더링을 촉발한다.
- 즉, 인터페이스가 이벤트에 반응하려면 state 를 업데이트 해야 한

```jsx
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

- 위 코드에서 버튼을 클릭하면 아래의 플로우가 발생한다

1. onSubmit 이벤트 핸들러가 실행된다
2. setIsSent(true) 가 isSent 를 true 로 바꾸고, 새 렌더링을 큐에 대기시킨다
3. React 는 새로운 isSent 값에 따라 컴포넌트를 리렌더링한다

## 2. 렌더링은 그 시점의 스냅샷을 찍는다

- 렌더링이란 React 가 컴포넌트, 즉 함수를 호출한다는 것을 의미한다.
- 해당 함수에서 반환하는 JSX 는 시간상 UI 의 스냅샷과 같다
- prop, 이벤트 핸들러, 로컬 변수는 모두 렌더링 당시의 state 를 사용해 계산된다
- 그러므로 React 가 컴포넌트를 다시 렌더링할 때는
	1. React 가 함수를 다시 호출하고
	2. 함수가 변경된 JSX 스냅샷을 반환하고
	3. React 가 반환된 스냅샷과 일치하도록 화면을 업데이트 한다

- 컴포넌트 메모리로서 state 는 함수가 반환된 후 사라지는 일반 변수와 다르다
	- state는 실제로 함수 외부에 있는 것처럼 React 자체에 존재한다
	- React 가 컴포넌트를 호출하면 특정 렌더링에 대한 state 의 스냅샷을 제공한다
	- 컴포넌트는 해당 렌더링의 state 값을 사용해 계산도니 새로운 props 세트와 이벤트 핸들러가 포함된 UI 의 스냅샷을 JSX 에 반환한다

### 생각해볼 문제

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

- 그렇다면 이 컴포넌트에서 button 을 클릭하면, number 는 +3 이 된 값으로 업데이트될까?
- 이 number 는 클릭당 딱 +1 만큼만 증가한다

- state 를 설정하면 ***다음 렌더링* 에 대해서만 변경된다
	- 이 말은 첫 번째 렌더링에서 number 는 0 이었다.
	- 그럼 해당 렌더링의 onClick 핸들러에서 setNumber(number + 1) 이 호출된 이후에도 number 의 값은 여전히 0인 것
	- 이는 setNumber 세 개 모두 동일하다
	- 즉, 이 렌더링에서 이벤트 핸들러의 number 는 항상 값이 9이기 때문에 state 를 1로 세 번 설정한다.

---

## 3. 시간 경과에 따른 state

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

- 그렇다면 위 코드에서 alert 은 값을 얼마를 띄워줄까?
	- 가장 먼저 alert 으로 0을 띄워주고, 그 다음에 h1 태그에서 5를 화면에 보여준다

- 하지만 만약, setTimeOut 을 걸어준다면 어떻게 될까?

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

- 이렇게 하면 화면에서 5를 먼저 보여준 다음 3초 뒤에 0을 alert 으로 띄워준다
- 이는 React 에 저장된 state는 알림이 실행될 때 변경됐을 수 있지만, 사용자가 상호작용한 시점에서 state 스냅샷을 사용하도록 된 것
	- (이건 사실 어찌 보면 당연한 것이, javaScript 는 렉시컬 스코프이며 넘겨 받은 인자의 값이 변화하는지를 추적하지 않기 때문 - Liebe 개인 필기)
- state 변수의 값은 이벤트 핸들러의 코드가 비동기적이라도 렌더링 내에서 절대 변경되지 않는다. 해당 렌더링의 onClick 내에서 setNumber(number + 5) 코드가 호출된 이후에도 number 의 값은 계속 0이기 때문.