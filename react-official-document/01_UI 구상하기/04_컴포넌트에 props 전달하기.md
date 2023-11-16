# 컴포넌트에 Props 전달하기
- React 컴포넌트는 Props 를 이용해 서로 통신한다.
  - 모든 부모 컴포넌트는 props 를 통해 자식 컴포넌트에 정보를 전달한다
- props 의 형태가 JSX 문법을 사용하다 보니 HTML 속성을 연상케 하지만 모든 자바스크립트의 값을 전달할 수 있다

## 1. 친숙한 Props
```typescript jsx
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```
- props 는 JSX 태그에 전달하는 정보다.
- src, alt, width, height 등을 전달할 수 있다.
- img 태그에 전달할 수 있는 props 는 미리 정의돼 있으며 ReactDOM 은 HTML 표준을 준수한다.


## 2. 컴포넌트에 Props 전달 방법
```typescript jsx
export default function Profile() {
  return (
    <Avatar />
  );
}
```
- 현재 부모컴포넌트인 Profile 은 자식 컴포넌트인 Avatar 에게 아무 props 도 전달하지 않는다
- 다음 두 단계를 걸쳐 props 를 전달할 수 있다

### STEP 1) 자식 컴포넌트에 Props 전달하기
```typescript jsx
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```
- JSX 에서 Javascript 를 사용하는 방법은 {} 안에 자바스크립트 값 혹은 구문을 넣을 수 있다
- 위의 {{}} 에서 가장 바깥에 있는 {} 은 자바스크립트 언어를 쓸 수 있는 환경을 마련한 것이고, 안에 있는 {} 은 자바스크립트의 객체 리터럴 표기법이다
- 이렇게 함으로써 부모 컴포넌트인 Profile 이 자식 컴포넌트에 데이터를 전달했다

### STEP 2) 자식 컴포넌트 내부에서 Props 읽기
- 이 props 들은 자식 컴포넌트의 인자에 props 라는 객체의 key-value 형태로 들어간다.
```typescript jsx
function Avatar({ person, size }) {
	const getImageUrl = (person, size = 's') => {
		return (
			'https://i.imgur.com/' +
			person.imageId +
			size +
			'.jpg'
		);
	}
	
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```
- props 를 사용하면 부모 컴포넌트와 자식 컴포넌트를 독립적으로 사용할 수 있다.
  - 즉, Profile 은 Avatar 가 해당 props 를 어떻게 사용하는지 상관하지 않고 값을 수정할 수 있다.
  - 마찬가지로 Avatar 는 Profile 을 보지 않고서 props 를 사용하는 방식을 ㅂ자꿀 수 있다
- props 는 컴포넌트에 대한 유일한 인자다.
- 보통은 props 를 위의 방식처럼 구조분해 할당해서 값을 가져온다.

## 3. prop 의 기본 값 지정하기
```typescript jsx
function Avatar({ person, size = 100 }) {
  // ...
}
```
- 이처럼 함수 인자의 기본값을 지정해주듯이, size 라는 props 를 받지 않았을 때의 기본값을 지정해줄 수 있다.

## 4. Spread 구문으로 props 전달하기
- 가끔 props 들은 drilling 을 하기도 한다
- 즉, 자신이 부모로부터 받은 props 를 자식 컴포넌트에 그대로 전달하는 경우가 있다
```typescript jsx
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```
- 이런 코드를 간결하게 하기 위해서 Spread 구문을 사용한다
```typescript jsx
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

## 5. 자식을 JSX 로 전달하기
- 브라우저 빌트인 태그는 중첩하는 것이 일반적이다
```typescript jsx
<div>
  <img />
</div>
```
- 위의 마크업처럼 컴포넌트도 중첩하고 싶을 때가 있을 수 있다
```typescript jsx
<Card>
  <Avatar />
</Card>
```
- JSX 태그 내에 컨텐츠를 중첩하면 children 이라는 prop 으로 넘겨 받게 된다
```typescript jsx
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

## 6. 시간에 따라 props 가 변하는 방식
```typescript jsx
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}

```
- 위의 Clock 은 부모 컴포넌트로부터 color, time 을 props 로 받는다
- 이 예시에서 컴포넌트가 시간에 따라 다른 props 를 받게 된다 
  - 실제 저 time 은 1초마다 현재의 시간으로 바뀌고 있다
- Props 는 항상 고정되어 있지 않다.
  - 즉, 변경되는 모든 시점에 다 반영된다
- 그러나 Props 는 컴퓨터 과학에서 변경할 수 없다는 용어다. 
- 이는, props 를 넘겨받은 자식 컴포넌트에서 해당 Props 를 변경할 수 없다는 것을 의미한다.
- props 의 값이 변경돼야 한다면, 새로운 객체를 전달해 달라고 요청해야 한다
- 그러면 이전의 Props 와의 참조를 끊어낼 것이고, props 가 차지했던 메모리는 가비지 컬렉터가 회수할 것이다