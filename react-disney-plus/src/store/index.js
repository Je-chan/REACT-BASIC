import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist/es/constants";

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedRootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      /**
       * serializableCheck
       * - action 에 직렬화가 불가능한 값을 전달했을 때 에러가 나는 것을 방지함
       * - serialize : Object 값을 string 으로 전환 (JSON.stringify)
       * - deserialize : string 값을 Object 값으로 전환 (JSON.parse)
       * - Redux 는 state, action 에 직렬화가 불가능한 값을 전달할 수 없는데 전달하려고 해서 나온 에러
       *  - 그래서 위 에러를 처리하기 위해 직렬화가 불가능한 값 전달을 허락하면 됨
       * - 직렬화가 불가능한 값은 다음과 같음
       *  - Promise, Symbol, Map, Set, Function, Class Instance 등
       *  - redux-persist 에서는 register, rehydrate 등 함수가 들어가기 때문에 문제가 발생하게
       */
      serializableCheck: {
        // redux-persist 에서 발생하는 action 만 직렬화가 되지 않아도 동작하게 만드는 것
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

/**
 * 왜 Redux 는 직렬화가 가능한 값만 허용하는가?
 * - 리덕스는 순수함수를 지향하고 예측 가능한 형태로 동작하거나 Time Travel 기능(복원 기능)을 추구함
 * - 때문에 직렬화가 가능한 값만 저장하는 것을 추천한다
 * - 리덕스가 데이터 변화를 감지할 때 직렬화 가능하지 않은 데이터를 이용할 때 에러가 발생하게 됨
 * - 직렬화 가능하지 않은 데이터를 스토어에 두면 State 를 Mutate 할 가능성이 많아
 */
