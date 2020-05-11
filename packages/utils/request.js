import { getToken, getValue } from "./auth";

const Vue = window.Vue
const axios = window.Axios

// 创建axios实例
const service = axios.create({
  baseURL: (Vue.prototype.$SAFETYUI || {}).url || getValue('safetyUIUrl') || "http://218.60.145.28:8080/safety", // api的base_url
  timeout: 60000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
      config.headers["access_token"] = "" + getToken(); // 让每个请求携带自定义 token 请根据实际情况自行修改
    if (config.params && config.params.constructor === String) {
      config.url += "?" + config.params;
      config.params = null;
    }

    return config;
  },
  error => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.log("err:" + error); // for debug
    Message({
      message: "请求失败",
      type: "error",
      duration: 3 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
