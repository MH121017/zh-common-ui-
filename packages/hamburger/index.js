import hamburger from './src/hamburger.vue';

hamburger.install = function(Vue) {
  Vue.component(hamburger.name, hamburger)
}

export default hamburger