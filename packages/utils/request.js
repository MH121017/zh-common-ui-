import { getToken, getValue } from './auth'

const axios = window.Axios
function axiosCreate() {
  let service = {}
	// 判断是否安装

	// 创建axios实例
	service = axios.create({
		baseURL:
			getValue('safetyUIUrl') ||
			'http://218.60.145.28:8080/safety', // api的base_url
		timeout: 60000, // 请求超时时间
	})

	// request拦截器
	service.interceptors.request.use(
		(config) => {
			config.headers['access_token'] = '' + getToken() // 让每个请求携带自定义 token 请根据实际情况自行修改
			if (config.params && config.params.constructor === String) {
				config.url += '?' + config.params
				config.params = null
			}

			return config
		},
		(error) => {
			Promise.reject(error)
		}
	)

	service.interceptors.response.use(
		(response) => {
			return response.data
		},
		(error) => {
			console.log('err:' + error) // for debug
			Promise.reject(error)
		}
	)
	return service
}

export default axiosCreate()
