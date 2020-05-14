<template>
	<el-row v-if="type == 'img'" type="flex">
		<div
			v-for="(item, index) in imgList"
			:key="index"
			:class="{ 'is-selected': selectDiv == index }"
			class="p-5 mr-5 mb-5 hoverbg"
			@click="onDivClick(index)"
		>
			<el-image
				:src="item.src"
				:preview-src-list="[item.src]"
				:style="{ width: width, height: height }"
			>
				<div slot="error" class="image-slot">
					<i class="el-icon-picture-outline"></i>
				</div>
			</el-image>
			<div class="text-center">
				{{ item.title }}
			</div>
		</div>
	</el-row>
	<div v-else-if="type == 'video'" class="d-flex flex-row flex-wrap">
		<div
			v-for="(item, index) in options"
			:key="index"
			:class="{ 'is-selected': selectDiv == index }"
			class="w-20 hoverbg p-5"
			:style="{ 'padding-bottom': '25px', height: height }"
		>
			<video-player :options="item"></video-player>
			<div class="text-center py-5" @click="onDivClick(index)">
				{{ item.title }}
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name:"zhPictureVideoPlay",
	props: {
		type: {
			type: String,
			default: 'img',
			validator: function(value) {
				return ['img', 'video'].includes(value)
			}
		},
		imgList: {
			type: Array,
			default: function() {
				return []
			}
		},
		videoList: {
			type: Array,
			default: function() {
				return []
			}
		},
		width: {
			type: String,
			default: '130px'
		},
		height: {
			type: String,
			default: '150px'
		}
	},
	data() {
		return {
			selectDiv: null,
			options: []
			// {
			//   sources: [{ src: '', type: 'video/mp4' }],
			//   notSupportedMessage: '此视频暂无法播放，请稍后再试',
			//   // 确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
			//   controls: true,
			//   // 自动播放属性,muted:静音播放
			//   // autoplay: 'muted',
			//   // Video.js播放器将具有流畅的大小。换句话说，它将扩展以适应其容器
			//   fluid: true,
			//   // 建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
			//   preload: 'auto',
			//   //   // 封面图
			//   poster: require('/assets/home/images/yizanting.png')
			// }
		}
	},
	watch: {
		videoList: {
			handler: function() {
				this.setVideoList()
				this.selectDiv = null
			},
			deep: true
		},
		imgList: {
			handler: function() {
				this.selectDiv = null
			},
			deep: true
		}
	},
	mounted() {
		this.setVideoList()
	},
	methods: {
		onDivClick(index) {
			this.selectDiv = index
			this.$emit('select', index)
		},
		setVideoList() {
			this.options = []
			if (this.videoList.length > 0) {
				for (let index = 0; index < this.videoList.length; index++) {
					const element = this.videoList[index]
					this.options.length = this.videoList.length
					this.$set(this.options, index, {
						sources: [{ src: element.src, type: 'video/mp4' }],
						notSupportedMessage: '此视频暂无法播放，请稍后再试',
						controls: true,
						preload: 'auto',
						poster: element.poster,
						title: element.title
					})
				}
			}
		}
	}
}
</script>
<style lang="scss">
.hoverbg {
	&:hover {
		background-color: #ccc;
	}
	&.is-selected {
		border: 1px solid #409eff;
		background-color: #ecf5ff;
		padding: 4px;
	}
}
</style>
