<template>
	<div class="compre-search">
		<div class="compre-search-header">
			<div class="compre-search-header-left">
				<slot name="head">
					<el-button
						v-if="add"
						type="primary"
						icon="el-icon-plus"
						class="butheight"
						@click="searchEnterFun('add')"
						>新建</el-button
					>
					<el-button
						v-if="edit"
						type="warning"
						icon="el-icon-edit"
						class="butheight"
						@click="searchEnterFun('edit')"
						>修改</el-button
					>
					<el-button
						v-if="delet"
						type="danger"
						icon="el-icon-delete"
						class="butheight"
						@click="searchEnterFun('delete')"
						>删除</el-button
					>
					<el-button
						v-if="impor"
						type="success"
						icon="el-icon-download"
						class="butheight"
						@click="searchEnterFun('import')"
						>导入</el-button
					>
					<el-button
						v-if="expor"
						type="success"
						icon="el-icon-upload2"
						class="butheight"
						@click="searchEnterFun('export')"
						>导出</el-button
					>
					<el-button
						v-if="download"
						type="success"
						icon="el-icon-download"
						class="butheight"
						@click="searchEnterFun('download')"
						>模板下载</el-button
					>
					<el-select
						v-if="moreFunctions"
						v-model="selectChoose"
						@change="searchEnterFun"
						style="width:100px;margin-left:10px;"
					>
						<template v-for="item in options">
							<el-option
								v-if="item.hidden"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							></el-option>
						</template>
					</el-select>
				</slot>
			</div>
			<div class="compre-search-header-right">
				<label
					for="companyName"
					v-if="label != ''"
					class="mr-10"
					v-text="label"
				></label>
				<el-input
					v-if="search"
					v-model="searchForm.companyName"
					id="companyName"
					:placeholder="placeholder"
					class="w-40 pb-10"
					@keyup.enter.native="searchEnterFun('search')"
				>
					<!-- style="width:300px;padding-bottom:10px;" -->
					<span
						v-if="$slots['input-suffix']"
						slot="suffix"
						class="presearch-input-suffix"
						@click="searchEnterFun('search')"
					>
						<slot name="input-suffix"></slot>
					</span>
					<span
						v-else
						slot="suffix"
						class="el-input__icon el-icon-search"
						style="padding-bottom:9px;"
						@click="searchEnterFun('search')"
					></span>
				</el-input>
				<el-button
					v-show="!isActive && !search"
					type="default"
					icon="el-icon-search"
					plain
					class="ml-10 mb-10"
					title="查询"
					@click="searchEnterFun('search')"
				></el-button>

				<div
					:class="{ 'show-compre-body': isActive }"
					class="mx-10 pb-10"
					style="display:inline-block;width: 100px;"
				>
					<el-button v-if="more" type="default" @click="onMoreSearch">
						更多查询
						<i
							:class="{ 'is-active': isActive, 'is-default': !isActive }"
							class="el-icon-d-arrow-left el-icon--right"
						></i>
					</el-button>
				</div>
				<el-button
					v-if="reset"
					type="default"
					icon="el-icon-refresh-right"
					plain
					class="mb-10"
					title="重置"
					@click="searchEnterFun('reset')"
				></el-button>
			</div>
		</div>
		<el-collapse-transition>
			<div v-show="isActive">
				<div :style="{ height: bodyHeight }" class="compre-search-body">
					<div class="compre-search-body-left">
						<slot></slot>
					</div>
					<div class="compre-search-body-right">
						<el-button
							type="primary"
							icon="el-icon-search"
							class="butheight"
							@click="searchEnterFun('search')"
							>查询</el-button
						>
					</div>
				</div>
			</div>
		</el-collapse-transition>
	</div>
