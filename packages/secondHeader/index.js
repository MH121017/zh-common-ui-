import secondHeader from './src/secondHeader.vue';

secondHeader.install = function(Vue) {
  Vue.component(secondHeader.name, secondHeader)
}

export default secondHeader