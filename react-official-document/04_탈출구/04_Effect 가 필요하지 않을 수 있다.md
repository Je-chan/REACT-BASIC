# Effect 가 필요하지 않을 수 있다.

- Effect 는 React 패러다임에서 벗어날 수 있는 탈출구다.
- Effect 를 사용하면 React 의 외부로 나가서 컴포넌트를 React 가 아닌 위젯, 네트워크 또는 브라우저 DOM 과 같은 외부 시스템과 동기화할 수 있다.
- 불필요한 Effect 를 제거하면 코드를 더 쉽게 다라갈 수 있고, 실행속도도 빨라지고 오류 발생 가능성도 줄어든다.

## 1. Effect 가 필요하지 않는 경우

- Effect 가 필요하지 않는 경우는 크게 두 가지다.

### 렌더링을 위해 데이터를 변환하는 경우

- List 를 표시하기 전에 필터링을 하고 싶다고 가정해보자.
- 그러면 목록이 변경될 때 state 변수를 업데이트하는 Effect 를 작성하고 싶겠지만 이는 비효율적이다.
- 컴포넌트의 state 를 업데이트할 때 React 는 먼저 컴포넌트 함수를 호출에 화면에 표시될 내용을 계산한다. 그리고 commit 으로 DOM 화면을 업데이트하고 Effect 를 실행한다. Effect 역시 state 를 즉시 업데이트 하면 이로 인한 프로세스가 다시 시작된다.

### 사용자 이벤트를 처리하는 경우

- 사용자가 제품을 구매할 때 POST 요청을 전송하고 알림을 표시하고 싶다고 가정해보자.
- 구매 버튼 클릭 이벤트 핸들러에서는 정확히 어떤 일이 발생했는지 알 수 있지만, Effect 는 사용자가 무엇을 했는지 알 수 없다. 그렇기에 일반적으로 사용자 이벤트를 해당 이벤트 핸들러에서 처리해야 한다.

## 2. props 또는 state 에 따라 state 업데이트 하기

```jsx
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 이러지 마세요: 중복 state 및 불필요한 Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

- 위의 방식은 필요 이상으로 복잡하고 비효율적이다.
- 전체 렌더링 과정에서 fullName 에 대한 오래된 값을 사용한 다음, 즉시 업데이트 된 값으로 렌더링한다.
- state 와 Effect 를 모두 지워도 계산된다

```jsx
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

## 3. 고비용 계산 캐싱하기

- 아래 컴포넌트는 props 로 받은 todos 를 filter prop 에 따라 필터링하여 visibleTodos 를 계산한다.
- 이 결과를 state 변수에 저장하고 Effect 에서 업데이트하고 싶을 수 있다.

```jsx
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

- 이것 마찬가지로 불필요하고 비효율적인 방식이다.

```jsx
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

- 만약, getFilterTodos 가 느린 연산이 아니라면 위의 방식도 좋다
- 하지만, 만약 연산이 느리거나 todos 의 요소가 매우 많은 경우, newTodo 와 같이 관련 없는 state 가 변경되더라도 getFilterdTodos 를 다시 계산하고 싶지 않을 수 있다.
  - 이런 경우에는 useMemo 를 사용하면 된다.

```jsx
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

- 위의 코드대로 하면 todos 나 filter 가 변경되지 않을 경우 getFilteredTodos 를 다시 연산하지 않는다.

## 4. prop 이 변경되면 모든 state 재설정하기

- prop 으로 넘겨받은 userId 의 값이 바뀔 때마다 comment state 변수를 리셋하고 싶다고 가정했을 때

```jsx
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

- 이렇게 만들면 ProfilePage 와 그 자식들이 먼저 오래된 값으로 렌더링한 다음 새로운 값으로 다시 렌더링하기에 비효율적이다
- ProfilePage 내부에 어떤 state 가 있는 모든 컴포넌트에 이 작업을 수행하기에 매우 복잡하다. 만약, 댓글 UI 가 중첩되어 있는 경우, 중첩된 하위 state 들도 모두 지워야 할 것이다.
- 그 대신 명시적인 key 를 전달함으로써 각 사용자의 프로필이 개념적으로 다른 프로필임을 React 에 알릴 수 있다. 컴포넌트를 둘로 나누고 바깥쪽 컴포너트에서 안쪽 컴포넌트로 key 속성을 전달하면 된다

```jsx
export default function ProfilePage({ userId }) {
  return <Profile userId={userId} key={userId} />;
}

function Profile({ userId }) {
  const [comment, setComment] = useState('');
  // ...
}
```

- 일반적으로 React 는 같은 컴포넌트가 같은 위치에서 렌더링될 때 state 를 유지한다.
- userId 를 key 로 Profile 에게 넘겨준다는 것은 곧, userId 가 두 Profile 컴포넌트를 state 를 공유하지 않는 별개의 컴포넌트로 취급하도록 React 에게 알리는 것이다.

