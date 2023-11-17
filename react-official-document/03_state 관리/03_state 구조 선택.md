# state 구조 선택

- state 를 잘 구조화하면 컴포넌트가 수정과 디버깅에 용이해진다.

## 1. state 구조화 원칙

- 컴포넌트를 작성할 때는 얼마나 많은 state 변수를 사용할지, 데이터 모양은 어떻게 해야할지를 선택해야 한다.

1. 관련 state 를 그룹화 한다.
	- 항상 두 개 이상의 state 변수를 동시에 업데이트한다면 하나의 state 로 합치는 것이 좋다
2. state 모순을 피하라
	- 여러 state 조각이 서 모순되거나 불일치할 방식으로 state 를 구성해서는 안 된다.
3. 불필요한 state 를 피하라
	- 렌더링 중에 컴포넌트의 props 나 기존 state 변수에서 일부 정보를 계산할 수 있다면 해당 정보를 해당 컴포넌트의 state 에 넣지 말아야 한다.
4. state 중복을 피하라
	- 동일 데이터가 여러 state 변수 간에 또는 중첩된 객체 내에 중복되면 동기화 state 를 유지하기 어렵다. 가능한 중복을 줄일 것
5. 깊게 중첩된 state 를 피하라
	- 깊게 계층화된 state 는 업데이트 하기 어렵다
	- 가능하면, state 를 평평하게 만들기 위해 노력해야 한다.

## 2. 관련 state 그룹화하기

- 단일 state 변수를 사용할지, 다중 state 변수로 사용할지 고민하는 경우가 있다.
- 두 개의 state 변수가 항상 함께 변경되는 경우에는 하나의 state 변수로 통합하는 것이 좋다
- 예를 들어서 좌표를 구할

```jsx
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

- 혹은

```jsx
const [position, setPosition] = useState({ x: 0, y: 0 });
```

- 위의 두 가지 방식 중에서 어떤 방식이 가장 적절할까?
	- 각 서비스마다 다르겠지만, 만약 위의 좌표가 마우스 이동을 추적하는 것이라고 한다면, x 와 y 축이 항상 같이 이동할테니 단일 state 로 관리하는 것이 좋고
	- 만약 방향키로 조작하는 거라고 하면, 하나의 입력에 x, y 중 하나의 좌표만 변경이 되므로 다중 state 로 관리하는 것이 좋다

## 3. state 모순 피하기

- 다음은 isSending 및 isSent state 변수가 있는 호텔 피드백 양식이다.

```jsx
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Thanks for feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

- 이 코드는 작동하지만 불가능한 state 설정을 허용한다
- setIsSent 와 setIsSending 중 하나를 호출하면 두 상태가 모두 true 가 되는 상황이 발생한다.
- 이것을 방지하기 위해서 차라리 모든 상황을 담는 state 를 생성하는 것이 좋다
	- 즉 status 라는 변수를 하나 만들고
	- 값으로 “typing”, “sending”, “sent” 이렇게 string 으로 상태를 관리하는 것이 좋다.
	- 이런 방식이 모순된 상태를 줄일 수 있는 적절한 방법이다.

## 4. 불필요한 state 를 피하라

- 렌더링 중에 컴포넌트의 props 나 기존 state 변수에서 일부 정보를 계산할 수 있는 해당 정보를 컴포넌트 state 에 넣지 말아야 한다.