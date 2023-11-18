# state 보존 및 재설정

## 1. UI 트리

- 브라우저는 UI 를 모델링하기 위해 많은 트리 구조를 사용한다.
	- DOM 은 HTML 요소를 나타낸다
	- CSSOM 은 CSS 에 대해 동일한 역할을 한다.
	- 나아가 Accessibility Tree 도 존재한다
- React 도 트리 구조를 사용해 사용자가 만든 UI 를 관리하고 모델링한다.
	1. JSX 로부터 UI 트리를 만든다
	2. 이후 React DOM 은 해당 UI 트리와 일치하도록 브라우저 DOM 엘리먼트를 업데이트 한다.

	![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f25bd612-a409-4bde-9762-6996cd7ed325/78233836-11d8-42a0-b24c-b2a14d356c3d/Untitled.png)


## 2. state 는 트리의 한 위치에 묶인다

- 컴포넌트에 state 를 부여할 때, state 가 컴포넌트 내부에 존재한다고 생각할 수 있다
- 하지만, state 는 실제로 React 내부에서 유지된다. React UI 트리에서 해당 컴포넌트가 어디에 위치하는지에 따라 보유하고 있는 각 state 를 올바른 컴포넌트와 연결할 뿐이다

```jsx
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

- 트리로 표현하면 다음의 이미지와 같다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f25bd612-a409-4bde-9762-6996cd7ed325/43c51fa3-7d58-4fdf-8013-e641ebb47db2/Untitled.png)

- 이 카운터는 각 트리에서 고유한 위치에 렌더링되기에 개별 카운터다.
- React 에서 화면의 각 컴포넌트는 완전히 분리된 state 를 갖는다.
- React 는 같은 컴포넌트를 같은 위치에 렌더링하면 그 state 를 유지한다.

```jsx
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

- 두 번째 counter 렌더링을 중지하면 순간 state 가 완전히 사라진다.
	- React 가 컴포넌트를 제거하면 그 state 가 사라지기 때문이다.
- Render the second counter 버튼을 클릭하면 두 번째 Counter 와 그 state 가 처음부터 초기화되어 DOM 에 추가된다.
- React 는 컴포넌트가 UI 트리의 해당 위치에 렌더링되는 동안 컴포넌트의 state 를 유지한다.
	- 컴포넌트가 제거되거나 같은 위치에 다른 컴포넌트가 렌더링되면 React 는 해당 컴포넌트의 state 를 삭제한다.

## 3. 동일한 위치의 동일한 컴포넌트는 state 를 유지한다.

```jsx
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}
```

- 위에서 체크 박스를 선택하거나 취소해도 카운터 state 는 재설정되지 않는다.
- 이는 isFancy 값이 true 이든 false 이든 루트 APP 컴포넌트에서 반환된 첫 째 자식에 항상 <Counter /> 가 있기 때문이다.

### 중요한 것은 UI 트리에서 위치다.

```jsx
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
```

- 확인해보면, App 에서 JSX 마크업으로 return 되는 <Counter /> 가 동일하지 않아 보일 수 있다. 하지만, <Counter /> 태그는 결국 같은 위치에서 렌더링되기 때문에 state 는 재설정되지 않는다.
	- 두 경우 모두 App 컴포넌트가 Counter 를 첫 번째 자식으로 갖는 div 를 반환한다. React 에서 이 두 카운터는 루트의 첫 번째 자식의 첫 번째 자식이라는 동일한 주소를 갖는다.
	- 만약 저 <Counter /> 컴포넌트 위에 <div> 태그를 하나 새로 만들어서 넣으면 state 는 보존되지 않는다.


## 4. 동일한 위치의 다른 컴포넌트는 state 를 초기화한다.

```jsx
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

```

- Counter 였던 컴포넌트를 빌트인 <p> 컴포넌트로 변경했다.
- 같은 위치라도 다른 컴포넌트가 렌더링되면 해당 state 를 소멸시킨다.
- 마찬가지로, 같은 위치에 다른 컴포넌트를 렌더링하면 전체 하위 트리의 state 가 재설정된다.

```jsx
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

```

- 경험칙상 리렌더링 사이의 state 를 유지하기 위해서는 트리의 구조가 일치해야 한다. 구조가 다르면 React 는 트리에서 컴포넌트를 제거할 때 state 를 파괴한다.

