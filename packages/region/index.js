import region from './src/region.vue';

region.install = function (Vue) {
  Vue.component(region.name, region)
}

export default region