<template>
  <div :class="[noDivider ? 'border-bottom-1px' : '', 'second-header bg-white']">
    <span
      :class="[
        'second-header--title',
        type ? 'second-header--title__' + type : '',
        size ? 'font-' + size : ''
      ]"
    >{{ label }}</span>
    <div class="flex-grow-1">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "secondHeader",
  props: {
    type: {
      type: String,
      default: "default"
    },
    size: {
      type: Number,
      default: 14
    },
    label: {
      type: String,
      default: ""
    },
    noDivider: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  }
};
</script>
