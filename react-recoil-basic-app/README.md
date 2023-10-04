# (1) ATOM
- atom 은 상태의 일부를 나타낸다
- Atoms 는 어떤 컴포넌트에서나 읽고 쓸 수 있다.
- atom 의 값을 읽는 컴포넌트들은 암묵적으로 atom 을 구독한다
- atom 에 변화가 있으면 그 atom 을 구독하는 모든 컴포넌트들이 리렌더링된다.
- key : 고유한 Key 값
- default : atom 의 초기값.
- useRecoilState() 를 활용해서 atom 값을 가져온다

# (2) SELECTOR 
- selector 는 atom 혹은 다른 selector 상태를 입력 받아 동적인 데이터를 반환하는 순수 함수
- selector 가 참조하던 다른 상태가 변경되면 이도 같이 업데이트 된다
- 이때, selector 를 바라보던 컴포넌트들이 리렌더링 된다.
- key: 고유한 Key 값
- get : Selector 순수 함수. 사용할 값을 반환하며 매개 변수인 콜백 객체 내 get() 메서드로 다른 atom 혹은 selector 를 참조
- useRecoilValue() 를 활용해서 selector 값을 가져온다