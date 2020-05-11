import compreSearch from './src/compreSearch.vue';

compreSearch.install = function(Vue) {
  Vue.component(compreSearch.name, compreSearch)
}

export default compreSearch