# 1. ORM
- 객체와 관계형 데이터베이스의 데이터를 자동으로 변형 및 연결하는 작업
- ORM 을 이용한 개발은 객체와 데이터베이스의 변형에 유연하게 사용할 수 있다

## 1-1) ORM VS Pure Javascript
```typescript jsx
// ORM
const boards = Board.find({
	title: "Hello",
	status: "PUBLIC"
})

// PURE
db.query('SELECT * FROM boards WHERE title = "Hello" AND status = "PUBLIC"', (err, result) => {
	if(err) {
		throw new Error('ERROR')
	}
	
	boards = result.rows 
} )
```

## 1-2) ORM 과 Node.js 추상화 계층
- 개발에서 추상화를 많이 하면 할수록 복잡한 로직을 알지 못하더라도 그 로직을 간단하게 사용할 수 있게 해준다
  - 불필요한 정보는 숨기고 중요한 정보만을 표현하기 때문
- 데이터베이스도 사용하는 방법에 따라 추상화가 많이 돼 있는 라이브러리를 사용할 수도 있고, 그렇지 않은 라이브러리를 사용할 수 있다
- 추상화는 약 3단계로 나눠서 살필 수 있다

### (1) 저수준 : 데이터베이스 드라이버
- 데이터베이스 드라이버는 데이터베이스 연결(때때로 연결 풀링)을 처리한다
- 이 수준에서는 원시 SQL 문자열을 작성한다
- Node.js 생태계에서는 이 계층에서 작동하는 라이브러리가 많이 존재한다
  - mysql: MySQL 
  - pg: PostgresSQL
  - sqlite3: SQLite
- 이런 라이브러는 기본적으로 동일한 방식으로 작동한다
  - 데이터베이스 인증정보 가져오기
  - 새 데이터베이스 인스턴스를 인스턴스화하기
  - 데이터베이스 연결하기
  - 문자열 형식으로 쿼리를 보내기
  - 결과를 비동기적으로 처리하기
  
### (2) 중간 단계 : 쿼리 빌더
- 단순한 데이터베이스 드라이버 모듈과 완전한 ORM 을 사용하는 것의 중간 단계
- 이 단계에서 가장 주목할만한 Node.js 모듈은 Knex
- 여기서 작성하는 쿼리는 기본 SQL 쿼리와 유사하다
- 한 가지 좋은 점은 문자열을 연결하여 SQL 을 형성하는 경우(이런 경우 보안에 취약함)보다 더 친숙한 프로그래밍 방식으로 동적 쿼리 생성이 가능하다

### (3) 고수준 : ORM
- 최고 수준의 추상화
- ORM 으로 작업할 때 더 많은 설정을 사전에 수행해야 한다
- ORM 의 요점은 관계형 데이터베이스의 데이터를 애플리케이션의 객체(클래스 인스턴스)에 매핑하는 것
- 관련 라이브러리도 많이 존재한다
  - typeorm
  - sequelize
  - prisma

## 1-3) ORM 의 단점
- SQL 이 아닌 ORM 자체를 배우게 된다
- 각각의 특정 ORM 자체를 배우는 시간도 오래 걸리고 ORM 마다 다른 문법을 사용하는 경우 존재
- ORM 을 이용해서 복잡한 호출을 하면 성능이 좋지 않을 수 있음
  - Explain 을 사용해서 비용을 측정한 결과 ORM 이 성능이 더 떨어짐

## 1-4) ORM 의 장점
- 하나의 소스 코드를 이용해서 여러 데이터베이스로 쉽게 교체가 가능하다
- 중복 코드를 방지할 수 있다
- SQL 인젝션 취약점으로부터 보호할 수 있다
- 모델 유효성 검사를 지원한다
- 타입스크립트를 지원한다

# 2. Auth.js
- next-auth 의 경우 /api/auth 로의 API 요청을 Next-Auth 가 처리할 수 있도록 세팅할 수 있다
- adapter : 데이터를 저장하는데 사용할 데이터베이스 또는 백엔드 시스템에 어플리케이션을 연결하는 역할을 한다
- providers : 어떠한 로그인을 사용할 것인지를 결정한다. 기본 로그인, 소셜 로그인 등
  - Provider 를 만들 때마다 next-auth 에서 자동으로 생성해주는 로그인 화면이 커스터마이징된다

## 2-1) Client 컴포넌트로 유저 정보 Session 저장하기
- next-auth 에서 제공해주는 <SessionProvider></SessionProvider> 를 RootLayout 에서 감싸준다
  - 단 use client 를 사용해야 함
