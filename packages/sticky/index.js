import sticky from './src/sticky.vue';

sticky.install = function(Vue) {
  Vue.component(sticky.name, sticky)
}

export default sticky