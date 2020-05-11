import pictureVideoUpload from './src/pictureVideoUpload.vue';

pictureVideoUpload.install = function(Vue) {
  Vue.component(pictureVideoUpload.name, pictureVideoUpload)
}

export default pictureVideoUpload