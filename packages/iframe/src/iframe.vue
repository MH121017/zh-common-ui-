<template>
  <div
    v-loading="loading"
    element-loading-background="#fff"
    style="width：100%；height:100%;"
  >
    <iframe
      ref="iframe"
      :height="height"
      :width="width"
      :scrolling="scrolling"
      :src="iframeSrc"
      @hashchange="onbeforeprint"
      @load="onload"
      @error="onerror"
      frameborder="0"
    ></iframe>
  </div>
</template>
<script>
export default {
  name:"zhIframe",
  props: {
    iframeSrc: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: "100%"
    },
    width: {
      type: String,
      default: "100%"
    },
    scrolling: {
      type: String,
      default: "auto"
    }
  },
  data() {
    return {
      loading: true
    };
  },
  watch: {
    iframeSrc: {
      handler(val) {
        if (val) {
          this.loading = true;
        }
      },
      immediate: true
    }
  },
  methods: {
    onbeforeprint() {
      console.log("iframe before");
    },
    onload() {
      this.loading = false;
      console.log("iframe load");
    },
    onerror(error) {
      this.loading = false;
      console.log("error", error);
    }
  }
};
</script>
