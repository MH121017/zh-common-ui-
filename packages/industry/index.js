import industry from './src/industry.vue';

industry.install = function(Vue) {
  Vue.component(industry.name, industry)
}

export default industry