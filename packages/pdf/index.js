import pdf from './src/pdf.vue';

pdf.install = function(Vue) {
  Vue.component(pdf.name, pdf)
}

export default pdf