import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:5000/",
  timeout: 200000,
});

request.interceptors.request.use(
  (req) => {
    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);

request.interceptors.response.use((res) => {
  return res.data;
});

export { request };
