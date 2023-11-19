# Context 로 데이터 깊숙이 전달하기

- 일반적으로 부모 컴포넌트에서 자식 컴포넌트로 props 를 통해 정보를 전달한다.
- 하지만 위의 방식은 props drilling 이 발생할 수 있으며 사용이 불편해질 수 있다
- Context 를 사용하면 부모 컴포넌트가 props 를 통해 명시적으로 전달하지 않고도 그 아래 트리의 모든 컴포넌트에서 일부 정보를 사용할 수 있다

## 1. props 전달 문제

- props 전달은 UI 를 통해 데이터를 사용하는 컴포넌트를 명시적으로 연결할 수 있는 방법이다
- 하지만, 트리 깊숙하게 props 를 전달하거나 많은 컴포넌트에 동일한 prop 이 필요한 경우 불편해질 수 있다.
- prop 을 전달하지 않고도 트리에서 데이터가 필요한 컴포넌트로 텔레포트 하는 방법이 바로 React 의 context 다.

## 2. Context : prop 전달의 대안

- context 를 사용하면 상위 컴포넌트가 그 아래 전체 트리에 데이터를 제공할 수 있다.
- context 는 다양한 용도로 사용된다.

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}

// Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}

// Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

- 동일한 Section 내의 여러 제목이 항상 같은 크기를 갖도록 하려고 한다 가정해보자.

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

- 현재 level prop 을 <Heading> 에 개별적으로 전달하고 있다.
- 이런 방법 대신, prop 을 Section 컴포넌트로 전달하고 Heading 에서 제거할 수 있다면, 같은 section 의 모든 제목이 같은 크기를 가질 수 있도록 강제할 수 있다
- 하지만, <Heading> 컴포넌트가 가장 가까운 Section Level 을 알 수 있는 방법이 없다. 자식 트리 위 어딘가에서 데이터를 요청할 수 있는 방법이 필요하다. 이 방법에는 prop 만으로는 부족하고, Context 가 필요하다

1. Context 를 생성한다
2. 데이터가 필요한 컴포넌트에서 해당 Context 를 사용한다
3. 데이터를 지정하는 컴포넌트에서 해당 Context 를 제공한다

- Context 는 멀리 떨어져 있는 상위 트리라도 그 안에 있는 전체 트리에 일부 데이터를 제공할 수 있다.

### Step 1 : context 만들기

- 먼저 context 를 만들어야 한다.

```jsx
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

- createContext 에서 유일한 인수는 기본 값이다.

### Step 1 : context 사용하기

- React 와 context 에서 useContext Hook 을 가져온다

```jsx
// Ueading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

- Heading 컴포넌트는 props 에서 level 을 읽어야 한다.
	- 기존이라면 props 를 사용해야 겠지만
	- level prop 을 제거하고 방금 import 한 context 인 levelContext 에서 값을 읽는다.

```jsx
// 기존
export default function Heading({ level, children }) {
  // ...
}

// Context 사용 후
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

- useContext 는 React 에게 Heading 컴포넌트가 LevelContext 를 읽기 원한다고 알려준다.
- 이제 Heading 컴포넌트에는 level prop 이 없기 때문에 더이상 JSX 에서 level prop 으로 넘겨주지 않고, Section 이 이 level 을 받을 수 있도록 JSX 를 수정할 수 있다.

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

### Step 3 : context 제공하기

- Section 컴포넌트는 현재 children 을 렌더링하고 있다.
- context provider 로 감싸서 LevelContext 를 제공한다

```jsx
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

- 위 코드는 React 에게 `<Section> 안에 있는 컴포넌트가 LevelContext 를 요청하면 이 level 값을 제공하라` 라고 지시하는 것과 같다
- 컴포넌트는 그 위에 있는 UI 트리에서 가장 가까운 <LevelContext.Provider>의 값을 사용한다.

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

- 그 결과, 원래 코드와 동일한 결과지만, 각 Heading 컴포넌트에 level prop 을 전달할 필요가 없다. ㅐ신 위의 가장 가까운 Section 에 요청해 제목 level 값을 알기만 하면 된다

