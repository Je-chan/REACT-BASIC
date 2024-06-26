# state 로 입력에 반응하기

## 1. 선언형 UI 와 명령형 UI 의 차이점

- React 는 직접 UI 를 조작하지 않는다.
- 이는 컴포넌트를 직접 활성화하거나 비활성화하지도 않고, 보여주거나 숨기지도 않는다.
- 대신 표시할 내용을 선언하면 React 가 UI 를 업데이트할 방법을 알아낸다.

## 2. UI 를 선언적인 방식으로 생각하기

- UI 를 React 로 다시 구현하는 과정을 보면 다음과 같다.
1. 컴포넌트의 다양한 시각적 상태를 식별한다
2. 상태 변화를 촉발하는 요소를 파악한다
3. useState 를 사용해 메모리의 상태를 표현한다
4. 비필수적인 state 변수를 제거한다
5. 이벤트 핸들러를 연결해 state 를 설정한

### Step 1 : 컴포넌트의 다양한 시각적 상태 식별하기

- 먼저, 사용자에게 표시될 수 있는 UI 의 다양한 상태를 모두 시각화 해야 한다.
	- 컴포넌트에 시각적 상태가 많은 경우, 한 페이지에 모두 표시하는 것이 편리할 수 있다.

### Step 2 : 상태 변경을 촉발하는 요인 파악하기

- 상태 변경을 촉발하는 케이스는 크게 두가지다.
1. 사람의 입력 : 버튼 클릭, 필드 입력, 링크 이동 등
2. 컴퓨터의 입력 : 네트워크에서 응답 도착, 시간 초과, 이미지 로딩 등

- 두 경우 모두 state 변수를 설정해야 UI 를 업데이트할 수 있다.
	- 개발중인 form 의 경우, 몇 가지 다른 입력에 따라 state 를 변경해야 한다

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f25bd612-a409-4bde-9762-6996cd7ed325/db7a5189-1247-4293-9baf-cea21f0df77f/Untitled.png)

### Step 3 : 메모리 상태의 useState 로 표현하기

- 다음으로 메모리에서 컴포넌트의 시각적 상태를 useState 로 표현해야 한다.
- 반드시 필요한 state 부터 시작해야 한다.
- 이후, 시각적 상태 중 어떤 상태를 표시할지를 나타내는 state  변수가 필요하다.
- 여기서 생각한 state 가 최선은 아닐 수 있다는 점이다. 리팩터링의 가능성을 열어두어야 한다.

### Step 4 : 비필수적은 state 변수 제거하기

- state 콘텐츠의 중복을 피해 필수적인 것만을 추적하고 싶을 때가 있다.
- state 구조를 리팩터링하는데 시간을 투자하면 컴포넌트를 더 쉽게 이해하고 중복을 줄이고 의도하지 않은 경우를 피할 수 있다.
- state 가 사용자에게 보여주기 원하는 유효한 UI 를 나타내지 않는 경우를 방지하는 것
- 아래의 물음으로 state 변수에 대해서 생각해봐야 한다.

1. state 가 모순을 야기하는가?
	- 예를 들어 isTyping (타이핑중) 과 isSubmitting(제출중) 은 동시에 true일 수 없다.
	- 이런 모순은 일반적으로 state가 충분히 제약되지 않았음을 뜻한다.
2. 다른 state 변수에 이미 같은 정보가 있는가?
3. 다른 state 변수를 뒤집으면 동일한 정보를 얻을 수 있는가?

### Step 5 : 이벤트 핸들러를 연결해 state 설정하기

- 마지막으로 state 변수를 설정하는 이벤트 핸들러를 생성한다.