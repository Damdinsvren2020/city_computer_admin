import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:80/api/",
});

///139.59.235.133

export default instance;
