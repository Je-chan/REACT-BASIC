# 1. Next.js 란?
- React 의 SSR 을 쉽게 구현할 수 있게 도와주는 프레임워크
- 검색엔진 최적화에 좋은 영향
	- Pre-Rendering 을 통해 페이지를 미리 렌더링하여 완성된 HTML 파일을 가져옴
	- 사용자와 검색 엔진 크롤러에게 바로 렌더링된 페이지를 전달할 수 있게 된다
- 리액트에서도 SSR 을 구현할 수는 있지만 복잡하기에 Next.js 를 활용해 쉽게 구현

## (1-1) SSR
- 클라이언트 대신 서버에서 페이지를 준비하는 원리
- 리액트에서 원래 CSR 하기 때문에 서버에 영향을 미치지 않고, 서버에서 클라이언트로 응답을 보낸 HTML 도 거의 비어있다
### CSR 의 문제점
1. 서버에서 데이터를 가져올 때 지연시간을 발생시킨다
2. 검색 엔진에 검색 시 웹 크롤링이 동작할 때 내용을 제대로 가져와 읽을 수 없다

### Next.js
- 서버사이드 렌더링을 이요해서 사용자와 검색 엔진 크롤러에게 바로 렌더링된 페이지를 전달할 수 있다.

# 2. Pre-rendering
- Next.js 는 모든 페이지를 pre-render 한다.
- 모든 페이지를 위한 HTML 을 Client 사이드에서 자바스크립트로 처리하기 전에 생성한다는 것
  - 이렇게 하기 때문에 SEO 에 좋다
 
# 3. Data Fetching
- Next.js 에서 데이터를 가져오는 방법은 여러가지가 존재
- 보통 리액트에서 데이터를 가져올 때는 useEffect 안에서 가져오지만 Next.js 는 여러 방법이 존재한다


## (3-1) getStaticProps
- Static Generation
- 빌드할 때 데이터를 불러 온다 (미리 만들어 줌)
```typescript jsx
export async function getStaticProps(context) {
	return {
		props: {} 
	}
}
```
- async 로 export 해주면, getStaticProps 에서 리턴되는 props 를 가지고 페이지를 pre-render 한다.
  - build 하는 time 에 페이지를 렌더링한다
### 사용 시기
- 페이지를 렌더링하는 데 필요한 데이터는 사용자의 요청보다 먼저 build 시간에 필요한 데이터를 가져올 때
- Headless CMS 에서 데이터를 가져올 때
- 데이터를 공개적으로 캐시할 수 있을 때(사용자 별 아닌 경우)
- 페이지는 미리 렌더링돼야 하고(SEO 의 경우) 매우 빨라야 할 때
  - getStaticProps 는 성능을 위해 CDN 에서 캐시할 수 있는 HTML 및 JSON 파일을 생성한다


## (3-2) getStaticPaths
- Static Generation 
- 데이터에 기반하여 pre-render 시 특정한 동적 라우팅을 구현한다
  - /pages/post/[id].js
```typescript jsx
export async function getStaticPaths() {
	return {
		paths: [
			{
				params: {...}
			}
		],
		fallback: true // false or 'blocking'
	}
}
```
- 동적 라우팅이 필요할 때 getStaticPaths 로 경로 리스트를 정의하고, HTML 에 build 시간에 렌더링된다.
- Next.js 는 pre-render 에서 정적으로 getStaticPaths 에서 호출되는 경로들을 가져온다.

### paths 
- 어떠한 경로가 pre-render 될지를 결정한다
- 만약 pages/posts/[id].js 라는 이름의 동적 라우팅을 사용하는 페이지가 있다면 아래처럼 된다
```typescript jsx
return {
	paths: [
		{params : {id: '1'}},
		{params : {id: '2'}},
	],
	fallback: true
}
```
- 이렇게 만들어주면 빌드하는 동안 pages/posts/1 과 pages/posts/2 의 페이지를 생성하게 된다

### params
- 페이지 이름이 pages/posts/[postId]/[commentId] 라면, params 는 postId 와 commentId 가 된다
- 만약 페이지 이름이 pages/[...slug] 와 같이 모든 경로를 사용한다면, params 는 slug 가 담긴 배열이돼야 한다
  - ['postId', 'commentId']

### fallback
- false 라면 getStaticPaths 로 리턴되지 않는 것은 모두 404 페이지가 된다
- true 라면 getStaticPaths 로 리턴되지 않는 것은 404로 뜨지 않고, fallback 페이지가 뜨게 된다

## (3-3) getServerSideProps
- Server Side Rendering
- 요청이 있을 때 데이터를 불러온다.
```typescript jsx
export async function getServerSideProps(context) {
	return {
		props: {}
	}
}
```
- getServerSideProps 함수를 async 로 export 하면, Next 는 각 요청마다 리턴되는 데이터를 getServerSideProps 로 pre-render 한다
- 요청을 보낼 때마다 데이터를 가져오는 것
- 모든 요청때마다 데이터를 가져오게 된다
	- 빌드될 때마다 만들어지는 것이 아님

### 사용시기
- 요청할 때 데이터를 가져와야 하는 페이지를 미리 렌더해야 할 때 사용한다
- 단, getStaticProps 보다는 느림
  - 서버가 모든 요청에 대한 결과를 계산하고, 추가 구성 없이 CDN 에 의해 결과를 캐시할 수 없기 때문