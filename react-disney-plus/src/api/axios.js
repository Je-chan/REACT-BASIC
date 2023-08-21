import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_AXIOS_BASE_URL,
  params: {
    api_key: process.env.REACT_APP_AXIOS_API_KEY,
    language: 'ko-kr',
  },
});

export default instance;

/**
 * 동기 : 어떤 요청이 오면 그 요청을 모두 처리한 후, 다음 요청을 처리하는 것
 * 비동기 : 요청이 들어오면, 아직 응답을 받지 않더라도, 그 다음 요청을 받아서 처리하는 것
 */