## 5. prop 이 변경되면 일부 state 조정하기

```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

- List 컴포넌트는 items 목록을 prop 으로 받고, selection state 변수에 선택된 항목을 유지한다.
- items prop 이 다른 배열을 받을 때마다 selection을 null 로 재설정하고 싶다면 위의 방법은 이상적이지 않다.
- Effect 를 삭제하고 렌더링 중에 직접 state 를 조정하는 것이 좋다.

```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  const [prevItems, setPrevItems] = useState(items);

  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

- 이렇게 이전 렌더링의 정보를 저장하여 state 의 업데이트를 감시하는 것이 Effect 에서 동일한 state 를 업데이트하는 것보다 낫다.
- 렌더링 도중 컴포넌트를 업데이트하면, React 는 반환된 JSX 버리고 즉시 렌더링을 다시 시도한다. React 는 계단식으로 전파되는 느린 재시도를 피하기 위해서 렌더링 중에 동일한 컴포넌트의 state 만 업데이트하도록 허용한다
- 렌더링 도중 다른 컴포넌트의 state 를 업데이트하면 오류가 발생하낟.
- 동일 컴포넌트가 무한으로 리렌더링을 반복시도하는 상황을 피하기 위해서 `items !== prevItems` 조건을 사용하는 것
- 이런 식으로 state 를 조정할 수 있지만 다른 사이드 이펙트는 이벤트 핸들러나 Effect 에서만 처리하여 컴포넌트의 순수성을 유지해야 한다.
- 이 패턴은 Effect 보다 효율적이지만 대부분의 컴포넌트에 필요하지 않다. 어떻게 하든 prop 이나 다른 state 를 바탕으로 state 를 조정하면 데이터 흐름을 이해하고 디버깅하기 어ㅕ려워질 것.
- 그러므로 항상 key 로 모든 state 를 재설정하거나 렌더링 중에 모두 계산할 수 있는지를 확인하는 것이 좋다. 예를 들어 선택한 item 을 저장하는 대신에 선택한 item 의 ID 를 저장할 수 있다.

```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const selection = items.find((item) => item.id === selectedId) ?? null;
  // ...
}
```

- 이렇게 하면 state 를 조정할 필요가 전혀 없다. 선택한 ID를 가진 항목이 목록에 있으면 선택된 state 로 유지된다. 그렇지 않은 경우 렌더링 중에 계산된 selection 항목은 일치하는 항목을 찾지 못하기에 null 이 된다.
- 이 방식은 items 에 대한 대부분의 변경과 무관하게 selection 항목은 그대로 유지되기에 대체로 더 나은 방법이 된다.

## 6. 이벤트 핸들러 간 로직 공유

- 해당 제품을 구매할 수 있는 두개의 버튼이 있는 제품 페이지가 있다고 하자. 사용자가 제품을 장바구니에 넣을 때마다 알림을 표시하고 싶을 때, 두 버튼 클릭 핸들러에 showNotification() 을 호출하는 것은 반복적으로 느껴지므로 이 로직을 Effect 에 추가하고 싶을 수 있다.

```jsx
function ProductPage({ product, addToCart }) {
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

- 이 Effect 는 불필요하며 또 버그를 발생시킬 가능성이 있다
- 예를 들어 페이지가 새로고침될 때마다 앱이 장바구니를 기억하는 경우, 카트에 제품을 한 번 추가하고 페이지를 새로 고침하면 알림이 다시 표시된다.
- 어떤 코드가 Effect 에 있어야 하는지 이벤트 핸들러에 있어야 하는지 확실치 않은 경우, 이 코드가 실행돼야할 이유를 생각해봐야 한다.

### 컴포넌트가 사용자에게 표시되었기에 실행되어야 하는 코드에만 Effect 를 사용하는 것이 좋다

```jsx
function ProductPage({ product, addToCart }) {
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

## 7. POST 요청 보내기

- 어떤 로직을 이벤트 핸들러에 넣을지, Effect 에 넣을지 선택할 때 사용자의 관점에서 어떤 종류의 로직인지에 대한 답을 찾아야 한다.
- 이 로직이 특정 상호작용으로 인해 발생하는 것이라면 이벤트 핸들러에 넣어야 한다.
- 사용자가 화면에서 컴포넌트를 보는 것이 원인이라면 Effect 에 넣어야 한다.

## 8. 연쇄 계산

```jsx
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

- 위의 코드처럼 한 state 가 다른 state 를 업데이트 하는 방식으로 Effect 를 사용하고 싶을 수 있지만, 이런 방식은 굉장히 비효율 적이다
- 첫 번재 문제는매우 비효율적이라는 것(불필요한 리렌더링이 세 번이나 발생한다)
- 두 번째는, 위와 같은 Effect 체인이 새로운 요구사항에 맞지 안을 수 있다는 점이다.
  - 위와 같이 의존성이 강한 코드는 경직되고 취약하다
- 차라리, 이벤트 핸들러에서 state 를 조절하는 것이 낫다.

```jsx
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  **const isGameOver = r**ound > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }


    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

