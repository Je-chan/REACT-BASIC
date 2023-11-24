# useCallback

## 1. 참조

```jsx
useCallback(fn, dependencies)
```

### 매개변수

1. fn
	- 캐시하려는 함수
	- 어떤 인자도 받을 수 있고, 어떤 값이라도 반환할 수 있다.
	- React 는 초기 렌더링을 하는 동안 함수를 반환한다. 이후 dependencies 가 변경되지 않았다면 동일한 함수를 다시 제공한다
		- React 는 해당 함수를 호출하지 않고 반환하기 때문에 호출 시기와 여부를 결정할 수 있다.
2. dependencies
	- fn 코드 내에 참조된 모든 반응형 값의 배열
	- 반응형 값에는 props, state, 컴포넌트 본문 내에 직접 선언한 모든 변수 및 함수가 포함된다.


### 반환값

- 초기 렌더링에서 useCallback 은 전달한 fn 함수를 반환한다.
- 렌더링 중에는 마지막 렌더링에서 이미 저장된 fn함수를 반환하거나 렌더링 중에 전달했던 fn 함수를 반환한다.

---

## 2. 컴포넌트 리렌더링 건너뛰기

- 렌더링 성능을 최적화할 때, 자식 컴포넌트에 함수를 캐시해야 할 때가 있다.

```jsx
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

- 컴포넌트의 리렌더링 사이에 함수를 캐시하고 싶다면 함수의 정의를 useCallback 훅으로 감싼다.
- useCallback 을 사용하려면 리렌더링 사이에 캐시할 함수와 의존성 배열을 전달해야 한다.
- 기본적으로 컴포넌트가 리렌더링되면 React 는 모든 자식을 재귀적으로 리렌더링한다.
	- 이는 ProductPage 가 다른 theme 으로 리렌더링될 때 ShippingForm 자식 컴포넌트도 리렌더링됨을 의미한다.
	- 리렌더링하는데 많은 계산이 필요하지 않은 컴포넌트라면 괜찮다
	- 하지만, 리렌더링이 느리다는 것을 확인했다면 props 가 지난 렌더링과 동일한 경우 memo 로 감싸서 리렌더링을 건너뛰도록 지시할 수 있다.

```jsx
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

- 이렇게 작성함으로써 모든 props 가 마지막 렌더링과 동일한 경우 리렌더링을 건너뛴다. 이럴 때 함수의 캐싱이 중요해진다.
- javaScript 에서 함수는 늘 항상 다른 함수를 생성한다. 그렇기에 같은 기능을 하는 함수더라도 memo 최적화가 이뤄지지 않는다.
- 이럴 때 useCallback 을 활용해서 해당 문제를 해결한다.

### useCallback 을 모든 함수에 적용해야할까?

- 인터랙션이 별로 없는 앱의 경우 일반적으로 메모화는 필요하지 않다.
- 아래의 사례에만 useCallback 을 활용해도 충분하다.

1. memo 로 감싼 컴포넌트의 props 로 함수를 넘길 때
	- 값이 변경되지 않았다면 렌더링을 건너뛰고 싶을 것.
	- 메모화를 사용하면 의존성이 변경된 경우에만 컴포넌트를 리렌더링할 수 있다.
2. 함수를 다른 일반 훅의 의존성으로 사용할 때
	- 간혹 useEffect 에서 해당 함수를 의존할 수 있다.

- 다른 경우 함수를 useCallback 으로 감쌌을 때 이득이 없다.
- 아래의 사례에서는 useCallback 이 불필요할 수 있다.

---

### 3. useCallback 안에서 state 업데이트

- 때로는 메모된 콜백 이전 state 를 기반으로 state 를 업데이트해야할 수 있다.

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

- 일반적으로 메모화된 함수는 의존성을 최대한 적게 갖기를 원할 것이다. 다음 state 를 계산하기 위해 일부 state 만 읽어야 하는 경우라면 상태 업데이트 함수를 전달해 해당 의존성을 제거할 수 있다.

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); 
```

- 이렇게 코드를 작성하면, 의존성으로 todos 를 없앨 수 있다.

---

### 4. Effect 가 너무 자주 발동되지 않도록 하기

- Effect 내부에서 함수를 호출하고 싶은 경우가 종종 있다.

```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

- 모든 반응형 값은 Effect 의 의존성으로 선언해야 한다. 하지만, createOptions 를 의존성으로 선언하면 Effect 가 채팅방에 계속 재연결하게 된다

```jsx
useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 문제: 이 의존성은 렌더링시마다 변경됨
```

- 이 문제를 해결하려면 Effect 에서 호출해야 하는 함수를 useCallback 으로 감싸면 된다.

```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState(''); 

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ roomId 변경시에만 변경됨

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ createOptions 변경시에만 변경됨

```

- 이렇게 하면 roomId 가 동일한 경우 리렌더링 사이에 createOptions 함수가 동일하게 적용된다. 하지만 함수 의존성을 없애는 편이 훨씬 더 좋다. 그냥 useCallback 내부에 함수를 옮기는 것도 방법이다

```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ useCallback이나 함수에 대한 의존성이 필요하지 않음!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ roomId 변경시에만 변경됨

```

- 하지만 위의 경우라면, useEffect 의 코드 가독성이 매우 떨어지고 사이드 이펙트를 다룬다는 역할을 알아보기가 어렵다. (개인 의견)
	- 각자의 방식이 있는 것이므로 알아서 잘 설정하면 될 것 같다.