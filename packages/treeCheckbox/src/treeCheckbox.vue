<template>
	<div class="tree-checkbox">
		<el-tree
			ref="treeCheckbox"
			show-checkbox
			highlight-current
			expand-on-click-node
			:data="treeData"
			:props="treeProps"
			node-key="id"
			:default-checked-keys="treeDefaultCheck"
			@check="treeNodeCheck"
			@node-click="treeNodeClick"
			:default-expand-all="true"
			:default-expanded-keys="[1]"
		>
			<span class="custom-tree-node text-eclipse" slot-scope="{ node }">
				<el-tooltip
					placement="bottom-start"
					:open-delay="1200"
					trigger="hover"
					effect="light"
					:content="node.label"
				>
					<span>{{ node.label }}</span>
				</el-tooltip>
			</span>
		</el-tree>
	</div>
</template>
<script>
export default {
	name: 'zhTreeCheckbox',
	props: {
		treeData: {
			type: Array,
			default: []
		},
		treeDefaultCheck: {
			type: Array,
			default: function() {
				return []
			}
		},
		treeProps: {
			type: Object,
			default: {
				label: 'label',
				children: 'children'
			}
		}
	},
	data() {
		return {
			treeExportData: [] // 选中抛出的值  , 存贮值为 对象
		}
	},
	watch: {
		/**
		 *  监听默认选中数组，返回ID的集合
		 */
		treeDefaultCheck: function() {
			this.$emit('treeDefaultChange', this.treeDefaultCheck)
		},
		treeExportData: {
			handler: function() {
				this.$emit('treeExportChage', this.treeExportData)
			},
			deep: true
		},
		treeData: {
			handler: function(params) {
				this.treeData = params
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		/**
		 *  节点选中事件
		 */
		treeNodeClick(data, node, vm) {
			// 当前节点点击事件
			// 如果节点为最后一个节点则添加到已选择列表
			if (data.level == 3) {
				this.checkSelected(data)
			}
		},
		/**
		 *  checkbox选中事件
		 */
		treeNodeCheck(data, type) {
			//当前节点的check框点击事件
			if (data[this.treeProps.children]) {
				if (data.level < 3) {
					// 判断当前节点层级
					let havenum = 0 // 存贮未选中值的个数
					data[this.treeProps.children].forEach(element => {
						// 如果节点内的单条数据是否被选中
						let ishave = this.treeDefaultCheck.includes(element.id)
						if (!ishave) {
							havenum++
							// 节点内有未选中值，则全部选中
							this.checkSelected(element)
						}
					})
					// 如果节点内全部选中，则全部取消选中
					if (havenum == 0) {
						data[this.treeProps.children].forEach(element => {
							this.checkSelected(element)
						})
					}
					havenum = 0
				} else {
					data[this.treeProps.children].forEach((element, eleIndex) => {
						this.checkSelected(element)
					})
				}
			} else {
				//   没有children ，则说明是最后一级
				this.checkSelected(data)
			}
		},
		/**
		 *  用于填充数据
		 */
		checkSelected(val, level) {
			// 将数据添加进去
			let ishave =
				this.treeDefaultCheck != undefined
					? this.treeDefaultCheck.indexOf(val.id)
					: -1
			if (ishave > -1) {
				this.treeDefaultCheck.splice(ishave, 1)
				this.treeExportData.splice(ishave, 1)
			} else {
				this.treeDefaultCheck.push(val.id)
				this.treeExportData.push(val)
			}
			this.$refs.treeCheckbox.setCheckedNodes(this.treeExportData)
		}
	}
}
</script>
<style lang="scss">
.tree-checkbox {
	height: 70vh;
	background: #fff;
	padding: 10px;
	overflow: auto;
	.el-tree {
		border: 0.5px solid #dcdfe6;
		border-top: 0;
	}
	.el-tree-node__content {
		height: unset;
		padding: 5px 0;
		border-top: 0.5px solid #dcdfe6;
	}
}
.el-tooltip__popper {
	max-width: 600px;
}
</style>
