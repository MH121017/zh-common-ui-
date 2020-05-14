<template>
	<el-dialog
		:visible.sync="showDialog"
		:title="title"
		:width="width"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		destroy-on-close
		@close="onDialogClose"
	>
		<el-row :gutter="10" type="flex" style="height:460px;">
			<el-col :span="6">
				<el-tree
					:data="treeData"
					:props="treeProps"
					:load="loadGridTree"
					class="h-100 overflow-y"
					highlight-current
					node-key="id"
					lazy
					@node-click="nodeClick"
				></el-tree>
			</el-col>
			<el-col :span="getSpan + 1" style="border-left:1px solid #DCDFE6;">
				<!-- <div class="p-10">

					<el-button type="primary" @click="addGridChecked">添加</el-button>
        </div>-->
				<el-form :model="form" inline ref="form" label-width="80px">
					<el-form-item label="人员名称">
						<el-input
							style="width:90px"
							v-model="form.name"
							clearable
							@clear="formSearchClear"
						></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="formSearch">查询</el-button>
						<el-button type="primary" @click="addGridChecked">添加</el-button>
					</el-form-item>
				</el-form>

				<el-table
					:data="gridTableData"
					border
					stripe
					height="400"
					@select="selectGridTable"
					@select-all="selectAllGridTable"
				>
					<el-table-column
						type="selection"
						width="50"
						align="center"
					></el-table-column>
					<el-table-column prop="name" label="姓名"></el-table-column>
					<el-table-column prop="positionName" label="职务"></el-table-column>
					<el-table-column prop="mobile" label="联系电话"></el-table-column>
					<el-table-column
						prop="lawEnforcementNumber"
						label="执法证号"
					></el-table-column>
				</el-table>
			</el-col>
			<el-col
				v-if="crossSelect"
				:span="getSpan - 1"
				style="border-left:1px solid #DCDFE6;"
			>
				<el-row class="p-10">
					<el-button type="primary" @click="backPersonTableData"
						>确定</el-button
					>
					<el-button type="danger" @click="removePersonTableItem"
						>移除</el-button
					>
				</el-row>
				<el-table
					ref="multipleTable"
					:data="personData"
					border
					class="w-100"
					height="400"
					@select="selectPersonTable"
					@select-all="selectAllPersonTable"
					@selection-change="onSelectPersonChange"
				>
					<el-table-column
						type="selection"
						width="50"
						align="center"
					></el-table-column>
					<el-table-column prop="name" label="姓名"></el-table-column>
					<el-table-column
						prop="lawEnforcementNumber"
						label="执法证号"
					></el-table-column>
				</el-table>
			</el-col>
		</el-row>
	</el-dialog>
