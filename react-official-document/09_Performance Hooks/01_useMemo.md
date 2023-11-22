# useMemo

- useMemo 는 리렌더링 사이의 계산 결과를 캐시할 수 있는 React 훅이다.

## 1. 참조

```jsx
useMemo(calculateValue, dependencies)
```

### 매개변수

1. calculateValue
	- 캐시하려는 값을 계산하는 함수
	- 이 함수는 순수함수여야 한다.
	- 인자를 받지 않고, 어떤 타입이든 반드시 값을 반환해야 한다.
	- React 초기 렌더링에 함수를 호출한다.
	- 리렌더링 때부터는 dependencies 가 이전 렌더링 이후에 변경되지 않으면 캐시된 동일한 값을 반환한다.
	- 만약 dependencies 가 변경되면 calculateValue 를 호출하고 결과를 반환해 다시 캐시한다
2. dependencies
	- calculateValue 코드 내에서 참조되는 모든 반응형 값들의 목록이다.
	- 반응형 값에는 props, state 및 컴포넌트 몸체 내부에서 선언된 모든 변수와 함수가 포함된다.

### 반환값

- 초기 렌더링에서 useMemo 는 인자 없이 calculateValue 를 호출한 결과를 반환한다
- 이후 렌더링에서는 의존성이 변경되지 않은 경우에는 마지막 렌더링에서 저장된 값을 반환한다.
- 변경된 경우에는 calcuateValue 를 다시 호출해 그 결과를 반환한다

### 주의사항

- useMemo 는 훅이므로 컴포넌트 최상위 레벨 또는 커스텀 훅에서만 호출할 수 있다.
- React 는 특별한 이유가 있지 않은 이상 캐시된 값을 유지하려 한다
	- React 는 개발 중에 컴포넌트 파일을 수정하면 캐시된 값을 폐끼한다
	- 개발 환경, 사용 환경 모두 초기 렌더링 중에 컴포넌트가 일시 중단(Suspend) 되면 React 는 캐시를 폐기한다

---

## 2. 비용이 많이 드는 재계산 생략하기

- 기본적으로 React 는 컴포넌트가 리렌더링될 때 컴포넌트를 다시 호출한다.

```jsx
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

- 만약 state 가 업데이트 되거나 새로운 props 를 받은 경우, filterTodos 라는 함수가 다시 호출된다
- 대부분의 계산은 매우 빠르기에 문제가 되지 않지만

1. 요소가 매우 많은 배열을 필터링, 변환 하는 경우
2. 고비용의 계산을 수행하는 경우

- 위 두 경우를 수행할 때 데이터가 변경되지 않았다면 다시 계산하고 싶을 수 있다.
- todos 와 tab 이 이전렌더링 때와 동일하면 useMemo 로 값을 감싸서 예전에 이미 계산해 놓은 visibleTodos 를 재활용할 수 있다.

### 비용이 많이 드는 계싼인지 어떻게 알 수 있는가?

- 일반적으로 수천개의 객체를 만들거나 반복하는 경우가 아니라면 비용이 많이 들진 않는다.
	- console.time 과 console.timeEnd 를 한 번 써볼 것
- Chrome 으로 CPU 쓰로틀링 옵션을 활용해 속도를 낮추어 성능테스트하면 더 좋다

### 모든 곳에 useMemo 를 추가하면?

- 인터랙션이 거의 없는 앱의 경우, 메모화가 그리 필요하지 않다. 하지만 인터랙션이 많은 작업에 있어서는 메모화가 유용할 수 있다.
- 다음 아래의 경우에 useMemo 는 유용할 수 있다

1. useMemo 에 넣는 계산이 눈에 띄게 느리고 의존성이 거의 변하지 않는 경우
2. memo 로 감싼 컴포넌트에 prop 으로 전달한 경우
	- 값이 변경되지 않았을 때 리렌더링을 건너뛰고 싶을 수 있다.
3. 나중에 어떤 훅의 의존성으로 사용할 경우
	- 또 다른 useMemo 혹은 useEffect 에서 값을 의존하게 할 경우

- 하지만 다음의 요구사항을 잘 따라하면 메모화는 불필요할 수 있다.

1. 컴포넌트가 다른 컴포넌트를 시각적으로 감쌀 때 JSX 를 자식으로 받아들이게 할 것
	- 이렇게 하면 wrapper 컴포넌트 자체가 state 를 업데이트 할 때 React 는 그 자식 컴포넌트가 리렌더링할 필요가 없다는 것을 알게 된다
2. 로컬 state 를 선호하고 필요 이상으로 state 를 끌어올리지 말 것
3. 렌더링 로직을 순수하게 유지할 것
4. state 를 업데이트하는 불필요한 Effect 를 피할 것
	- React 앱의 대부분 성능 문제는 컴포넌트를 반복해서 렌더링하게 만드는 Effect 에서 발생하는 업데이트 체인으로 인해 생겨난다
5. Effect 에서 불필요한 의존성을 제거할 것
	- 메모화 대신 일부 객체나 함수를 Effect 내부나 컴포넌트 외부로 이동하는 것이 더 간단할 때가 많다.

---

## 3. 컴포넌트의 리렌더링 건너뛰기

- 어떤 경우 useMemo 를 사용해 자식 컴포넌트의 리렌더링 성능을 최적화할 수 있다.

```jsx
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

