import blockHeader from './src/blockHeader.vue';

blockHeader.install = function(Vue) {
  Vue.component(blockHeader.name, blockHeader)
}

export default blockHeader