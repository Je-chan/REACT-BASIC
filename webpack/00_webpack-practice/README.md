# 1. Webpack Loader
- 로더는 웹팩이 웹 애플리케이션을 해석할 때 자바스크립트 파일이 아닌 자원을 변활할 때 도움을 준다.
  - HTML, CSS, Images, 폰트 등
- style-loader, css-loader, less-loader, sass-loader, postcss-loader, stylus-loader 등이 존재

## 1-1) css-loader
- @import, url() 을 import/require() 처럼 해석한다
- React 를 사용했을 때 CSS 를 작성하고 자바스크립트에 가져와서 사용할 때 import 로 CSS 파일을 가져온다.
  - 즉, css 파일을 하나의 모듈로 취급해 JS 파일에서 가져온다는 것.

## 1-2) style-loader
- css-loader 를 이용해 의존성 트리에 추가하고 css 에 작성한 string 값들을 style-loader 를 이용해 DOM <style></style> 에 넣는다
- css-loader 가 먼저 작동하고, 그 값들을 style-loader 로 DOM 에 넣는 것
  - rules 에서 명시한 index 의 역순으로 작동한다.

## 1-3) rules > test, use
![img.png](./assets/img.png)
- test : 로더를 적용할 파일 유형 (일반적으로 정규 표현식을 사용)
- use : 해당 파일에 적용할 로더의 이름. 배열 안에 있는 값들의 역순으로 로더들이 동작한다.

# 2. Webpack Plugin
- 플러그인은 로더가 할 수 없는 다른 작업을 수행
- 로더는 모듈을 Output 으로 만드는 과정에서 사용
- 플러그인은 Webpack 으로 변환한 파일에 추가적인 기능을 더하고 싶을 때 사용
  - 최종적인 결과물을 변형시키는 것
- 플러그인은 웹팩의 기본적인 동작에 추가적인 기능을 제공한다

## 2-1) HTML Webpack Plugin
- webpack 이 html 파일을 읽어서 html 파일을 빌드할 수 있게 한다.

# 3. Webpack Caching
- 웹팩 컴파일로 생성된 파일에서 변경된 내용이 없으면 브라우저는 캐시 상태를 유지하고 그대로 사용한다.
- 브라우저가 변경 사항을 확인하는 방법 중 하나는 파일 이름. 
  - 파일을 생성할 때 해시값을 줄 수 있다.
  - output 에 파일 name 을 바꿔주면 됨.
  - `clean: true` 를 해주면 기존에 빌드된 파일을 없앤다.