- useSession() 을 활용해 로그인된 유저 정보를 어디서든 가져올 수 있다
- 로그인, 로그아웃 하는 UI 도 자동으로 만들어준다

## 2-2) 로그인한 사람만 들어가는 페이지
- middleware.ts 를 참고
- config 로 로그인한 사람만 들어갈 수 있는 페이지를 배열에 담을 수 있다
  - 만약 로그인을 하지 않았는데 해당 페이지에 접근하면 로그인 페이지로 넘어가게 만든다.
- 단, env 에 NEXTAUTH_URL 에 도메인을, NEXTAUTH_SECRET 에 아무 string 이나 넣어줘야 함

## 2-3) 각 User Type 마다 권한 다르게 부여하기
- middleware 함수를 만들어서 navigation guard 처리를 할 수 있음
  - "next-auth/jwt" 모듈에서 getToken() 을 가져오면 사용자의 토큰 정보를 알 수 있음 
  - req.nextUrl.pathname 을 활용하면 현재 사용자가 접근하고자 하는 경로를 알 수 있음
  - 위 두가지를 활용해 navigation guard 를 설정해주는 것
- NextResponse 를 활용해서 redirection 해주면 된다

## 2-4) User 타입 정보
- 만약에 유저 정보에서 auto complete 되는 타입과 다른 타입을 사용하거나 수정해야한다면?
- src/types 에 next-auth.d.ts 를 사용해 선언적으로 type 을 변경해야 한다

## 2-5) 서버 컴포넌트 살리며 User 정보 가져오기
- 일전에는 <SessionProvider></SessionProvider> 와 useSession 을 사용해서 유저 정보를 가져왔다
  - Root Layout 에서부터 use client 를 사용해야만 유저 정보를 갖고 올 수 있었음
- 하지만, 이제는 getServerSession 이라는 Hooks 를 제공해주고 있어서 이를 사용해 서버컴포넌트에서도 유저 정보를 가져올 수 있다

# 3. Prisma Pagination
- 페이지네이션 방법에는 두 가지가 있음
- 이번 프로젝트에서는 Offset Pagination 을 사용함

# 4. 채팅을 구현하는 방법
- http polling, websocket, redis, pusher 라이브러리 등등 다양한 방법이 존재
- 이번 프로젝트에서는 http polling 방식을 사용

## 4-1) RestAPI vs Websocket
- 실시간 통신을 할 때 Websocket 을 사용함
- Reset 는 복잡한 네트워크에서 통신을 관리하기 위한 지침. 
  - 이 지침을 잘 지켰을 때 Restful 하다고 표현
  - 단방향 통신.
  - 클라이언트는 최초에만 데이터를 수신하며 이후에는 데이터를 보내는 것만 가능. 
- Websocket 은 양방향 통신

## 4-2) Polling, LongPolling
### Polling
- Rest 를 이용해서 실시간으로 정보를 받는 듯한 방식
- 클라이언트가 일정한 간격으로 서버에 요청을 보내서 결과를 전달받는 방식
- 구현은 쉽지만 서버의 상태가 변하지 않았을 때도 계속 요청을 보냄
  - 요청 간격을 어떻게 정하는지에 대한 문제
  - 간격이 짧으면 서버 성능에 부담되고, 길면 실시간성이 좋지 않음

### LongPoling
- Polling 의 단점으로 인해 새롭게 고안해낸 방식
- Polling 과 마찬가지로 계속 요청을 보내지만,
- LongPolling 은 요청을 보내면 서버가 대기하고 있다가 이벤트가 발생하거나 타임아웃이 발생할 대까지 기다린 후에 응답을 보냄
  - 서버의 상태 변화가 많이 없다면 폴링 방식보다 서버의 부담을 줄이게 됨
  - 이런 특징으로 LongPolling 은 실시간 메시지 전달이 중요하지만, 서버 상태 변화가 자주 발생하지 않는 서비스에 적합
  
## 4-3) Streaming
- 클라이언트에서 서버에 요청을 보내고 끊기지 않는 연결상태에서 데이터를 계속 수신하는 것
- 양방향 소통보다는 서버에서 계속 요청을 받을 때 유용하다

## 4-4) Http 통신 방법과 WebSocket 의 차이
- Websocket 은 처음에 Handshake를 위해서만 HTTP 프로토콜을 이용하고, 이후부터는 독립적인 ws 를 사용한다
- HTTP 요청은 응답이 온 후 연결이 끊기지만 Websocket 은 Handshake 가 완료되고 임의로 연결을 끊기 전까지는 계속 연결된다
