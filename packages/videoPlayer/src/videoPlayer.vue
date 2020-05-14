<template>
  <video
    ref="videoPlayBackPlugin"
    class="video-js vjs-default-skin w-100 h-100"
  >
    <source ref="videoPlayBackPluginSource" />
  </video>
</template>
<script>
export default {
  name: 'zhVideoPlayer',
  props: {
    options: {
      type: Object,
      default: function() {
        return {
          //   // 强制flash播放
          //   techOrder: ['flash'],
          //   flash: {
          //     hls: {
          //       withCredentials: false
          //     }
          //   },
          //   sources: [{ src: 'https://mister-ben.github.io/videojs-flvjs/bbb.flv', type: 'video/flv' }],
          //   notSupportedMessage: '此视频暂无法播放，请稍后再试',
          //   // 确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
          //   controls: true,
          //   // 自动播放属性,muted:静音播放
          //   // autoplay: 'muted',
          //   // 建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
          //   preload: 'auto',
          //   // 设置视频播放器的显示宽度（以像素为单位）
          //   width: '100%',
          //   // 设置视频播放器的显示高度（以像素为单位）
          //   height: '100%',
          //   // 封面图
          //   poster: ''
        }
      }
    }
  },
  data() {
    return {
      player: null
    }
  },
  watch: {
    options: {
      deep: true,
      handler: function() {
        this.player.src(this.options.sources[0].src)
        this.player.pause()
        this.player.load()
      }
    }
  },
  mounted() {
    //

    this.player = this.$video(this.$refs.videoPlayBackPlugin, this.options)
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
<style lang="scss">
.video-js {
  .vjs-big-play-button {
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%);
  }
}
</style>
