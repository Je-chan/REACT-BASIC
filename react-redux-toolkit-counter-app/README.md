# Redux Toolkit APUIs

## (1) 세팅하는 방법
### (1-1) 기존 방식
1. store 생성
   - createStore 를 사용하여 store 생성

2. action 생성
   - 액션 타입 상수와 액션 생성자 함수를 분리하여 선언

```tsx
const INCREMENT = 'counter/increment'

function increment(amount: number) {
	return {
		type: INCREMENT,
		payload: amount
	}
}

const action = increment(10)
```

3. reducer 함수
```tsx
const initialState = {value: 0}

function counterReducer(state = initialState, action) {
	switch(action.type) {
		// ...
	}
}
```


### (1-2) toolkit
1. store 생성
   - configureStore 를 사용하여 store 생성

2. action 생성
   - 액션 타입 상수와 액션 생성자 함수 생성을 createAction 함수 하나로 처리
     - createAction 은 type만 넣으면 자동으로 해당 타입을 가진 action creator 함수를 생성
     - 생성된 함수를 호출할 때, 인수를 추가로 넣으면 이 값은 payload 의 프로퍼티 값으로 들어가게 됨
```tsx
import {createAction} from '@reduxjs/toolkit'

const increment = createAction<number>('counter/increment')

const action = increment(10)
```

3. reducer 생성
   - createReducer 에서 Action 을 처리하기 위해 케이스 리듀서를 정의하는 방법은 두 가지
     - builder 콜백
     - map 객체
   - 타입 스크립트 호환성의 측면에서 builder 콜백이 더 선호됨
   - builder 콜백 함수의 method
     1. addCase(actionCreator, reducer) 
        - 액션타입과 정확히 매핑되는 케이스 리듀서를 추가하여 액션을 처리함
        - addMatcher 또는 addDefaultCase 보다는 선행돼야 함
     2. addMatcher(matcher, reducer)
        - 새로 들어오는 모든 액션에 대해 주어진 패턴과 일치하는지 확인 후 reducer 실행
     3. addDefaultCase(reducer)
        - 다른 케이스 리듀서나 매치 리듀서가 존재하지 않았을 경우 실행
```tsx
// (1) addCase
import {createAction, createReducer} from '@reduxjs/toolkit'

interface CounterState {
	value: number;
}

const increment = createAction('counter/increment')
const decrement = createAction('counter/decrement')

const initialState = {value: 0} as CounterState

const counterReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(increment, (state, action) => {
			state.value++
		})
		.addCase(decrement, (state, action) => {
			state.value--
		})
})

// (2) addMathcer
const initialState2 = {}
const resetAction = createAction('reset-tracked-loading-state')

function isPendingAction(action) {
	return action.type.endsWith('/pending')
}

const reducer = createReducer(initialState, (builder) => {
	builder
    .addCase(resetAction, () => initialState)
    // 주어진 패턴에 맞는 것을 처리하는 
    .addMathcer(isPendingAction, (state, action) => {
			state[action.meta.requestId] = 'pending'
    })
    .addMatcher(
      (action) => action.type.endswith('/rejected'),
      (state, action) => {
				state[action.meta.requestId] = 'rejected'
      }
    )
    .addMatcher(
      (action) => action.type.endswith('/fullfilled'),
      (state, action) => {
        state[action.meta.requestId] = 'fullfilled'
      }
    )
})
```
4. createSlice()
   - Redux 로직을 작성하기 위한 표준 접근 방식
   - createSlice 내부에서는 createAction 과 createReducer 를 모두 사용하고 있다
   - reducer 의 함수의 대상인 초기 상태(Initial State) 와 "slice 이름"을 받는다
   - 리듀서와 상태에 해당하는 액션 생성자와 액션 타입을 자동으로 생성하는 함수

```tsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {value: 0}

// createSlice 는 단일 구성 객체 매개변수를 갖는다.
const counterSlice = createSlice({
  name: 'counter',
  // case reducer 함수들의 객체
  // >> 이 객체의 key 값은 `${slice_이름}${key_값}` 으로 상수를 생성하는데 사용된다
  // >> 즉, 아래의 reducer 액션의 타입은 'counter/increment', 'counter/decrement' 가 된다
  // >> 이후, 이에 상응하는 액션 타입을 가진 액션이 디스패치되면 리듀서가 실행된다
  reducers: {
		increment(state) {
			state.value++
    },
    decrement(state) {
			state.value--
    }
  }
})

export const {increment, decrement} = counterSlice.actions
export default counterSlice.reducer
```

