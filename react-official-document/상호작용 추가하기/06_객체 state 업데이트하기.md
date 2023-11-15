# 객체 state 업데이트

## 1. 변이(Mutation)란 무엇인가

- state 는 javaScript 의 어떤 값이든 담을 수 있다
	- 이는 객체도 담을 수 있다는 것.
- 기술 적으로 객체 자체의 내용을 변경하는 것은 가능하다

```jsx
const [p, setP] = useState({x: 0, y: 0})

p.x = 5
```

- 위 로직은 자바스크립트에서 가능하다.
- React state의 객체는 기술적으로 위와 같이 변이할 수 있지만, 이는 원시 타입과 같이 불변하는 것처럼 취급해야 한다.

## 2. state 를 읽기 전용으로 취급할 것

- 즉, state 에 넣는 모든 값을 read-only 로 취급해야 한다

```jsx
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

- 이 코드에서 문제가 되는 건 onPointerMove 다.
- 이 코드는 이전 렌더링에서 position 에 할당된 객체를 수정한다.
	- 하지만 setPosition 함수를 사용하지 않으면 React 는 객체가 변이됐다는 사실을 알지 못한다. 즉 Trigger 를 하지 못한다.
- 그렇기 때문에 리렌더링을 촉발하기 위해서는 새 객체를 생성하고 setPosition 함수에 그 값을 전달해야 한다

```jsx
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

## 3. 전개 구문을 사용하여 객체 복사하기

- 보통, 기존 데이터를 새로 만드는 객체의 일부로 포함시키고 싶은 경우가 있다

```jsx
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

- 예를 들어 이 코드에서 원하는 동작을 위해서는 새 객체를 생성하고, setPerson 에 전달해야 한다. 하지만, 그러기에는 변하지 않는 객체의 값들이 많아서 코드를 많이 작성하기가 불편하다.

```jsx
setPerson({
  firstName: e.target.value, // input에서 받아온 새로운 first name 
  lastName: person.lastName,
  email: person.email
});
```

- 이럴 때 전개 구문을 사용한다

```jsx
setPerson({
  ...person, // 이전 필드를 복사합니다.
  firstName: e.target.value // 중복된 key 인 firstName 만 덮어 씌운
});
```

## 4. 중첩된 객체 업데이트하기

- 만약, 객체가 중첩된 경우, 어떻게 해야할까?
	- spread 는 딱 한 depth 의 객체만 깊은 복사하기 때문에 그 너머의 depth 의 값들은 얕은 복사 (주소를 복사)한다.

```jsx
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

- 만약 이런 상황이라면

```jsx
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);

// 혹은

setPerson({
  ...person, 
  artwork: { 
    ...person.artwork, 
    city: 'New Delhi'   
  }
});
```

- 이런 식으로 객체 내부의 객체까지 깊게 복사해야 한다.

### Immer 사용하기

- state 가 깊게 중첩된 경우, Immer 를 사용할 수 있다.

```jsx
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

- 마치 변이시키는 것 같지만, 실제로는 이전 state 를 덮어 쓰는 것이 아니다.
- Immer 에서 제공하는 draft 는 Proxy 라는 객체로, 사용자가 수행하는 작업을 기록한다. 그렇기 대문에 Immer는 내부적으로 draft 의 어떤 부분이 변경됐는지를 파악하고 편집 내용이 포함된 완전히 새로운 객체를 생성한다.

## 왜 React 에서 state 변이를 권장하지 않는가?

### 1. 디버깅

- console.log 를 사용하고 state를 변이하지 않으면 과거 기록이 최근 state 변이에 의해 지워지지 않는다
- 그렇기에 렌더링 사이에 state 가 어떻게 변경됐는지 명확하게 알 수 있다.

### 2. 최적화

- React 최적화 전략은 이전 프로퍼티나 state 가 다음 프로퍼티나 state 와 동일한 경우, 작업을 건너뛰는 것에 의존한다
- state 를 변이하지 않는다면 변경이 있었는지 확인하는 것이 매우 빠르다.
	- 만약 prevObj === obj 라면, 내부에 변경된 것이 없음을 확신할 수 있다.
	- 즉, 주소값이 같은지, 아닌지만 따지면 될 뿐. 내부의 내용까지 일일이 하나씩 확인할 필요가 없다는 것


### 3. 새로운 기능

- React 에서 개발중인 기능은 state가 스냅샷처럼 취급되는 것에 의존한다
- 과거의 state 를 변이하는 경우, 새로운 기능을 사용하지 못할 수 있다.

### 4. 요구사항 변경

- 실행 취소, 다시 실행, 변경 내역 표시 등등 사용자가 양식을 이전 값으로 재설정할 수 있도록 하는 것과 같은 일부 애플리케이션 기능은 아무것도 변이되지 않은 state 에서 더 쉽게 수행할 수 있다.
- 과거의 state 복사본을 메모리에 보관하고 필요할 때 재사용할 수 있기 때문
- 변이가 가능한 방식으로 시작하면 이와 같은 기능을 추가하기 어려울 수 있다.

### 5. 더 간단한 구현

- React 는 변이에 의존하지 않으므로 객체에 특별한 작업을 할 필요가 없다.
- 많은 반응형 솔루션처럼 프로퍼티를 가로채거나, 항상 프록시로 감싸거나, 초기화할 때 다른 작업을 할 필요도 없다
- 이것이 React 를 사용하면 추가 성능이나 정확성의 함정 없이 아무리 큰 객체라도 state 에 넣을 수 있는 이유다.