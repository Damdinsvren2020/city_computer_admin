import axios from "axios";

const instance = axios.create({
  baseURL: "http://103.29.144.253:8083",
});

export default instance;
