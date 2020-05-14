<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    @close="onDialogClose"
  >
    <el-row :gutter="10" type="flex" style="height:450px;">
      <el-col :span="6">
        <el-tree
          :data="treeData"
          :props="treeProps"
          class="h-100 overflow-y"
          highlight-current
          @node-click="nodeClick"
        ></el-tree>
      </el-col>
      <el-col style="border-left:1px solid #DCDFE6;">
        <div class="p-10">
          <el-button type="primary" @click="addGridChecked">添加</el-button>
        </div>
        <el-table
          :data="gridTableData"
          border
          stripe
          height="400"
          @select="selectGridTable"
          @select-all="selectAllGridTable"
        >
          <el-table-column type="selection" width="50" align="center">
          </el-table-column>
          <el-table-column prop="fullName" label="姓名"> </el-table-column>
          <el-table-column prop="position" label="职务"> </el-table-column>
          <el-table-column prop="telephoneNumber" label="联系电话">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import companyEmployee from "../../api/company/companyEmployee";
import companyDepartment from "../../api/company/companyDepartment";
export default {
  name:"zhCompanyPerson",
  props: {
    title: {
      // dialog标题
      type: String,
      default: "选择人员"
    },
    width: {
      // dialog宽度
      type: String,
      default: "60%"
    },
    crossSelect: {
      // 是否可跨网格选择
      type: Boolean,
      default: false
    },
    companyGuid: {
      type: String,
      default: ""
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
      gridTableData: [],
      checkGridData: [], // 用于存储网格表格选中的记录
      personData: [],
      checkPersonData: [], // 用于存储人员表格选中的记录
      treeProps: {
        isLeaf: "leaf",
        label: "text",
        children: "nodes"
      },
      queryData: {
        pageIndex: 1,
        pageSize: 50,
        countTotal: false,
        total: 0,
        sort: "id", // 排序字段
        order: "DESC", // ASC 正序  DESC倒序,
        isFirst: false,
        gridManageguid: ""
      },
      queryEmployeeData: {
        departmentguid: ""
      }
    };
  },
  computed: {},
  mounted() {
    this.getTreeListData();
  },
  methods: {
    show() {
      this.showDialog = true;
    },
    // 获取网格树
    getTreeListData() {
      this.queryData.companyGuid = this.companyGuid;
      companyDepartment.getTreeList(this.queryData).then(res => {
        this.treeData = res.data;
      });
    },
    nodeClick(data) {
      this.getUsersByGridData(data.guid);
    },
    // 通过网格获取执法人员
    getUsersByGridData(departmentGuid) {
      this.queryEmployeeData.departmentguid = departmentGuid;
      companyEmployee.getListEmployee(this.queryEmployeeData).then(res => {
        this.gridTableData = res.data.items;
      });
    },
    addGridChecked() {
      this.$emit("receiving", this.checkGridData);
      this.showDialog = false;
    },
    selectGridTable(selection) {
      this.checkGridData = selection;
    },
    selectAllGridTable(selection) {
      this.checkGridData = selection;
    },

    onDialogClose() {
      this.showDialog = false;
    }
  }
};
</script>