## 5. 동일한 위치에서 state 재설정하기

- 기본적으로 React 는 컴포넌트가 같은 위치에 있는 동안 컴포넌트의 state 를 보존한다.
	- 이것은 사용자가 원하는 것이기에 기본 동작으로 적합하다
	- 하지만 때로는 컴포넌트의 state 를 리셋하고 싶을 때가 있다

```jsx
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

- 여기서 현재 플레이어를 변경하면 점수가 보존된다.
- 두 Counter 는 같은 위치에 표시되기에 React 는 person prop 이 변경되면 동일한 Counter 로 간주한다.
- 하지만 개념적으로 이 앱에서는 두 개의 구별된 카운터가 있어야 한다.
	- UI 에서 같은 위치에 표시될 수 있으나, 하나는 Taylor 의 카운터고, 다른 하나는 Sarah 의 카운터기 때문
- 전환할 때 state 를 재설정하는 방법은 두 가지가 있다.
	1. 컴포넌트를 다른 위치에 렌더링하기
	2. 각 컴포넌트에 key 로 명시적인 아이덴티티를 부여하기

### Option 1 : 컴포넌트를 다른 위치에 렌더링하기

```jsx
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

```

- 이렇게 표현하면, 각 Counter 의 state 는 DOM 에서 제거될 때마다 소멸되고, 버튼을 클릭할 때마다 초기화 된다.
- 이 방식은 같은 위치에 몇 개의 독립적인 컴포넌트만 렌더링할 때 편리하다.

### Option 2 : key 로 state 재설정하기

- React 는 부모 내의 순서를 사용해 컴포넌트를 구분한다. 하지만, key 를 사용하면 이것이 첫 번째인지, 두 번째인지를 명시할 수 있다.

```jsx
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}
```

- 이렇게 코드를 작성하면 테일러와 사라 사이를 전환해도 state 가 유지되지 않는다.
	- 서로 다른 key 를 부여해주었기 때문에 독립된 컴포넌트라 생각하기 때문
- key 의 쓰임은 React 가 부모 내 순서가 아닌 key 자체를 위치의 일부로 사용하도록 지시하는 것이다.
	- 그렇기에 JSX 에서 같은 위치에 렌더링 하더라도, React 관점에서는 서로 다른 Counter 컴포넌트가 된다
	- 이는 결론적으로 state 를 공유하지 않게 만든다

### key 로 form 재설정하기

- key 로 state 를 재설정하는 것은 form 을 사용할 때 특히 유용하다.

```jsx
// App.js

import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];

// ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}

// Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

- 입력란에 정보를 입력한 다음, 다른 수신자를 선택하면, <Chat /> 컴포넌트가 동일한 위치에서 렌더링되기 떄문에 입력 state 가 유지된다
- 많은 앱에서 이런 동작은 바람직할 수 있으나 채팅 앱에서는 그렇지 않다. 이런 문제를 해결하려면 key 를 추가해야 한다.

```jsx
<Chat key={to.id} contact={to} />
```

- 이렇게 하면 다른 수신자를 선택했을 때 Chat 컴포넌트가 그 아래 트리의 모든 state 를 처음부터 다시 생성한다.

### 제거된 컴포넌트에 대한 state 보존

- 실제 채팅 앱에서 사용자가 이전 수신자를 다시 선택할 때 입력 state 를 복구하고 싶을 것이다.
- 이런 방법을 위해서는 몇 가지 방법이 존대한다.

1. 모든 채팅을 렌더링하되, Active 되지 않은 채팅방은 CSS 로 숨길 것
	- 이 솔루션은 간단한 UI 에서는 적합하지만 숨겨진 트리가 크고 많은 DOM 노드를 포함하면 속도가 매우 느려질 수 있다
2. 부모 컴포넌트에서 각 수신자에 대한 보류 중 메시지를 보관하기
	- 이렇게 하면 자식 컴포넌트가 제거돼도 중요 정보를 보관하는 것은 부모 컴포넌트이기에  일반적인 문제 해결 방법이다
3. React state 이외의 다른 소스 활용
	- 예를 들어 사용자가 실수로 페이지를 닫아도 메시지 초안이 유지되길 원한다면 localStorage 에 저장해 state 를 초기화하고 저장할 수 있다.