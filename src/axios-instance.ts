import { BASE_URL } from '@env';
import axios from 'axios';

console.log(BASE_URL);
export default axios.create({
  baseURL: BASE_URL,
});
