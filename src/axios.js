import axios from "axios";

const instance = axios.create({
  baseURL: "http://139.59.235.133:80/api/",
});

export default instance;
