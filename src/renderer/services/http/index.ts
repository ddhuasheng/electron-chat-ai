import axios, { type AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/",
  timeout: 200000,
});

instance.interceptors.request.use(
  (req) => {
    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use((res) => {
  return res.data;
});

type Method = 'get' | 'post' | 'put' | 'delete' | 'options';
type RequestMethod = {
  [K in Method]?: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>
}
type Request = <T>(config: AxiosRequestConfig) => Promise<T> 

const request: Request & RequestMethod = async <T>(config: AxiosRequestConfig) => {
  return await instance<null, T>(config);
};

const methods: Method[] = ['get', 'post', 'put', 'delete', 'options']

methods.forEach((method) => {
  request[method] = <T>(url: string, config: AxiosRequestConfig = {}) => {
    return request<T>(Object.assign(config, { method, url }))
  }
})

export { request };