## (2) Action Customizing
- 일반적으로 액션 생성자 함수를 호출해 액션 생성 시에는 단일 인자를 받아서 payload 를 새엇ㅇ함
```tsx
import{ createAction } from '@reduxjs/toolkit'

const increment = createAction<number>('counter/increment')

const action = increment(10)
// {type: 'counter/increment', payload: 10}
```
- 이 상황에서 사용자 정의 값을 추가하고 싶다면 prepare callback 함수를 이용하면 된다
```tsx
import {createAction, nanoid} from '@reduxjs/toolkit'

const addTodo = createAction('todos/add', function prepare(text) {
	return {
		payload: {
			text,
      id: nanoid(),
      createdAt: new Date().toISOString()
    }
  }
})

console.log(addTodo('DEVELOP'))
/**
 * {
 *    type : 'todos/add',
 *    payload: {
 *      text: 'DEVELOP',
 *      id: '~~~',
 *      createdAt: '~~~';
 *    }
 * }
 */
```
- 위의 상황을 createSlice 를 이용하면 다음과 같아진다
  - reducer 와 prepare 를 구분하기 위해서 addTodo 를 바로 함수로 만드는 것이 아니라 객체로 만든다.
```tsx
import {createSlice} from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
		addTodo: {
			reducer: (state, action) => {
				state.push(action.payload)
      },
			prepare: (text) => {
				const id = nanoId();
				return {
					payload: {
					  text,
            id,
            createdAt: new Date().toISOString()
          }
				}
      }
    }
  }
})
```

## (3) extraReducers()
- extraReducers 를 사용하면 createSlice 가 생성한 action type 이외의 다른 action type 에 응답할 수 있게 된다
- 보통 extraReducers 로 지정된 케이스 리듀서는 외부 액션을 참조하기 위한 것
  - slice.actions 에서 생성된 액션을 가지고 있지 않을 것

```tsx
import {createSlice} from "@reduxjs/toolkit";
import {incrementByAmount, decrementByAmount} from "./counterSlice";


const counter = createSlice(
  {
    name: 'counter',
    initialState: 0,
    reducers: {
      increment: (state) => state + 1,
      decrement: (state) => state - 1,
    },
    extraReducers: (builder) => {
      builder
        .addCase(incrementByAmount, (state, action) => {
          return state + action.payload
        })
        .addCase(decrementByAmount, (state, action) => {
          return state - action.payload
        })
    }
  }
)
```

## (4) createAsyncThunk
- createAction 의 비동기 버전
```tsx
createAsyncThunk: (type, payloadCreator, options);
```
- 첫 번째 인자로 받는 type 은 비동기 요청의 생명 주기를 나타내는 추가 Redux action type 상수를 생성하는 데 사용되는 문자열
  - 예를 들어 users/requestStatus 로 인자를 줬으면 비동기 요청 생명주기마다 아래의 action type 을 생성한다
  - pending 상태 : 'users/requestStatus/pending'
  - fulfilled 상태 : 'users/requestStatus/fulfilled'
  - rejected 상태 : 'users/requestStatus/rejected'
- 두 번째 인자로 받는 payloadCreator 는 promise 를 반환하는 callback 함수다
  - 이 callback 함수에서 두 번째로 받는 인자 thunkAPI 는 일반적으로 Redux 썽그 함수에 전달되는 모든 매개변수와 추가 옵션을 포함하는 객체
  - dispatch : Redux 스토어 dispatch 메서드
  - getState : Redux 스토어 getState 메서드
  - extra : 설정 시, 썽크 미들웨어에 제공되는 추가 인수
  - requestId : 이 요청 시퀀스를 식별하기 위해 자동으로 생성된 고유 문자열 ID
  - signal : 앱 로직의 다른 부분이 이 요청을 취소가 필요한 것으로 표시했는지 확인
    - new AbortController() 의 signal 을 받아서 비동기 요청을 중단하는데 사용되기도 함 
  - rejectWithValue(value, [meta]) : 정의된 페이로드 및 메타와 함께 거부된 응답을 반환하기 위해 작업 생성자에서 반환할 수 있는 유틸리티 함수
  - fulfillWithValue(value, meta) 
```tsx
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const fetchUserId = createAsyncThunk(
  'users/fetchById',
  async (userId, thunkAPI) => {
		try {
			const res = await userAPI.fetchById(userId)
      return res.data
    } catch(err) {
			console.error(err.response.data)
      return rejectWithValue({id: null});
    }
      
  }
)

const userSliceId = createSlice({
  reducers: {
		// 일반적인 reducer 로직을 작성
  },
  extraReducers: (builder) => {
		builder
      .addCase(fetchUserById.pending, (state, action) => {
		  	// ... 대기
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
				state.entities.push(action.payload)
				// ... 성공
      })
      .addCase(fetchUserById.rejected), (state, action) => {
        // ... 에러
        console.log(action.payload) // {id: null}  
    }
  }
})
```

## (5) cancellation()
- 비동기 요청을 보내다가 취소하는 것
