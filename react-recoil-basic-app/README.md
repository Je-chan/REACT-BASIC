# (1) ATOM
- atom 은 상태의 일부를 나타낸다
- Atoms 는 어떤 컴포넌트에서나 읽고 쓸 수 있다.
- atom 의 값을 읽는 컴포넌트들은 암묵적으로 atom 을 구독한다
- atom 에 변화가 있으면 그 atom 을 구독하는 모든 컴포넌트들이 리렌더링된다.
- key : 고유한 Key 값
- default : atom 의 초기값.

# (2) SELECTOR 
- selector 는 atom 혹은 다른 selector 상태를 입력 받아 동적인 데이터를 반환하는 순수 함수
- selector 가 참조하던 다른 상태가 변경되면 이도 같이 업데이트 된다
- 이때, selector 를 바라보던 컴포넌트들이 리렌더링 된다.
- key: 고유한 Key 값
- get : Selector 순수 함수. 사용할 값을 반환하며 매개 변수인 콜백 객체 내 get() 메서드로 다른 atom 혹은 selector 를 참조
- selector 는 기본적으로 값을 자체적으로 캐싱한다
  - 즉, 입력된 적이 있는 값이라면 그 값을 기억하고, 이 값이 다시 호출되면 이전에 캐싱된 결과를 바로 보여준다.
  - 이 점은 비동기 데이터를 다루는 측면에서 유리하다

# (3) Hooks
## (3-1) useRecoilState()
- useState() 와 유사
- [state, setState] 튜플을 반환
- 인자에 Atoms 혹은 Selector 값을 넣어준다

## (3-2) useRecoilValue()
- 전역 상태의 State 상태 값만을 참조하기 위해 사용
- 선언된 변수에 할당하여 사용

## (3-3) useSetRecoilState()
- 전역 상태의 Setter 함수만을 사용하기 위해 사용
- 선언된 함수 변수에 할당하여 사용
 
## (3-4) useResetRecoilState()
- 전역 상태를 default 값으로 reset 하기 위해 사용
- 선언된 함수 변수에 할당하여 사용
