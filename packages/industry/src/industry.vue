<template>
	<div class="industrySubordinateTree">
		<el-dialog
			v-dialogDrag
			:visible.sync="showEnterDialog"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			append-to-body
			title="选择行业"
			width="50%"
		>
			<el-row class="p-10">
				<el-col :span="24">
					<div
						class="bg-white"
						style="height:270px;overflow-y:auto;border:0px solid #000;"
					>
						<el-tree
							v-loading="loading"
							:data="econData"
							style="height:100%;"
							:props="econtProps"
							:load="loadNode"
							@node-click="econClick"
							lazy
						></el-tree>
					</div>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showEnterDialog = false">取 消</el-button>
				<el-button type="primary" @click="handleEconClick">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import econTreeService from '../../api/register/nationalEconomyType'
export default {
	name: 'zhIndustry',
	data() {
		return {
			loading: false,
			econData: [], // 查询国民经济分类树
			checkedHymcs: [],
			showEnterDialog: false,
			hyfl: '',
			hyms: '',
			hymcs: [],
			queryTreeData: {
				parentId: null,
				queryWbj: '',
				attributename: '',
				classname: '',
				pageSize: '1000',
				sort: 'sortId', // 排序字段
				order: 'ASC' // ASC 正序  DESC倒序
			},
			industry: {}, // 行业领域  name  id
			econtProps: {
				label: 'tradeName',
				isLeaf: 'leaf'
				// disabled:"leaf"
			}
		}
	},
	methods: {
		show() {
			this.showEnterDialog = true
			this.$nextTick(() => {
				this.getEconListData()
			})
		},

		handleEconClick() {
			//   this.dialogEconTreeVisible = false;
			this.industry.name = this.address
			this.industry.id = this.ids
			this.industry.industryIdsLike = this.industryIdsLike
			this.industry.industryIdsLikeName = this.industryIdsLikeName
			this.$emit('industry', this.industry)
		},
		getEconListData() {
			this.loading = true
			this.queryTreeData.parentId = -1
			econTreeService.getList(this.queryTreeData).then(res => {
				if (res != null) {
					this.econData = res.data
					this.loading = false
				}
			})
		},
		getParentEconStr: function(node) {
			if (node.label != undefined) {
				if (this.address == '') {
					this.address = node.data.tradeName
					this.ids = node.data.id
					this.industryIdsLikeName = node.data.tradeName
					this.industryIdsLike = node.data.industryCode
				} else {
					this.address = `${node.label}→` + this.address
				}
				this.getParentEconStr(node.parent)
			} else {
				// this.ids = this.ids + ",";
			}
		},
		getHymcListData() {
			econTreeService.getList(this.queryTreeData).then(res => {
				this.hymcs = res
			})
		},
		econClick(data, node, vm) {
			if (node.data.leaf == true) {
				this.queryTreeData.parentId = node.data.id
				this.getHymcListData()
			}
			this.address = ''
			this.ids = ''
			this.getParentEconStr(node)
		},
		loadNode(node, resolve) {
			if (node.level > 0) {
				this.queryTreeData.parentId = node.data.id
				econTreeService.getList(this.queryTreeData).then(res => {
					if (node.data.leaf == false) {
						resolve(res.data)
					} else {
						resolve([])
					}
				})
			}
		},
		changeEconTree() {
			this.queryTreeData.parentId = -1
			this.getEconListData()
			this.hymcs = null
			this.checkedHymcs = []
			this.hyms = ''
			this.hyfl = ''
			this.dialogEconTreeVisible = true
		}
	}
}
</script>

