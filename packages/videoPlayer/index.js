import videoPlayer from './src/videoPlayer.vue';

videoPlayer.install = function(Vue) {
  Vue.component(videoPlayer.name, videoPlayer)
}

export default videoPlayer