## 3. 동일한 컴포넌트에서 context 사용 및 제공

- 현재는 여전히 각 section 의 level 을 수동적으로 지정해야 한다.

```jsx
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

- context 를 사용하면 위의 컴포넌트에서 정보를 읽을 수 있기 때문에 각 Section 은 위의 Section 에서 level 을 읽고, 그 값에 +1 한 값을 자동으로 아래에 전달할 수 있다.

```jsx
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

- 이렇게 변경하면 level prop 을 <Section> 이나 <Heading> 모두에 전달할 필요가 없다

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

- 이제 Heading 과 Section 은 모두 LevelContet 를 읽어 얼마나 깊은 수준인지 파악한다.
- Section 은 children 을 LevelContext 로 감싸서 그 안에 있는 모든 것이 더 깊은 level 에 있음을 지정한다

- Context 의 쓰임은 이런 level 뿐만 아니라 색상 테마, 현재 로그인한 사용자 등의 Root 정보를 모든 하위 트리에 전달할 수 있다.

## 4. Context 는 중간 컴포넌트들을 통과한다

- context 를 제공하는 컴포넌트와 contet 를 사용하는 컴포넌트 사이에 원하는 만큼의 컴포넌트를 삽입할 수 있다.
- Context 를 사용하면 주변 환경에 적응하고 렌더링되는 위치에 따라 다르게 표시되는 컴포넌트들을 작성할 수 있다.
	- 말이 어렵지만, 결론은 어느 위치에서든 Provider 로 감싸진 하위 컴포넌트들은 Context 의 데이터를 읽을 수 있으며
	- Provider 를 재정의하면 context 의 내용이 overridng 된다.
	- 이런 방식은 태그에 font-size 와 같은 CSS 를 주면, 그 내용이 자식 태그들에게도 영향을 주지만, 만약 자식 태그에서 font-size 를 재정의하면 CSS 속성이 변경되는 것과 같다는 의미

## 5. context 를 사용하기 전에

- context 는 사용하기 좋지만, 남발해선 안 된다.

### (1) props 전달하는 것부터 시작하라

- 컴포넌트가 사소하지 않다면, 수십 개의 props 를 수십 개의 컴포넌트에 전달하는 경우가 드물지 않다
- 지루하게 느껴질 수 있지만 어떤 컴포넌트가 어떤 데이터를 사용하는지 명시하는 과정이기 때문에 코드를 유지보수 하는 사람의 입장에서는 데이터 흐름을 명확하게 파악할 수 있어 좋을 것

### (2) 컴포넌트를 추출하고 JSX children 으로 전달하라

- 일부 데이터를 해당 데이터를 사용하지 않는 중간 컴포넌트의 여러 레이러를 거쳐 전달한다면 이는 종종 그 과정에서 일부 컴포넌트를 추출할 수 있음을 의미한다.

## 6. context 사용 사례

### (1) 테마 적용

- 다크모드, 라이트 모드와 같은 것

### (2) 현재 계정 정보

- 많은 컴포넌ㅌ으ㅔ서 현재 로그인한 사용자를 알아야 한다. 이 정보를 context 에 넣으면 트리 어느 곳에서나 편리하게 읽을 수 있다

### (3) 라우팅 정보

- 대부분의 라우티으 솔루션은 내부적으로 context 를 사용해서 현재 경로를 유지한다.
- 이는 모든 링크가 활성 상태인지 아닌지를 아는 방법이다
- 자체 라우터를 구축하는 경우에도 이런 방식을 사용할 수 있다

### (4) state 관리

- 앱이 성장함에 따라 앱 상단에 많은 state가 가까워질 수 이삳.
- 아래에 많은 멀리 떨어진 컴포넌트에서 이를 변경하고 싶을 수도 있다
- context 와  함께 reducer 를 사용해서 복잡한 state를 관리하고 번거로움 없이 멀리 떨어진 컴포넌트에 전달하는 것이 일반적이다.