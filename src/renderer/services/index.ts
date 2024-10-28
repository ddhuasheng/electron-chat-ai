import axios, { type AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1/",
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
    return request<T>(Object.assign({}, config, { method, url }))
  }
})

const getRequest = <T>(url: string, config: AxiosRequestConfig = {}) => {
  return request<T>(Object.assign({}, config, { method: 'get', url }))
}

const postRequest = <T>(url: string, config: AxiosRequestConfig = {}) => {
  return request<T>(Object.assign({}, config, { method: 'post', url }))
}

const putRequest = <T>(url: string, config: AxiosRequestConfig = {}) => {
  return request<T>(Object.assign({}, config, { method: 'put', url }))
}

const deleteRequest = <T>(url: string, config: AxiosRequestConfig = {}) => {
  return request<T>(Object.assign({}, config, { method: 'delete', url }))
}

const optionsRequest = <T>(url: string, config: AxiosRequestConfig = {}) => {
  return request<T>(Object.assign({}, config, { method: 'options', url }))
}


export { request, getRequest, postRequest, putRequest, deleteRequest, optionsRequest };
