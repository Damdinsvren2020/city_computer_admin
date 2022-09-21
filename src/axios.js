import axios from "axios";
// import { host } from "./CDNURL";

const instance = axios.create({
  // baseURL: `http://${host}:80/api/`,
  baseURL: `http://134.209.101.168:80/api/`,
});

///134.209.101.168

export default instance;
