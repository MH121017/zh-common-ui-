<template>
	<div class="common-pdf">
		<iframe
			v-if="src != ''"
			ref="iframe"
			frameborder="0"
			:width="width"
			:height="height"
		></iframe>
		<div
			v-show="showLoading"
			v-loading="showLoading"
			:style="{ width: width, height: height, position: 'absolute', top: '0' }"
		></div>
	</div>
</template>
<script>
export default {
  name: "zhPdf",
	props: {
		src: {
			type: String,
			required: true,
			default: ''
		},
		width: {
			type: String,
			default: '100%'
		},
		height: {
			type: String,
			default: '100%'
		}
	},
	data() {
		return {
			showLoading: false
		}
	},
	watch: {
		src: {
			handler(newName) {
				this.showLoading = true
				if (newName != '' && newName.includes('/api/')) {
					this.$nextTick(() => {
						this.showLoading = false
						this.$refs.iframe.contentWindow.location.replace(
							`/pdfjs/web/viewer.html?file=${encodeURIComponent(newName)}&.pdf`
						)
					})
				} else {
					this.$nextTick(() => {
						this.showLoading = false
					})
				}
			},
			immediate: true
		}
	}
}
</script>
<style lang="scss">
.common-pdf {
	position: relative;
	margin: auto;
}
</style>
