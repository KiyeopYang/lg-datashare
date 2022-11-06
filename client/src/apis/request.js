import axios from 'axios';

const request = axios.create({
  baseURL: 'https://dsapis.tosky.co.kr/dev/v1',
});

export default request;
