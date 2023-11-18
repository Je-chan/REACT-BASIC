# 컴포넌트 간의 state 공유

## 1. 예제로 알아보는 state 끌어올리기

```jsx
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

- 이 코드에서 한 Pannel 의 버튼을 눌러도 다른 패널에 영향을 주지 않고 독립적으로 동작한다.
- 그렇다면, 이제 한 번에 하나의 패널만 열리도록 하려면 어떻게 해야 할까?
	- 이런 경우, 3단계를 거쳐 state 를 끌어올려야 한다

### Step 1 : 자식 컴포넌트에서 state 제거

- 부모 컴포넌트에서 Panel 의 isActive 를 제어할 권한을 부여해야 한다.
	- 이는, 부모가 자식에게 prop 으로 isActive 값을 넘겨줘야 함을 의미한다.
- 자식 컴포넌트에서 isActive 를 제거하고 props 로 넘겨받는 방식으로 코드를 변경한다

```jsx
function Panel({ title, children, isActive }) {

}
```

### Step 2 : 공통 부모에 하드 코딩된 데이터 전달하기

- state 를 끌어 올리려면 이 state 를 공유하는 컴포넌트의 가장 가까운 컴포넌트를 찾아야 한다.
	- 위의 예제에서 Accordion 컴포넌트

### Step 3 : 공통 부모에 state 추가

- state 를 끌어 올리려면 state 로 저장하는 항목의 특성이 변경되는 경우가 많다.
	- 이 경우, 한 번에 하나의 패널만 활성화 돼야 한다.
	- 그렇기에 boolean 값 보다는 활성화된 Panel 의 인덱스를 나타내는 숫자를 state 로 활용하는 것이 좋다.

```jsx
const [activeIndex, setActiveIndex] = useState(0);
```

- 각 Panel 에서 “Show” 버튼을 클릭하면 Accoordian 의 활성화된 인덱스를 변경해야 한다.
- Accordion 컴포넌트는 이벤트 핸들러를 prop 으로 전달해서 Panel 컴포넌트가 state 를 변경할 수 있도록 명시적으로 허용해야 한다.

```jsx
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

### 제어(controlled) 및 비제어(uncontrolled) 컴포넌트

- 일반적으로 일부 로컬 state 를 가진 컴포넌트를 “비제어 컴포넌트”라고 부른다.

## 2. A Single Source of Truth (for each state)

- 일명 SSOT
- React 애플리케이션은 많은 고유 state 를 가지고 있다.
	- 일부 state는 leaf 컴포넌트에, 어떤 state 는 root 컴포넌트에 가깝게 위치할 수 있다.
- 개발을 한다면 각 고유한 state 들에 대해 해당 state 를 소유하는 컴포넌트를 선택하게 된다.
	- A Single Source of Truth 라고도 한다
	- 모든 state 가 한 곳에 있다가 아니라, 각 state 마다 해당 정보를 소유하는 특정 컴포넌트가 ㅇㅆ다는 것.
	- 그리고 각 컴포넌트 간에 공유하는 state 를 복제하는 대신 공통으로 공유하는 부모로 끌어올려 필요한 자식에게 전달한다
- 앱은 작업하면서 계속 변경된다. 각 state 의 위치를 파악하는 동안 state 를 아래로 이동하거나 백업하는 것이 일반적이다.