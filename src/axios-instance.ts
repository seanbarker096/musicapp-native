import { BASE_URL } from '@env';
import axios from 'axios';

console.log(BASE_URL);

const appAxios = axios.create({
  baseURL: BASE_URL,
});

appAxios.defaults.headers.post['Content-Type'] = 'application/json';

export default appAxios;
