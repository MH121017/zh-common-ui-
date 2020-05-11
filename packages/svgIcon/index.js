import svgIcon from './src/svgIcon.vue';

svgIcon.install = function(Vue) {
  Vue.component(svgIcon.name, svgIcon)
}

export default svgIcon