</template>
<script>
import gridTreeService from '../../api/emergency/dutyParticipants'
import { isNullOrEmpty } from '../../utils/public'
export default {
	name: 'zhPersonnel',
	props: {
		title: {
			// dialog标题
			type: String,
			default: '选择人员'
		},
		width: {
			// dialog宽度
			type: String,
			default: '65%'
		},
		crossSelect: {
			// 是否可跨网格选择
			type: Boolean,
			default: false
		},
		guid: {
			type: String,
			default: ''
		},
		mosaic: {
			// 是否拼接后返回
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			showDialog: false,
			treeData: [],
			gridTableData: [], // 第二列显示的数组
			gridTableDataForQuery: [], // 第二列查询到的数组
			checkGridData: [], // 用于存储网格表格选中的记录
			personData: [], // 临时存储人员表格选中记录，可跨区域
			checkPersonData: [], // 用于存储人员表格选中的记录
			delectPersondata: [],
			treeProps: {
				isLeaf: 'leaf',
				label: 'gridName'
			},
			queryData: {
				pageIndex: 1,
				pageSize: 200,
				countTotal: false,
				total: 0,
				sort: 'id', // 排序字段
				order: 'DESC', // ASC 正序  DESC倒序,
				isFirst: false,
				gridManageguid: ''
			},
			// 查询的form
			form: {
				name: ''
			}
		}
	},
	computed: {
		getSpan() {
			return 18 / (this.crossSelect ? 2 : 1)
		}
	},
	methods: {
		show() {
			this.showDialog = true
			this.getTreeListData()
		},
		// 获取网格树
		getTreeListData() {
			this.queryData.guid = isNullOrEmpty(this.guid)
				? this.$store.state.currentUser.guid
				: this.guid
			this.queryData.isFirst = true
			gridTreeService.getGridTreeList(this.queryData).then(res => {
				console.log('choosePerson', res)

				this.treeData = res.data
			})
		},
		// 懒加载树
		loadGridTree(node, resolve) {
			if (node.level != 0) {
				this.queryData.guid = node.data.guid
				this.queryData.isFirst = false
				gridTreeService.getGridTreeList(this.queryData).then(res => {
					if (res.length != 0) {
						resolve(res.data)
					} else {
						resolve([])
					}
				})
			}
		},
		// 树节点点击
		nodeClick(data) {
			this.getUsersByGridData(data.guid)
		},
		// 通过网格获取执法人员
		getUsersByGridData(wgGuid) {
			this.queryData.gridManageGuid = wgGuid
			gridTreeService.getUsersByGridList(this.queryData).then(res => {
				this.gridTableData = res.data.items
				this.gridTableDataForQuery = res.data.items
			})
		},
		/**
		 *  表单查询人员名称
		 */
		formSearch() {
			const name = this.form.name
			this.gridTableData = []
			this.gridTableDataForQuery.forEach(element => {
				if (element.name.includes(name)) {
					this.gridTableData.push(element)
				}
			})
		},
		/**
		 * 清空表单查询
		 */
		formSearchClear() {
			this.gridTableData = [...this.gridTableDataForQuery]
		},
		// 第一次添加到 第一个表格中或者返回数据
		addGridChecked() {
			if (this.crossSelect) {
				this.personData.push(...this.checkGridData)
				this.personData = [...new Set(this.personData)] // 数组去重
				this.checkPersonData = Object.assign([], this.personData)
			} else {
				if (this.mosaic) {
					this.$emit('receiving', this.secondaryEdit(this.checkGridData))
				} else {
					this.$emit('receiving', this.checkGridData)
				}
				this.showDialog = false
			}
		},
		selectGridTable(selection) {
			this.checkGridData = selection
		},
		selectAllGridTable(selection) {
			this.checkGridData = selection
		},
		selectPersonTable(selection) {
			this.delectPersondata = selection
		},
		selectAllPersonTable(selection) {
			this.delectPersondata = selection
		},
		onSelectPersonChange(val) {
			this.delectPersondata = val
		},
		removePersonTableItem() {
			if (this.delectPersondata == 0) {
				this.$message({
					message: '请选择一条记录',
					type: 'warning'
				})
			} else {
				// 遍历删除选中
				this.delectPersondata.forEach(element => {
					// 遍历临时选中数组
					for (let i = 0; i < this.personData.length; i++) {
						const item = this.personData[i]
						if (item.guid == element.guid) {
							this.personData.splice(i, 1)
							continue
						}
					}
				})
				// 赋值给回传的数据
				this.checkPersonData = Object.assign([], this.personData)
				this.delectPersondata = [] // 清空 "删除选中"数组
			}
		},
		// 返回 第二个表格中的选中值
		backPersonTableData() {
			// 判断是否需要拼接
			if (this.mosaic) {
				this.$emit('receiving', this.secondaryEdit(this.checkPersonData))
			} else {
				this.$emit('receiving', this.checkPersonData)
			}
			this.showDialog = false
		},
		// 拼接返回值
		secondaryEdit(checkData) {
			let temvar = {
				id: '',
				guid: '',
				phoneNumber: '',
				name: '',
				mobile: '',
				lawEnforcementPerson: false,
				lawEnforcementNumber: '',
				positionName: ''
			}
			checkData.forEach(element => {
				temvar = {
					id: isNullOrEmpty(temvar.id)
						? element.id
						: temvar.id + ',' + element.id,
					guid: temvar.guid + ',' + element.guid,
					phoneNumber: isNullOrEmpty(temvar.phoneNumber)
						? element.phoneNumber
						: temvar.phoneNumber + ',' + element.phoneNumber,
					name: isNullOrEmpty(temvar.name)
						? element.name
						: temvar.name + ',' + element.name,
					mobile: isNullOrEmpty(temvar.mobile)
						? element.mobile
						: temvar.mobile + ',' + element.mobile,
					lawEnforcementPerson: element.lawEnforcementPerson,
					lawEnforcementNumber: isNullOrEmpty(temvar.lawEnforcementNumber)
						? element.lawEnforcementNumber
						: element.lawEnforcementNumber == undefined
						? temvar.lawEnforcementNumber
						: temvar.lawEnforcementNumber + ',' + element.lawEnforcementNumber,
					positionName: isNullOrEmpty(temvar.positionName)
						? element.positionName
						: temvar.positionName + ',' + element.positionName
				}
			})
			return temvar
		},
		onDialogClose() {
			this.showDialog = false
			Object.assign(this.$data, this.$options.data())
		}
	}
}
</script>
