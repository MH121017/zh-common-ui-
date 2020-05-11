<template>
	<div>
		<div v-if="!hidebtn" class="p-10">
			<el-button type="success" icon="el-icon-upload" @click="onBtnUploadClick"
				>上传</el-button
			>
			<el-button type="danger" icon="el-icon-delete" @click="onBtnDelete"
				>删除</el-button
			>
		</div>
		<picture-video-play
			v-if="showList"
			:img-list="imgList"
			:video-list="videoFinalList"
			:type="type"
			:width="width"
			:height="height"
			@select="onItemSelected"
		></picture-video-play>
		<el-dialog
			:visible.sync="showDialog"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			title="上传"
			width="30%"
			append-to-body
			destroy-on-close
		>
			<el-form
				ref="form"
				:model="imgForm"
				:rules="imgRules"
				inline-message
				label-width="80px"
			>
				<el-form-item label="标题" prop="fileName">
					<el-input v-model="imgForm.fileName" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="上传图片">
					<el-upload
						ref="imgupload"
						:action="uploadUrl"
						:data="imgForm"
						:limit="1"
						:headers="tokenHeader"
						:auto-upload="false"
						:on-success="uploadSuccess"
						:on-error="uploadError"
						:on-change="onImgUploadChange"
						:on-exceed="onUploadExceed"
						accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
					>
						<el-button size="small" type="primary">点击选择图片文件</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item v-if="type == 'video'" label="上传视频">
					<el-upload
						ref="videoupload"
						:action="uploadUrl"
						:data="videoForm"
						:headers="tokenHeader"
						:limit="1"
						:auto-upload="false"
						:on-success="uploadSuccess"
						:on-error="uploadError"
						:on-change="onVideoUploadChange"
						:on-exceed="onUploadExceed"
						accept=".mp4, .mp3"
					>
						<el-button size="small" type="primary">点击选择视频文件</el-button>
					</el-upload>
				</el-form-item>
			</el-form>

			<span slot="footer">
				<el-button @click="showDialog = false">取 消</el-button>
				<el-button type="primary" @click="onBtnSubmit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { getToken } from '../../utils/auth'
