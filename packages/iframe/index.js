import iframe from './src/iframe.vue';

iframe.install = function(Vue) {
  Vue.component(iframe.name, iframe)
}

export default iframe