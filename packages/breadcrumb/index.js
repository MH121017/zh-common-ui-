import breadcrumb from './src/breadcrumb.vue';

breadcrumb.install = function(Vue) {
  Vue.component(breadcrumb.name, breadcrumb)
}

export default breadcrumb