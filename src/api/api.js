import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5134",
});

export default api;
