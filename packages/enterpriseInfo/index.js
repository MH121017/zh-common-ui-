import enterpriseInfo from './src/enterpriseInfo.vue';

enterpriseInfo.install = function(Vue) {
  Vue.component(enterpriseInfo.name, enterpriseInfo)
}

export default enterpriseInfo