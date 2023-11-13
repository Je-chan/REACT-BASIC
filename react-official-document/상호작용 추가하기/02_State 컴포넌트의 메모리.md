# State: 컴포넌트의 메모리

## 1. 일반 변수로 충분하지 않은 경우

- 컴포넌트를 새 데이터로 업데이트 하기 위해서는 두 가지 작업이 필요핟
1. 렌더링 사이에 데이터를 유지한다
2. 새로운 데이터로 컴포넌트를 리렌더링하도록 촉발해야 한다

- useState 훅이 이 두가지를 제공한다
	- 렌더링 사이에 데이터를 유지하며
	- state 로 저장한 데이터가 업데이트 되면 React 컴포넌트가 리렌더링되도록 만든다.

---

## 2. state 변수 추가하기

- state 변수를 추가하기 위해서는 파일 상단에 useState 를 react 라이브러리에서 import 해야 한다

```jsx
import { useState } from 'react';
```

- 그리고 저장할 변수를 다음과 같이 사용한다

```jsx
// [값을_저장할_변수, 값을_업데이트할_함수] = useState(변수_초기화_값)
const [index, setIndex] = useState(0);
```

- 그리고 이 index 값을 업데이트 하려면 setIndex 를 사용한다

```jsx
 function handleClick() {
  setIndex(index + 1);
}
```

### 

### 첫 번재 훅 만나기

- React 에서는 useState 를 비롯해 use 로 시작하는 다른 함수를 Hook 이라고 부른다.
- 훅은 Readct 가 렌더링 중일 때만 사용할 수 있는 특별한 함수다
- 이 Hook 을 사용할 때는 반드시, 컴포넌트 최상위 레벨 또는 커스텀 훅에서만 호출할 수 있다는 것이다
	- 조건문, 반복문, 기타 다른 블록문에서는 훅을 호출할 수 없다.

### useState 해부하기

- useState 를 호출하는 것은 React 에게 이 컴포넌트가 무언가를 기억하기 원한다고 하는 것을 뜻한다

```jsx
const [state, setState] = useState(0)

const updateState = () => setState(state + 1)
```

- 이렇게 작성했다면 우리는 index 라는 값을 기억하길 원한다는 것
- 동작하는 방식은 다음의 단계와 같다

1. 컴포넌트가 최초 렌더링(mount) 된다
	- state 의 초기 값으로 0 값이 들어간다
2. setState 를 활용해 state 값을 업데이트 한다. (updateState 호출)
	- state 값이 0 이므로 setState(1) 이 호출된다
	- 이렇게 되면 state 값에 1이 들어가게 되고 이를 React 가 기억한다
	- 값이 업데이트 됐으므로 리렌더링을 촉발한다
3. 컴포넌트가 리렌더링(두 번째 렌더링)된다..
	- 이제 state 값이 1이 된 상태로 컴포넌트가 렌더링된다

---

## 3.  state 는 격리되고 프라이빗하다

- state 는 화면의 컴포넌트 인스턴스에 지역적이다
- 이 말은 동일한 컴포넌트를 두 군데에서 렌더링하더라도 완전히 격리된 state 를 갖는 다는 것을 의미한다
	- (JavaScript 의 렉시컬 스코프를 생각하면 될듯)
- 즉, state 는 지역적이다
- 만약, 컴포넌트 간의 state 를 공유해야 한다면, 그 컴포넌트들의 부모 컴포넌트에서 state 를 정의하고, 이 state 를 props 로 넘겨주는 방법이 가장 좋은 방법이다
	- 아닌 경우, 상태 관리 라이브러리를 활용