- theme prop 을 전환하면 앱이 잠시동안 멈추지만, JSX <List /> 컴포넌트를 제거하면 빠르게 동작한다.
- 기본적으로 컴포넌트가 리렌더링되면 React 는 모든 자식 컴포넌트를 재귀적으로 리렌더링한다.
	- 이 때문에 다른 theme 값으로 TodoList 가 리렌더링 되면 List 컴포넌트도 리렌더링 된다.
	- 이는 리렌더링에 많은 계산이 필요하지 않은 컴포넌트의 경우에는 괜찮다
	- 하지만 리렌더링이 느리다면 이전 렌더링과 동일한 prop 이 있는 경우 List 가 리렌더링을 건너뛰도록 memo 로 감싸줄 수 있다.

		```jsx
		import { memo } from 'react';
		
		const List = memo(function List({ items }) {
			// ...
		});
		```

- 이렇게 변경되면 List 는 모든 prop 이 이전 렌더링과 동일한 경우 리렌더링을 건너뛴다. 이는 캐싱 계산이 중요해지는 부분이다.

```jsx
export default function TodoList({ todos, tab, theme }) {
  // theme 이 변경될 때마다 매번 다른 배열이 된다
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... List의 prop은 절대로 같을 수 없으므로, 매번 리렌더링된다 */}
      <List items={visibleTodos} />
    </div>
  );
}
```

- 위 예제에서 filterTodos 함수는 항상 다른 배열을 생성한다.
- 이런 경우라면 memo 최적화도 제대로 작동하지 않는다. 결국 다른 props 를 받았기 때문

```jsx
export default function TodoList({ todos, tab, theme }) {
  // 계산 결과를 캐싱한다
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // 의존성이 변경되지 않는다면
  );
  return (
    <div className={theme}>
      {/* ...List는 같은 props를 전달받게 되어 리렌더링을 건너뛴다 */}
      <List items={visibleTodos} />
    </div>
  );
}
```

- visibleTodos 계산을 useMemo 로 감싸면, 리렌더링 사이에 동일한 값을 보장한다.
- 특별한 이유가 없다면 계산을 useMemo 로 감싸지 않아도 된다.

---

## 4. 다른 훅의 의존성 메모화

```jsx

function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); //  🚩 주의: 컴포넌트 내부에서 생성한 객체 의존성
  // ...
```

- 객체를 의존하는 것은 메모화의 취지에 어긋난다
- 컴포넌트가 다시 렌더링되면 컴포넌트 본문 내부의 모든 코드가 다시 실행되고, 객체를 생성하는 코드도 리렌더링할 때마다 다시 실행된다.
	- 때문에 의존성에 들어간 객체가 변하지 않았더라도 매번 재실행된다.
- 이 문제를 해결하기 위해서는 객체 자체를 메모화하면 된다.

```jsx
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); //  ✅ text 변경시에만 변경됨

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); 
```

---

## 5. 함수 메모화

- 컴포넌트가 memo 로 감싸여 있을 때 함수를 prop 으로 전달하려고 한다.

```jsx
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

- 함수 선언과 표현식은 모두 리렌더링할 때마다 다른 함수를 생성한다.
- 자식 컴포넌트를 memo 로 감쌌고, props 로 함수를 넘겨주고 있다면 함수는 항상 다시 생성되기 때문에 메모화의 취지에서 어긋난ㄷ. 이를 방지하기 위해서 memo 로 감싼다.

```jsx
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

- 그런데 함수의 경우, 이런 일이 흔하기 때문에 React 는 위의 중첩 함수를 없애기 위해서 추가로 useCallback 이라는 Hook 을 지원한다