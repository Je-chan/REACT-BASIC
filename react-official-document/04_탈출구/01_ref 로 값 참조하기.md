# ref 로 값 참조하기

## 1. 컴포넌트에 ref 추가하기

```jsx
const ref = useRef(0)

// ref 는 다음의 값을 반환하고 있다.
{
  current: 0
}
```

- ref.current 속성을 통해 해당 ref 의 현재 값에 액세스 할 수 있다.
- 이 값은 의도적으로 Mutation 이 가능하며 읽기, 쓰기가 모두 가능하다.
- 그리고 이 값은 REact 가 추적하지 않는 컴포넌트의 메모리 값이다.

```jsx
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

- 여기서 ref 는 숫자를 가리키고 있지만, state 와 마찬가지로 문자열, 객체, 함수 등 무엇이든 가리킬 수 있다.
- state 와 달리 ref 는 current 속성을 읽고 수정할 수 있는 자바스크립트 객체다
- 무엇보다 중요한 것은 ref 의 값이 변한다 해서 리렌더링되지 않는다.

## 2. ref 와 state 의 차이점

| refs | state |
| --- | --- |
| useRef(value) 는 { current : value } 를 반환 | useState(value) 는 [value, setValue] 를 반환 |
| 변경해도 컴포넌트가 리렌더링하지 않음 | 변경하면 컴포넌트가 리렌더링 됨 |
| Mutable | Immutable |
| 렌더링 중에는 current 값을 읽거나 쓰지 않아야 함 | 언제든 state 를 읽을 수 있음 |

### ref 의 작동 원리

- useRef 는 useState 위에 구현될 수 있다.

```jsx
function useRef(initialValue) {
	const [ref, unused] = useState({current: initialValue})
  return ref
}
```

- 첫 번째 렌더링 중에 useRef 는 { current : initialValue } 값을 반환한다.
- 이 값은 React 에 의해 저장된다
- 이후 상태 업데이트 함수를 사용할 수 없고 오직 Mutation 만 가능하기 때문에 리렌더링을 촉발하지 못한다

## 3. ref 를 사용해야 하는 경우

- 일반적으로ref 는 컴포넌트가 React 의 바깥으로 나가서 외부 API 즉, 컴포넌트 형상에 영향을 주지 않는 브라우저 API 와 통신할 때 종종 사요한다\

1. timeout ID 를 저장할 때,
2. DOM element 를 저장 및 조작할 때
3. JSX 를 계산하는 데 필요하지 않은 객체를 저장할 때

- 컴포넌트에 일부 값을 저장해야 하지만, 렌더링 로직에 영향을 미치지 않는 경우에 ref 를 선택해야 한다.

## 4. ref 의 모범 사례

- 다음의 원칙으로 ref 를 생각하면 좋다

### 4-1) ref 는 탈출구다

- ref 는 외부 시스템이나 브라우저 API 로 작업할 떄 유용하다
- 애플리케이션 로직과 데이터 흐름의 대부분이 ref 에 의존하는 경우, 접근 방식을 재고해봐야 한다.

### 4-2) 렌더링 중에는 ref.current 를 읽거나 쓰지 말 것

- 렌더링 중에 일부 정보가 필요한 경우에는 state 를 사용할 것
- React 는 ref.current 가 언제 반영되는지 알지 못한다
- 렌더링 중에 읽어도 컴포넌트의 동작을 예측하기 어렵다
- 딱 한 가지 예외 사항이 있다면?
	- 첫 번째 렌더링 중에 ref 를 한 번만 설정하는 코드 같은 경우

		```jsx
		if(!ref.current) {
			ref.current = new Thing()
		}
		```

- React state 의 제한은 ref 에 적용되지 않는다
	- 이는 ref 의 현재 값을 Mutate 함녀 즉시 변경됨을 의미한다.
	- state 처럼 snapshot 이 아니라는 것
- ref 는 그 자체가 일반 JavaScript 객체다.
- ref 로 작업할 대 변이를 피하고자 조심할 필요가 없다.

## 5. ref 와 DOM

- ref 는 모든 값을 가리킬 수 있다.
- ref 의 가장 일반적인 사용 사례는 DOM 에 액세스 하는 상황이다.