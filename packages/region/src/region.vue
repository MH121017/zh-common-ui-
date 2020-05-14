<!--选择网格 选择区域-->
<template>
	<el-dialog
		v-dialogDrag
		:visible.sync="showDialog"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		title="选择区域"
		append-to-body
		width="30%"
		@close="onCallbackCancel"
	>
		<el-row class="chooseArea">
			<el-col>
				<el-tree
					:data="treeData"
					:props="bindTreeProps"
					:default-expanded-keys="bindTreeExpandkeys"
					:load="loadTreeChild"
					:check-strictly="checkStrictly"
					node-key="id"
					lazy
					:show-checkbox="showCheckbox && type == 'area'"
					@node-click="onNodeClick"
					@check="nodeClick"
				></el-tree>
			</el-col>
		</el-row>
		<span slot="footer">
			<el-button @click="onCallbackCancel">取 消</el-button>
			<el-button type="primary" @click="onCallbackSelect">确 定</el-button>
		</span>
	</el-dialog>
</template>
<script>
import regionTreeService from '../../api/register/regionTree'
import gridTreeService from '../../api/secutity/gridManage'
import { isNullOrEmpty, isNotNullOrEmpty } from '../../utils/public'
export default {
	name: 'zhRegion',
	props: {
		parentId: {
			type: String,
			default: ''
		},
		regionId: {
			type: Number,
			default: 0
		},
		regionLevel: {
			type: Number,
			default: 0
		},
		type: {
			type: String,
			default: function(value) {
				return ['grid', 'area'].includes(value) ? value : 'area'
			}
		},
		cascader: {
			type: Boolean,
			default: false
		},
		showCheckbox: {
			type: Boolean,
			default: false
		},
		checkStrictly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			showDialog: true,
			treeData: [],
			bindTreeProps: {
				isLeaf: 'leaf',
				label: this.type == 'area' ? 'regionName' : 'gridName'
			},
			selectNode: {}, // 选中的对象
			selectNodeByCheckbox: [], // 可多选area 选中的对象
			bindTreeExpandkeys: [], // 默认展开
			queryAreaData: {
				// 查询区域id
				id: null,
				parentId: null,
				pageSize: 30
			},
			queryGridData: {
				// 查询网格id
				guid: -1,
				isFirst: true // 第一次查询为true，之后为false
			},
			cacheSelected: [] // 级联选择用
		}
	},
	methods: {
		// 初始化显示
		show() {
			this.showDialog = true
			this.$nextTick(() => {
				if (this.type == 'area') {
					this.getAreaList()
				} else {
					this.getGridList()
				}
			})
		},
		clearData() {
			this.treeData = []
			this.cacheSelected = []
			this.bindTreeExpandkeys = []
			this.selectNode = {}
			this.queryAreaData = { parentId: -1 }
			this.queryGridData = {
				guid: -1,
				isFirst: true
			}
			this.showDialog = false
		},
		// 获取区域
		getAreaList() {
			if (isNotNullOrEmpty(this.parentId)) {
				this.queryAreaData.parentId = this.parentId
			} else {
				if (isNotNullOrEmpty(this.regionId)) {
					this.queryAreaData.id = this.regionId
				} else {
					this.queryAreaData.id = this.$store.state.currentUser.grid.regionId
				}
			}

			if (
				this.queryAreaData.id == null &&
				this.queryAreaData.parentId == null
			) {
				this.queryAreaData.parentId = -1
			}
			regionTreeService.getList(this.queryAreaData).then(res => {
				this.treeData = res.data
				this.bindTreeExpandkeys[0] = this.treeData[0].id
				this.cacheSelected[0] = res.data[0]
			})
		},
		// 获取网格
		getGridList() {
			if (isNotNullOrEmpty(this.parentId)) {
				this.queryGridData.guid = this.parentId
			}
			gridTreeService.getGridTreeList(this.queryGridData).then(res => {
				this.treeData = res.data
				this.bindTreeExpandkeys[0] = this.treeData[0].id
				this.cacheSelected[0] = res.data[0]
			})
		},
		// tree的懒加载
		loadTreeChild(node, resolve) {
			if (node.level > 0) {
				if (this.type == 'area') {
					// 区域查询
					if (node.level > 1) {
						// 第一层不加载，默认展开
						this.cacheSelected[node.level - 1] = node.data // 放止点击下一级而无法选中当前值
					}
					if (this.regionLevel != 0) {
						this.queryAreaData.level = this.regionLevel
					}
					this.queryAreaData.parentId = node.data.id
					this.queryAreaData.id = null
					regionTreeService.getList(this.queryAreaData).then(res => {
						if (res.length != 0) {
							resolve(res.data)
						} else {
							resolve([])
						}
					})
				} else {
					// 网格查询
					this.queryGridData = {
						guid: node.data.id,
						isFirst: false
					}
					gridTreeService.getGridTreeList(this.queryGridData).then(res => {
						if (res.data.length != 0) {
							resolve(res.data)
						} else {
							resolve([])
						}
					})
				}
			}
		},
		// 节点选中
		onNodeClick(data, node, view) {
			const that = this
			this.selectNode = data
			if (this.cascader && this.type == 'area') {
				// 判断是否是级联显示（只有区域有该需求）
				that.cacheSelected[node.level - 1] = data
			}
		},
		/**
		 * 选中节点返回结果
		 */
		nodeClick(currentNode, data) {
			this.selectNodeByCheckbox = data.checkedNodes
		},
		resetSelected() {
			// 对级联选择进行二次编辑返回
			if (this.cacheSelected[0] == undefined) {
				this.cacheSelected[0] = this.treeData[0]
			}
			let temvar = {
				id: '',
				version: '',
				guid: '',
				regionName: '',
				parentId: '',
				regionAlias: '',
				sortId: '',
				regionLevel: ''
			}
			// 遍历选中值进行编辑
			this.cacheSelected.forEach(element => {
				temvar = {
					id: isNullOrEmpty(temvar.id)
						? element.id
						: temvar.id + ',' + element.id,
					version: element.version,
					guid: isNullOrEmpty(temvar.guid)
						? element.guid
						: temvar.guid + ',' + element.guid,
					regionName: isNullOrEmpty(temvar.regionName)
						? element.regionName
						: temvar.regionName + '/' + element.regionName,
					parentId: isNullOrEmpty(temvar.parentId)
						? element.parentId
						: temvar.parentId + ',' + element.parentId,
					regionAlias: isNullOrEmpty(temvar.regionAlias)
						? element.regionAlias
						: temvar.regionAlias + '/' + element.regionAlias,
					sortId: element.sortId,
					regionLevel: element.regionLevel
				}
			})
			temvar.id =
				temvar.id != undefined && temvar.id.length > 0
					? ',' + temvar.id + ','
					: temvar.id
			temvar.guid =
				temvar.guid != undefined && temvar.guid.length > 0
					? ',' + temvar.guid + ','
					: temvar.guid
			temvar.parentId =
				temvar.parentId.length > 0
					? ',' + temvar.parentId + ','
					: temvar.parentId
			return temvar
		},
		onCallbackSelect() {
			if (this.cascader && this.type == 'area') {
				if (this.cacheSelected.length == 0) {
					// 判断是否选择
					this.$message({
						message: '请选择区域',
						type: 'warning',
						showClose: true
					})
					return false
				}
				const checkedback = this.resetSelected()
				this.$emit('selectClick', checkedback)
			} else {
				// 2020/03/09 添加area 可多选
				if (this.showCheckbox && this.type == 'area') {
					if (this.selectNodeByCheckbox.length == 0) {
						// 判断是否选择
						this.$message({
							message: '请选择区域',
							type: 'warning',
							showClose: true
						})
						return false
					} else {
						let timer = {
							id: '',
							guid: '',
							parentId: '',
							regionName: '',
							regionLevel: ''
						}
						// 循环遍历
						this.selectNodeByCheckbox.forEach(item => {
							// 遍历每一个timer key
							for (const key in timer) {
								timer[key] = item.hasOwnProperty(key)
									? isNullOrEmpty(timer[key])
										? item[key]
										: timer[key] + ',' + item[key]
									: timer[key] + ',' + item[key]
							}
						})
						// guid
						timer.guid =
							timer.guid.length > 0 ? ',' + timer.guid + ',' : timer.guid
						// parentId
						timer.parentId =
							timer.parentId.length > 0
								? ',' + timer.parentId + ','
								: timer.parentId
						// regionId
						this.$emit('selectClick', timer)
					}
				} else {
					if (Object.keys(this.selectNode).length == 0) {
						// 判断是否选择
						this.$message({
							message: '请选择区域',
							type: 'warning',
							showClose: true
						})
						return false
					} else {
						this.$emit('selectClick', this.selectNode)
					}
				}
			}
			this.clearData()
		},
		onCallbackCancel() {
			this.$emit('selectClick', 'cancel')
			this.clearData()
		}
	}
}
</script>
<style lang="scss">
.chooseArea {
	height: 500px;
	overflow-y: auto;
	@media (max-width: 1900px) {
		height: 300px;
	}
	.el-tree-node:focus > .el-tree-node__content {
		background-color: #ffefbb;
	}
}
</style>
