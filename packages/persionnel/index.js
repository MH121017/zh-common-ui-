import persionnel from './src/persionnel.vue';

persionnel.install = function (Vue) {
  Vue.component(persionnel.name, persionnel)
}

export default persionnel