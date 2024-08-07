import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { applyMiddleware, createStore } from "redux";
import rootReducer from "./reducers";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
  console.log("STORE : ", store);
  console.log("ACTION : ", action);
  next(action);
};

const customMiddleWare = applyMiddleware(thunk, loggerMiddleware);

const store = createStore(rootReducer, customMiddleWare);

const render = () =>
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App
          onIncrement={() => store.dispatch({ type: "INCREMENT" })}
          onDecrement={() => store.dispatch({ type: "DECREMENT" })}
        />
      </Provider>
    </React.StrictMode>,
  );

render();

store.subscribe(render);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
