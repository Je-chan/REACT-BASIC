# ref 로 DOM 조작하기

## 1. 노드에 대한 ref 가져오기

```jsx
const divRef = useRef(null)

// ...

return (
	<div ref={divRef}>
		{/* ... */}
	</div>
)
```

- 이렇게 하면 divRef.current 에 div 태그의 노드 정보가 들어간다.

```jsx
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

- 위 예제처럼 사용한다면 버튼을 눌렀을 때 input 에 focus 를 맞출 수 있다.

```jsx
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Tom
        </button>
        <button onClick={handleScrollToSecondCat}>
          Maru
        </button>
        <button onClick={handleScrollToThirdCat}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

- 컴포넌트를 ref 하나 이상 포함시킬 수 있다.
	- 즉, 필요할 때마다 ref 를 생성해서 엘리먼트와 연결지으면 된다.

### ref 콜백 사용하기

- 위의 예시는, 이미지가 세 개라는 것을 알고 있었기 때문에 정적으로 개수를 정해서 만들 수 있었다. 하지만, ref 의 개수를 동적으로 생성해야 할 때는 다음 과 같은 방법으로 해결할 수 있다.

1. 부모에 ref 를 달고, querySelectorAll 사용하기
	- 이 방법의 문제는 DOM 구조가 변경될 경우, 깨질 수 있다.

1. ref 속성에 함수 전달하기
	- 이 방식을 ref 콜백이라고 한다.
	- React 는 ref 설정할 때가 되면 DOM 노드로, 지울 때가 되면 null 로 ref 콜백을 호출할 것.
	- 이를 통해 자신만의 배열이나 Map 자료구조를 유지 관리하고, 인덱스나 Id 등으로 ref 에 접근할 수 있다.

	  ```jsx
		import { useRef } from 'react';
		
		export default function CatFriends() {
			const itemsRef = useRef(null);
		
			function scrollToId(itemId) {
				const map = getMap();
				const node = map.get(itemId);
				node.scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
					inline: 'center'
				});
			}
		
			function getMap() {
				if (!itemsRef.current) {
					// Initialize the Map on first usage.
					itemsRef.current = new Map();
				}
				return itemsRef.current;
			}
		
			return (
				<>
					<nav>
						<button onClick={() => scrollToId(0)}>
							Tom
						</button>
						<button onClick={() => scrollToId(5)}>
							Maru
						</button>
						<button onClick={() => scrollToId(9)}>
							Jellylorum
						</button>
					</nav>
					<div>
						<ul>
							{catList.map(cat => (
								<li
									key={cat.id}
									ref={(node) => {
										const map = getMap();
										if (node) {
											map.set(cat.id, node);
										} else {
											map.delete(cat.id);
										}
									}}
								>
									<img
										src={cat.imageUrl}
										alt={'Cat #' + cat.id}
									/>
								</li>
							))}
						</ul>
					</div>
				</>
			);
		}
		
		const catList = [];
		for (let i = 0; i < 10; i++) {
			catList.push({
				id: i,
				imageUrl: 'https://placekitten.com/250/200?image=' + i
			});
		}
		```

	- 위 예제에서 itemsRef 는 단일 DOM 노드를 보유하지 않고, 항목 ID 에서 DOM 노드로의 Map 자료구조를 보유한다.

	 ## 2. 다른 컴포넌트의 DOM 노드에 접근하기

	- <input /> 과 같은 브라우저 엘리먼트를 출력하는 빌트인 컴포넌트에 ref 를 넣으면, React 는 해당 ref 의 current 프로퍼티를 해당 DOM 노드로 설정한다
		  - 즉, 브라우저의 실제 태그 <input /> 값을 넣는다는 것
	- 하지만, 우리가 만든 컴포넌트에 ref 를 넣으려고 하면 기본적으로 null 이 반환된다.
	- 이는, React 컴포넌트가 다른 컴포넌트 DOM 노드에 접근하는 것을 허용하지 않기 때문이다.
		- 만약 다른 컴포넌트의 DOM 노드를 수동으로 조작하면 코드가 더러워지기 때문
	- 대신, DOM 노드를 노출하길 원하는 컴포넌트에 해당 동작을 설정할 수 있다.
	- 컴포넌트는 자신의 ref 를 자식 중 하나에 전달하도록 지정할 수 있다.

	  ```jsx
		import { forwardRef, useRef } from 'react';
		
		// 두 번째 인자인 ref 가 Form 컴포넌트에서 주는 ref 
		const MyInput = forwardRef((props, ref) => {
			return <input {...props} ref={ref} />;
		});
		
		export default function Form() {
			const inputRef = useRef(null);
		
			function handleClick() {
				inputRef.current.focus();
			}
		
			return (
				<>
					<MyInput ref={inputRef} />
					<button onClick={handleClick}>
						Focus the input
					</button>
				</>
			);
		}
		```

	1. 다른 컴포넌트( <MyInput /> )에 ref 값을 넣는다.
	2. 해당 컴포넌트( <MyInput /> )가 forwardRef 사용을 선언하면 props 다음, 두 번째 ref 인수에 위의 inputRef 를 받을 수 있다.
	3. 해당 ref 를 사용해 값을 저장할 노드에 ref 값을 넣는다

	- 디자인 시스템에서 버튼, 입력 등의 저수준 컴포넌트는 해당 ref 를 DOM 노드로 전달하는 것이 일반적인 패턴이다
		- 물론, 상위 수준 컴포넌트는 우발적 의존성을 피하기 위해 해당 DOM 노드를 노출하지 않는 것이 좋다

## 3. React 가 ref 를 첨부할 때

- React 에서 모든 업데이트는 렌더링, 커밋 과정으로 나뉜다.
- 일반적으로 렌더링 중에는 ref 에 엑세스 하지 않는 것을 원한다.
	- 아직, DOM 이 업데이트 되지 않았으므로 집을 노드가 없기 때문
- React는 커밋하는 동안 ref.current 를 설정한다.
	- React DOM 이 업데이트 되기 전까지는 null 로 설정했다가 DOM 이 업데이트 되면 해당 DOM 노드로 설정한다
- 일반적으로 이벤트 핸들러에서 ref 에 접근한다. 만약, ref