---

## 9. 애플리케이션 초기화하기

- 일부 로직은 앱이 로드될 때 딱 한 번만 실행되기를 원할 수 있다.
- 이런 경우 최상위 컴포넌트의 Effect 에 배치하고 싶을 수 있다.
- 하지만 useEffect 를 사용하면 개발 중에는 두 번 실행된다.
- 만약 컴포넌트 마운트당 한 번이 아니라 앱 로드당 한 번 실행해야 하는 경우, 최상위 변수를 추가해 이미 실행됐는지를 확인할 수 있다

```jsx
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;

      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

- 혹은 모듈 초기화 중이나 앱 렌더링 전에 실행할 수도 있다

```jsx
if (typeof window !== 'undefined') {
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

- 컴포넌트를 import 할 때 최상위 레벨의 코드는 렌더링되지 않더라도 일단 한 번 실행된다.
- 임의의 컴포넌트를 import 할 때 속도 저하나 예상치 못한 동작을 방지하려면 위의 패턴을 사용하지 않는 것이 좋다.

---

## 10. state 변경을 부모 컴포넌트에 알리기

- 만약, 내부 state 가 변경될 때마다 부모 컴포넌트에 알리고 싶어서 props 로 넘겨받은 함수를 Effect 를 호출하는 경우

```jsx
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange]);

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

- 여기서는 Toggle 이 state 를 업데이트 하고 React 가 화면을 업데이트한다.
  - 그 다음 React 는 부모 컴포넌트로 전달 받은 onChange 함수를 호출하는 Effect 를 실행한다
  - 이제 부모 컴포넌트가 자신의 state 를 업데이트 하고
  - Rendering 을 거친다
- 이런 경우, Effect 를 사용할 것이 아니라 이벤트 핸들러에서 두 컴포넌트의 state 를 업데이트하는 것이 가장 이상적이다.

```jsx
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
    // ✅ 좋습니다: 이벤트 발생시 모든 업데이트를 수행
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

---

## 11. 부모에게 데이터 전달하기

```jsx
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();

  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

- 이런식으로 자식 컴포넌트가 부모 컴포넌트에 데이터를 전달해서는 안된다.
- React 는 단방향 데이터의 흐름을 따르고 있다. 위와 같은 코드는 React 컨셉에도 전혀 맞지 않는다.
- 무조건 부모에서 자식 컴포넌트로 데이터를 내릴 수 있도록 해야 한다.

```jsx
function Parent() {
  const data = useSomeAPI();

  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

---

## 12. 외부 스토어 구독하기

- 때로는 컴포넌트가 React state 외부의 일부 데이터를 구독해야 하는 경우가 있을 수 있다.
  이런 경우에는 Effect 를 동반 수행하는 경우가 있다.

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

- 하지만 외부 저장소를 구독하기 위해 제작된 특별한 Hook 으로 useSyncExternalStore 란 것이 존재한다.

```jsx
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe, // React는 동일한 함수를 전달하는 한 다시 구독하지 않음
    () => navigator.onLine, // 클라이언트에서 값을 가져오는 방법
    () => true // 서버에서 값을 가져오는 방법
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

- 이 접근 방식은 변경 가능한 데이터를 Effecrt 를 사용해 React state 에 수동으로 동기화하는 것보다 오류 가능성이 더 적다
- 일반적으로 위의 useOnlineStatus() 와 같은 커스텀 훅을 작성해 개별 컴포넌트에서 이 코드를 반복할 필요가 없도록 만든다.

---

## 13. 데이터 Fetching

- 많은 앱이 데이터 패칭을 위해 Effect 를 사용한다.

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchResults(query, page).then((json) => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

- 위의 fetch 를 이벤트 핸들러로 옮길 필요는 없다.
- 하지만, 위의 코드에서는 “경쟁 조건” 이 붙을 수 있다.
  - 즉, 타이핑 되는 속도가 너무 빠른 나머지, query, page 에 맞춰 네트워크 요청을 보내는 수가 많고, 가장 마지막으로 전달된 fetch 데이터가 진짜 마지막으로 타이핑된 state 의 결과로 네트워크 요청보낸 API 의 값이 아닌 경우, 문제가 발생한다.

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then((json) => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

- 이런 경우에는 클린업 함수를 추가하여 해결할 수 있다.
- 이렇게 하면 Effect 가 데이터를 패치할 때 마지막으로 요청된 응답을 제외한 모든 응답이 무시된다.
- 이런식으로 만드는 custom Hoioks 를 만드는 것도 좋은 방법이다
