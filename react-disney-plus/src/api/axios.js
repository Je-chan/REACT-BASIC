import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.AXIOS_BASE_URL,
  params: {
    api_key: process.env.AXIOS_API_KEY,
    language: 'ko-kr',
  },
});

export default instance;
