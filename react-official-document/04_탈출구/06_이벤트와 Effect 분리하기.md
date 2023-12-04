# 이벤트와 Effect 분리하기

- 이벤트 핸들러는 같은 상호 작용을 다시 수행할 때만 다시 실행한다.
- 이벤트 핸들러와 달리, Effect 는 props 또는 state 변수와 같은 일부 값을 마지막 렌더링 때와 다른 값으로 읽게 되면 다시 동기화된다.

## 1. 이벤트 핸들러와 Effect 중 선택하기

### 1-1) 이벤트 핸들러는 특정 상호 작용에 대한 응답으로 실행된다.

- 사용자 관점에서 메시지를 보내는 것은 전송 버튼을 클릭했기 때문에 발생한다.
- 메시지나 다른 시간이나 다른 이유로 보내지면 안 된다.
- 이것이 메시지를 보내는 것이 이벤트 핸들러여야 하는 이유다.

### 1-2) Effect 는 동기화가 필요할 때마다 실행된다.

- 코드를 실행해야 하는 이유가 특정 상호 작용이 아닐 때.
- 예를 들어 컴포넌트는 채팅방에 연결된 상태로 유지해야 한다.
  - 이 코드의 경우, 특정 상호 작용이 아니다.
  - 채팅방 화면을 보고 상호작용 할 수 있어야 하기에 컴포넌트는 선택한 채팅 서버에 계속 연결돼 있어야 한다.
  - 이처럼 사용자가 어떤 상호작용도 수행하지 않았더라도 여전히 동기화 상태로 유지해야하는 것이 Effect 여야 하는 이유다

## 2. 반응형 값 및 반응형 로직

- 직관적으로 이벤트 핸들러는 버튼을 클릭하는 “수동”으로 촉발시킨다고 말할 수 있다.
- 반면, Effect 는 자동으로 동기화 상태를 유지하는 데 필요한 만큼 자주 다시 실행된다.
- 컴포넌트 본문 내부에 선언된 props, state, 변수는 모두 반응형 값이다.
- 하지만 이벤트 핸들러 내부의 로직은 반응형은 아니며, Effect 내부의 로직이 반응형이다.

### 2-1) 이벤트 핸들러 내부의 로직은 반응형이 아니다.

- 사용자의 고나점에서 봤을 때 message 가 변경되었다고 해서 메시지를 보낸다는 의미가 아니다.
- 입력중이라는 의미일 뿐
- 즉, 메시지를 전송하는 로직은 반응적이어서는 안된다
  - 이것이 이벤트 핸들러에 속하는 이유다

### 2-2) Effect 내부의 로직은 반응형이다.

- 사용자의 입장에서 보면, 채팅방 ID 가 변경됐다는 것은 다른 채팅방에 접속하겠다는 의미다.
- 즉 방에 연결하기 위한 로직은 반응형이어야 한다.
- Effect 는 반응형이기에 채팅방 ID 에 따라 connection 을 하는 로직은 Effect 내부로 들어가야 한다.

### 2-3) Effect 에서 비반응형 로직 추출하기

- 만약 Effect 내부에서 반응형 로직과 비반응형 로직을 같이 사용하려는 경우, 상황이 가다로워진다.

```jsx
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ All dependencies declared
  // ...
```

- 위에서 처럼 테마와 roomId 에 따라서 알림을 표시하는데, 이는 테마가 변경될 때마다 알림이 채팅방에 새로 연결되지 않았음에도 알림이 뜨는 상황이 발생한다.
  - 우리가 원하는 것은 채팅방이 변경됐을 때만 알림이 발생하는 것
- 이런 theme 과 같은 코드는 반응형이지만 비반응형 로직으로 간주해서 분리할 수 있어야 한다.

### 2-4) Effect Event 선언하기

- 이 비반응형 로직을 Effect 에서 추출하기 위해서는 useEffectEvent 라는 특수 Hooks 를 사용해야 한다.

```jsx
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

- 여기서 onConnected 는 Effect Event 라고 불리며 Effect 로직의 일부지만 이벤트 핸들러처럼 동작한다.
- 그 내부의 로직은 반응형으로 동작하지 않으며 항상 props 와 state 의 최신 값을 확인한다.
- 이제 Effect 내부에서 onConnected 라는 Effect Event 를 호출할 수 있다.

```jsx
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

- Effect Event 는 이벤트 핸들러와 유사해 보인다.
- 하지만 가장 큰 차이점이 존재하는데, 이벤트 핸들러는 사용자와의 상호작용에 의해서 응답하는 반면, Effect Event 는 Effect 에서 사용자가 촉발한다는 점이다.
