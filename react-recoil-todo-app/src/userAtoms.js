import { atom, selector } from "recoil";
import axios from "axios";

export const currentUserIdState = atom({
  key: "currentUserIdState",
  default: 1,
});

export const currentUserNameQuery = selector({
  key: "currentUserName",
  get: async ({ get }) => {
    const path = "https://jsonplaceholder.typicode.com/users/";
    console.log(path);
    const response = await axios.get(`${path}${get(currentUserIdState)}`);
    console.log(response);
    return response.data.name;
  },
});