</template>
<script>
export default {
	name: 'zhCompreSearch',
	props: {
		// 需要显示的功能
		layout: {
			type: String,
			default: 'add,edit,delete,export,import,download,search,more,reset'
		},
		// 更多查询的显示区域的高
		bodyHeight: {
			type: String,
			default: '200px'
		},
		// 查询按钮label
		label: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: '请输入企业名称'
		}
	},
	data() {
		return {
			moreFunctions: false,
			add: false,
			edit: false,
			delet: false,
			impor: false,
			expor: false,
			download: false,
			search: false,
			more: false,
			reset: false,
			isActive: false, // button的点击
			selectChoose: '更多', // 下拉菜单选中
			searchForm: {
				// 查询的form
				companyName: ''
			},
			// 下拉菜单的options
			options: [
				{
					label: '导入',
					value: 'import',
					hidden: false
				},
				{
					label: '导出',
					value: 'export',
					hidden: false
				},
				{
					label: '模板下载',
					value: 'download',
					hidden: false
				}
			]
		}
	},
	mounted() {
		// this.setTemplateDom();
		this.retrunFilterValue()
	},
	methods: {
		/**
		 *  更多查询 按钮点击
		 */
		onMoreSearch() {
			this.isActive = !this.isActive
			this.$nextTick(() => {
				this.$emit('eventCallback', 'closeMoreSearch')
			})
		},
		/**
		 *  暂时弃置， 用来筛选layout返回值
		 */
		setTemplateDom() {
			const template = document.getElementsByClassName(
				'compre-search-header-left'
			)
			console.info(template[0])
			const layout = this.layout
			const components = layout.split(',').map(item => item.trim())
			const TEMPLATE_MAP = {
				add: <compre-add></compre-add>,
				edit: <compre-eidt></compre-eidt>
			}
		},
		/**
		 * 筛选layout返回值
		 */
		retrunFilterValue() {
			const layout = this.layout
			const components = layout.split(',').map(item => item.trim())
			const flag1 =
				components.includes('import') &&
				(components.includes('export') || components.includes('download'))
			const flag2 =
				components.includes('export') &&
				(components.includes('import') || components.includes('download'))
			const flag3 =
				components.includes('download') &&
				(components.includes('import') || components.includes('export'))
			// 如果他包含两个值及两个以上
			if (flag1 || flag2 || flag3) {
				this.moreFunctions = true
				this.impor = false
				this.expor = false
				this.download = false
				const arr = ['import', 'export', 'download']
				for (const key in arr) {
					const element = arr[key]
					if (components.includes(element)) {
						this.options.forEach(v => {
							if (v.value == element) {
								v.hidden = true
							}
						})
					}
				}
			} else {
				// 默认全部为false, 有哪个再显示哪个
				this.moreFunctions = false
				this.impor = false
				this.expor = false
				this.download = false
				if (components.includes('import')) {
					this.impor = true
				} else if (components.includes('export')) {
					this.expor = true
				} else if (components.includes('download')) {
					this.download = true
				}
			}
			components.forEach(v => {
				if (v === 'add') {
					this.add = true
				} else if (v === 'edit') {
					this.edit = true
				} else if (v === 'delete') {
					this.delet = true
				} else if (v === 'search') {
					this.search = true
				} else if (v === 'more') {
					this.more = true
				} else if (v === 'reset') {
					this.reset = true
				}
			})
		},
		/**
		 * 返回搜索值
		 */
		searchEnterFun: function(e) {
			if (e == 'search') {
				this.$emit('eventCallback', e, this.searchForm.companyName) //搜索和回车
				return false
			} else if (e == 'reset') {
				this.searchForm.companyName = '' //重置
			}
			this.$emit('eventCallback', e)
		}
	}
}
</script>
<style lang="scss">
.compre-search {
	.butheight {
		height: 32px;
	}
	&-header {
		background-color: #fff;
		padding-right: 10px;
		padding-left: 10px;
		padding-top: 10px;
		display: flex;
		&-left {
			width: 50%;
			padding-bottom: 10px;
		}
		&-right {
			width: 50%;
			text-align: right;
			.presearch-input-suffix {
				line-height: 32px;
				cursor: pointer;
				&:hover {
					color: #409eff;
				}
			}
			.is-default {
				transform: rotate(-90deg);
				transition: transform 0.3s;
			}
			.is-active {
				transform: rotate(90deg);
				transition: transform 0.3s;
			}
			.show-compre-body {
				background-color: #f4f4f4;
				border: 1px solid #e4e6eb;
				border-bottom: 1px solid #f4f4f4;
				.el-button {
					background-color: inherit;
					color: #409eff;
					border: 0;
					&:hover,
					&:focus {
						border: 0;
					}
				}
			}
			&-icon-search {
				cursor: pointer;
				line-height: 32px;
				transition-property: color;
				transition-duration: 0.3s;
				&:hover {
					color: #409eff;
				}
				&:active {
					font-size: 12px;
				}
			}
		}
	}
	&-body {
		background-color: #f4f4f4;
		overflow-y: auto;
		&-left {
			width: 90%;
			height: 100%;
			float: left;
			padding: 10px;
		}
		&-right {
			width: 10%;
			height: 100%;
			float: right;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style>