import { getGuidGenerator } from '../../utils/public'
import fileService from '../../api/common/accessoryFile'
export default {
	props: {
		query: {
			type: Object,
			default: function() {
				return {
					parentGuid: '', // parentGuid
					moduleName: '', // 模块名称---使用流程名称
					contentType: '' // 文件类型
				}
			}
		},
		type: {
			type: String,
			default: 'img',
			validator: function(value) {
				return ['img', 'video'].includes(value)
			}
		},
		width: {
			type: String,
			default: '130px'
		},
		height: {
			type: String,
			default: '180px'
		},
		hidebtn: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			uploadUrl: process.env.VUE_APP_BASE_API + '/api/accessoryFile/create',
			tokenHeader: { access_token: getToken() }, // 回头改为公共组件
			showDialog: false,
			showList: false,
			selectItem: null,
			imgList: [],
			videoList: [
				// {
				//   src: "",
				//   poster: require("/assets/home/images/yizanting.png"),
				//   title: "测试1"
				// }
			],
			videoFinalList: [],
			imgForm: {
				fileName: '', // 文件名
				parentGuid: '', // parentGuid
				moduleName: '', // 模块名称---使用流程名称
				contentType: 'img'
			},
			videoForm: {
				fileName: '', // 文件名
				parentGuid: '', // parentGuid
				moduleName: '', // 模块名称---使用流程名称
				contentType: 'video'
			},
			imgRules: {
				fileName: [{ required: true, message: '标题不能为空' }]
			},
			imgFileList: [], // 文件列表
			videoFileList: [], // 文件列表
			successCount: 1, // 成功提示次数
			errorCount: 1 // 失败提示次数
		}
	},
	watch: {
		query: {
			handler: function(value) {
				this.imgForm.parentGuid = value.parentGuid
				this.imgForm.moduleName = value.moduleName
				this.videoForm.parentGuid = value.parentGuid
				this.videoForm.moduleName = value.moduleName
				this.getFileList()
			},
			deep: true
		}
	},
	mounted() {
		this.imgForm.parentGuid = this.query.parentGuid
		this.imgForm.moduleName = this.query.moduleName
		this.videoForm.parentGuid = this.query.parentGuid
		this.videoForm.moduleName = this.query.moduleName
		this.getFileList()
	},
	methods: {
		/**
		 * 上传dialog按钮
		 */
		onBtnUploadClick() {
			this.showDialog = true
			this.imgForm.fileName = ''
			this.$nextTick(() => {
				this.$refs.form.clearValidate()
			})
			// 初始化提示次数
			this.successCount = 1
			this.errorCount = 1
		},
		/**
		 * 图片,视频上传
		 */
		onBtnSubmit() {
			this.$refs.form.validate(valid => {
				if (valid) {
					// 图片列表判断
					if (this.imgFileList.length == 0) {
						this.$message({
							message: '请选择图片',
							type: 'warning',
							showClose: true
						})
						return false
					}
					// 生成随机guid
					this.imgForm.guid = getGuidGenerator()
					this.$refs.imgupload.submit()
					if (this.type == 'video') {
						// 视频列表判断
						if (this.videoFileList.length == 0) {
							this.$message({
								message: '请选择视频',
								type: 'warning',
								showClose: true
							})
							return false
						}
						this.videoForm.fileName = this.imgForm.fileName
						this.videoForm.rootGuid = this.imgForm.guid // 视频绑定图片guid
						this.$refs.videoupload.submit()
					}
				}
			})
		},
		/**
		 * 上传成功返回
		 */
		uploadSuccess(response, file, fileList) {
			if (this.successCount > 0) {
				this.showDialog = false
				this.$message({
					message: '上传成功',
					type: 'success',
					showClose: true
				})
				this.successCount--
				// 视频充分保存后请求
				setTimeout(() => {
					this.getFileList()
				}, 2000)
			}
		},
		/**
		 * 上传失败返回
		 */
		// eslint-disable-next-line handle-callback-err
		uploadError(error, file, fileList) {
			if (this.errorCount > 0) {
				this.$message({
					message: '上传失败',
					type: 'error',
					showClose: true
				})
				this.errorCount--
			}
		},
		/**
		 * 将图片文件存储
		 */
		onImgUploadChange(file, fileList) {
			this.imgFileList = fileList
		},
		/**
		 * 将视频文件存储
		 */
		onVideoUploadChange(file, fileList) {
			this.videoFileList = fileList
		},
		/**
		 * 上传做限制
		 */
		onUploadExceed() {
			this.$message({
				message: '最多上传一个文件',
				type: 'warning',
				showClose: true
			})
		},
		/**
		 * 获取图片列表
		 */
		getFileList() {
			fileService.getFileListByEntity(this.imgForm).then(res => {
				this.resetImgList(res.data)
			})
		},
		/**
		 * 重构视频和图片列表
		 */
		resetImgList(data) {
			this.showList = false
			if (this.type == 'img') {
				this.imgList = data
				// 图片重构
				for (const item of this.imgList) {
					item.src =
						process.env.VUE_APP_BASE_API +
						'/api/accessoryFile/download/' +
						item.id
					item.title = item.fileName
				}
				this.showList = true
			} else if (this.type == 'video') {
				this.videoList = data
				for (const item of this.videoList) {
					item.title = item.fileName
					item.poster =
						process.env.VUE_APP_BASE_API +
						'/api/accessoryFile/download/' +
						item.id
				}
				// 循环遍历
				this.i = this.videoList.length
				this.getVideoBySelf()
			}
		},
		/**
		 * 根据图片guid获取视频
		 */
		getVideoBySelf() {
			if (this.i > 0) {
				// 图片的guid绑定视频的rootGuid
				this.videoForm.rootGuid = this.videoList[
					this.videoList.length - this.i
				].guid
				// 获取视频地址
				fileService.getFileListByEntity(this.videoForm).then(res => {
					if (res.data.length > 0) {
						this.videoList[this.videoList.length - this.i].src =
							process.env.VUE_APP_BASE_API +
							'/api/accessoryFile/download/' +
							res.data[0].id
						this.videoList[this.videoList.length - this.i].videoId =
							res.data[0].id
					}
					this.i--
					this.getVideoBySelf()
				})
			} else {
				// 最终视频对象数组
				this.videoFinalList = [...this.videoList]
				this.showList = true
			}
		},
		/**
		 * 列表选中的下标
		 */
		onItemSelected(index) {
			this.selectItem = index
		},
		/**
		 * 点击删除按钮
		 */
		onBtnDelete() {
			if (this.selectItem == null) {
				this.$message({
					message: '请选择要删除的记录',
					type: 'warning',
					showClose: true
				})
			} else if (this.type == 'img') {
				fileService
					.deleteOne(this.imgList[this.selectItem].id)
					.then(res => {
						this.$delete(this.imgList, this.selectItem)
						this.$message({
							message: '删除成功',
							type: 'success',
							showClose: true
						})
					})
					.catch(() => {
						this.$message({
							message: '删除失败',
							type: 'error',
							showClose: true
						})
					})
			} else if (this.type == 'video') {
				// 删除图片
				fileService
					.deleteOne(this.videoList[this.selectItem].id)
					.then(res => {
						// 删除视频
						fileService
							.deleteOne(this.videoList[this.selectItem].videoId)
							.then(res => {
								this.$delete(this.videoList, this.selectItem)
								this.$message({
									message: '删除成功',
									type: 'success',
									showClose: true
								})
								this.getFileList()
							})
							.catch(() => {
								this.$message({
									message: '删除失败',
									type: 'error',
									showClose: true
								})
							})
					})
					.catch(() => {
						this.$message({
							message: '删除失败',
							type: 'error',
							showClose: true
						})
					})
			}
		}
	}
}
</script>
