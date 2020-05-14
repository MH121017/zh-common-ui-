// 导入组件
import blockHeader from './blockHeader/index' // 块级区域头
import breadcrumb from './breadcrumb/index'
import companyPerson from './companyPerson/index' // 选择企业人员
import compreSearch from './compreSearch/index' // 公共查询组件
import enterpriseInfo from './enterpriseInfo/index'
import hamburger from './hamburger/index'
import industry from './industry/index'
import nationalIndustriesClassificaton from './nationalIndustriesClassificaton/index' // 国民经济分类
import persionnel from './persionnel/index' // 选择人员
import pictureVideoPlay from './pictureVideoPlay/index' // 图片视频播放组件
import pictureVideoUpload from './pictureVideoUpload/index' // 图片视频上传组件
import region from './region/index' // 区域组件
import sticky from './sticky/index' // 悬浮
import svgIcon from './svgIcon/index' // svg图标组件
import treeCheckbox from './treeCheckbox/index' // 树形多选组件
import treeDropDown from './treeDropDown/index' // 树形下拉组件
import videoPlayer from './videoPlayer/index' // 视频播放组件

import { setValue } from './utils/auth'

// 存储组件列表
const components = [
	blockHeader,
	breadcrumb,
	companyPerson,
	compreSearch,
	enterpriseInfo,
	hamburger,
	industry,
	nationalIndustriesClassificaton,
	persionnel,
	pictureVideoPlay,
	pictureVideoUpload,
	region,
	sticky,
	svgIcon,
	treeCheckbox,
	treeDropDown,
	videoPlayer,
]
// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function(Vue, opts = {}) {
	// 判断是否安装
	if (install.installed) return
	// 注册全局组件
	Vue.prototype.$SAFETYUI = {
		url: opts.url || '',
	}
	console.log('store', Vue)

	// Object.keys(opts.store.state).forEach( key => {
	//   opts.store.registerModule(key,opts.store.state[key])
	// })

	setValue('safetyUIUrl', opts.url || '')
	// 遍历注册全局组件
	components.forEach((component) => {
		Vue.component(component.name, component)
	})
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
	console.log('component', window.Vue)

	install(window.Vue)
}

export default {
	// 导出的对象必须具有 install, 才能被 Vue.use() 方法安装
	install,
	// 一下是具体的组件列表
	...components,
}
