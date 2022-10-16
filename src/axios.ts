import { BASE_URL } from "@env";
import axios from "axios";

export default axios.create({
  baseURL: BASE_URL,
});
