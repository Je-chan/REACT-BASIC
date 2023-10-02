import React, { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { fetchUserAsync, incrementAsync } from "./counterSlice";

function Test() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(incrementAsync(10));

    const promiseUser = dispatch(fetchUserAsync());

    return () => {
      // abort 를 사용하면 Thunk 를 실행 중에 중지 시키는 것.
      // >> 단, 아무런 옵션을 주지 않으면 비동기 요청이 중지되지는 않음. 데이터는 다 받아오지만 state 가 저장되지 않을 뿐ㄴ
      promise.abort();

      // >> thunkAPI 의 signal 에 addEventListner 로 AbortController 의 abort 기능을 넣어
      // >> axios 의 signal 에 해당 시그널을 넣어주면 canceled 가 잘 된다.
      promiseUser.abort();
    };
  }, []);

  return <div>TEST</div>;
}

export default Test;
