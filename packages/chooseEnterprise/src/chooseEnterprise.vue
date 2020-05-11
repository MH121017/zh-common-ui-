<!--企业基本信息-->
<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="showEnterDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    title="企业信息"
    width="50%"
    @close="onClosesDialog"
  >
    <el-row>
      <el-col>
        <el-form
          ref="queryForm"
          :model="queryForm"
          inline
          label-width="80px"
          label-position="right"
        >
          <el-form-item label="企业名称:" prop="companyName">
            <el-input v-model="queryForm.companyName"></el-input>
          </el-form-item>
          <el-form-item label="所属区域:" prop="area">
            <el-input v-model="queryForm.area" readonly>
              <el-button slot="append" icon="el-icon-search" @click="chooseArea"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onQuery">查询</el-button>
            <el-button type="warning" @click="onReset">重置</el-button>

            <el-button type="primary" @click="onAdd">添加</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col>
        <el-table
          v-loading="loading"
          ref="tableref"
          :data="gridData"
          height="462"
          border
          @selection-change="selectTable"
        >
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip property="companyName" label="企业名称" width="150"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            property="registerAddress"
            label="生产经营地址"
            width="200"
          ></el-table-column>
          <el-table-column property="legalRepresentative" label="法人代表人"></el-table-column>
          <el-table-column property="legalRepresentativePhone" label="法人代表人电话"></el-table-column>
          <el-table-column property="serialNumber" label="统一社会信用代码"></el-table-column>
        </el-table>
      </el-col>
      <el-col class="p-10 text-right">
        <el-pagination
          :current-page="queryData.pageIndex"
          :page-size="queryData.pageSize"
          :total="queryData.total"
          layout="total, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </el-row>
    <choose-area v-if="showAreaDialog" ref="chooseArea" type="area" @selectClick="nodeClick"></choose-area>
  </el-dialog>
</template>
<script>
import companyService from "../../api/secutity/company";
export default {
  name: "chooseEnterprise",
  props: {
    isLuShangShiYou: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    regionIds: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showEnterDialog: true, // 显示dialog
      showAreaDialog: false,
      queryForm: { companyName: "", area: "" }, // 查询form
      loading: false, // load 加载
      selectData: [], // 选中item
      queryData: {
        pageIndex: 1,
        pageSize: 10,
        countTotal: false,
        total: 0,
        sort: "id", // 排序字段
        order: "DESC", // ASC 正序  DESC倒序,
        companyName: "",
        regionIds: "",
        regionName: ""
      },
      gridData: [] // 网格数据
    };
  },
  methods: {
    show() {
      if (this.isLuShangShiYou == true) {
        this.$set(this.queryData, "isLuShangShiYou", true);
      }
      this.showEnterDialog = true;
      this.$nextTick(() => {
        if (this.regionIds == "") {
          this.queryData.regionIds = "," + this.$store.state.currentUser.grid.regionId + ",";
        } else {
          this.queryData.regionIds = "," + this.regionIds + ",";
        }
        this.getCompanyList();
      });
    },
    getCompanyList() {
      this.loading = true;
      if (this.queryData.pageIndex == 1) {
        this.queryData.countTotal = true;
      } else {
        this.queryData.countTotal = false;
      }

      companyService
        .getVoList(this.queryData)
        .then(res => {
          this.gridData = res.data.items;
          if (this.queryData.pageIndex == 1) {
            this.queryData.total = res.data.total;
          }
        })
        .then(() => {
          setTimeout(() => {
            this.loading = false;
          }, 200);
        });
    },
    onQuery() {
      this.queryData.pageIndex = 1;
      this.queryData.companyName = this.queryForm.companyName;
      this.queryData.regionName = this.queryForm.area;
      this.getCompanyList();
    },
    onReset() {
      this.queryForm.companyName = "";
      this.queryForm.area = "";
      this.queryData.regionName = "";
      if (this.regionIds == "") {
        this.queryData.regionIds = "," + this.$store.state.currentUser.grid.regionId + ",";
      } else {
        this.queryData.regionIds = "," + this.regionIds + ",";
      }
      this.queryData.pageIndex = 1;
      this.queryData.companyName = "";
      this.getCompanyList();
    },
    onAdd() {
      if (this.multiple) {
        if (this.selectData.length == 0) {
          this.$message({
            message: "请选择至少一条记录",
            type: "warning"
          });
          return;
        }
        this.$emit("chooseDetail", this.selectData);
      } else {
        if (this.selectData.length != 1) {
          this.$message({
            message: "请选择一条记录",
            type: "warning"
          });
          return;
        }
        this.$emit("chooseDetail", this.selectData[0]);
      }
      this.showEnterDialog = false;
    },
    selectTable(selection) {
      if (this.multiple) {
        this.selectData = selection;
      } else {
        this.selectData = selection;
        const select = this.selectData[this.selectData.length - 1];
        if (selection.length > 1) {
          selection.forEach(item => {
            this.$refs.tableref.toggleRowSelection(item);
          });
          this.$refs.tableref.toggleRowSelection(select, true);
        }
      }
    },
    handleSizeChange(size) {
      this.queryData.pageSize = size;
      this.getCompanyList();
    },
    handleCurrentChange(pageIndex) {
      this.queryData.pageIndex = pageIndex;
      this.getCompanyList();
    },
    chooseArea() {
      this.showAreaDialog = true;
      this.$nextTick(() => {
        this.$refs.chooseArea.show();
      });
    },
    nodeClick(data) {
      if (data != "cancel") {
        this.queryForm.area = data.regionName;
        this.queryData.regionIds = "," + data.id + ",";
      }
      this.showAreaDialog = false;
    },
    onClosesDialog() {
      this.$refs.queryForm.resetFields();
      this.showEnterDialog = false;
      this.$emit("ClosesDialog");
    }
  }
};
</script>
