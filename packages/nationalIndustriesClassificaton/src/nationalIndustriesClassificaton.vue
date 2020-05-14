<template>
  <el-dialog
    :visible.sync="dialogEconTreeVisible"
    :lock-scroll="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="国民经济分类"
    width="50%"
    append-to-body
    @close="onDialogClose"
  >
    <el-row class="chooseindustry" type="flex">
      <el-col
        :span="8"
        class="overflow-y"
        style="border-right:1px solid #EBEEF5;"
      >
        <el-tree
          :data="econData"
          :props="econtProps"
          :load="loadNode"
          lazy
          @node-click="onTreeNodeClick"
        ></el-tree>
      </el-col>
      <el-col :span="16">
        <div class="w-100 h-50 bg-white text-left">
          <second-header label="待选择"></second-header>
          <el-checkbox-group
            v-model="checkedHymcs"
            class="pt-10 pl-10"
            @change="handleCheckedHymcsChange"
          >
            <el-checkbox
              v-for="(hymc, index) in hymcs"
              :label="hymc.tradeName"
              :key="index"
              :name="hymc.tradeName"
              >{{ hymc.tradeName }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <div class="w-100 h-50 overflow-y bg-white text-left mt-5">
          <second-header label="已选择"></second-header>
          <el-checkbox-group
            v-model="hymcSumSelected"
            class="pt-10 pl-10"
            @change="onHymcSumSelectedChange"
          >
            <el-checkbox
              v-for="(hymc, index) in hymcSum"
              :label="hymc.label"
              :key="index"
              >{{ hymc.label }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onDialogClose">取 消</el-button>
      <el-button type="primary" @click="handleEconClick">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import econTreeService from "../../api/register/nationalEconomyType";
export default {
  name: "zhNic",
  data() {
    return {
      loading: false,
      dialogEconTreeVisible: false,
      queryData: {
        parentId: -1,
        queryWbj: "",
        attributename: "",
        classname: "",
        pageSize: "1000",
        sort: "sortId", // 排序字段
        order: "ASC" // ASC 正序  DESC倒序
      },
      industry: "", // 行业领域
      industryIds: "", // 行业领域id
      econtProps: {
        label: "tradeName",
        isLeaf: "leaf"
        // disabled:"leaf"
      },
      fieldSplices: "→", // 拼接的图标
      econData: [], // 查询国民经济分类树
      hymcs: [], // 行业待选择的check组
      checkedHymcs: [], // 行业待选择的选中项
      hymcSum: [], // 行业选择下的已选择的check组
      hymcSumSelected: [] // 二次选择行业
    };
  },
  methods: {
    show() {
      this.dialogEconTreeVisible = true;
      this.$nextTick(() => {
        this.getEconListData();
      });
    },

    // 国民经济分类懒加载
    loadNode(node, resolve) {
      if (node.level != 0) {
        this.queryData.parentId = node.data.id;
        econTreeService.getList(this.queryData).then(res => {
          if (node.data.leaf == false) {
            resolve(res.data);
          } else {
            resolve([]);
          }
        });
      }
    },
    getEconListData() {
      econTreeService.getList(this.queryData).then(res => {
        this.econData = res.data;
      });
    },
    getHymcListData() {
      econTreeService.getList(this.queryData).then(res => {
        this.hymcs = res.data;
      });
    },

    /**
     * 拼接选中的值
     */
    getParentEconStr: function(node) {
      if (node.label != undefined) {
        if (this.address == "") {
          this.address = node.label;
          this.ids = "," + node.data.industryCode;
        } else {
          this.address = node.label + this.fieldSplices + this.address;
          // this.address = this.address
          this.ids = `,${node.data.id}` + this.ids;
        }
        // 获取该节点的父级
        this.getParentEconStr(node.parent);
      } else {
        this.ids = this.ids + ",";
      }
    },
    /**
     * 树节点选中
     */
    onTreeNodeClick(data, node, vm) {
      if (node.data.leaf == true) {
        this.queryData.parentId = node.data.id;
        this.getHymcListData();
      }
      this.address = "";
      this.ids = "";
      // this.checkedHymcs = []
      this.getParentEconStr(node);
    },
    /**
     * 多选框选中操作
     */
    handleCheckedHymcsChange() {
      let obj = {};
      // 遍历选中的checkbox数组，将选中后的值重新编辑后赋给数组
      this.hymcs.forEach(item => {
        obj = {};
        this.checkedHymcs.forEach(element => {
          if (item.tradeName == element) {
            obj = Object.assign({}, { label: element, id: item.industryCode }); // 2019/07/10 阳哥说改为这个值
            // obj = Object.assign({}, { label: element, id: item.id })
            // obj = { label: this.address + this.fieldSplices + element, id: item.id } // 2019/07/10 旭哥说不需要前面的行业
            this.hymcSum.push(obj);
          }
        });
      });
      // 对象数组去重
      if (this.hymcSum.length > 1) {
        this.hymcSum = this.hymcSum.reduce((cur, next) => {
          obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
          return cur;
        }, []);
      }
      // 删除未选中项（用于取消选中时操作）
      const hs = [];
      for (let i = 0; i < this.hymcSum.length; i++) {
        const item = this.hymcSum[i];
        const e = item.label.split(this.fieldSplices);
        hs.push(e[e.length - 1]);
      }
      // const hs = [...this.hymcSum]
      // 显示的已选择数组和选中的数组中无重复的值，即未选中的值
      const filterHs = hs.concat(this.checkedHymcs).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
      });
      // 根据筛选出的未选中值，到显示数组中进行删除
      for (let i = 0; i < filterHs.length; i++) {
        const item = filterHs[i];
        if (hs.includes(item)) {
          this.hymcSum.splice(hs.findIndex(val => val == item), 1);
        }
      }
      // 将结果给全部选中
      this.hymcSumSelected = [];
      this.hymcSum.forEach(element => {
        this.hymcSumSelected.push(element.label);
      });
    },
    // 已选择的多选框二次操作
    onHymcSumSelectedChange() {
      // 找到未选中的对象,并进行删除
      for (let i = 0; i < this.hymcSum.length; i++) {
        const item = this.hymcSum[i];
        const label = item.label;
        let isExist = false;
        // 找到未选中项，改变参数
        for (let j = 0; j < this.hymcSumSelected.length; j++) {
          const element = this.hymcSumSelected[j];
          if (element === label) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          // 如果找到未选中对象则进行删除
          this.hymcSum = this.hymcSum.filter(i => {
            return i.label != item.label;
          });
          // const v = item.label.split(this.fieldSplices)
          // 同步删除上边已选中项
          // this.checkedHymcs.splice(this.checkedHymcs.findIndex((val) => val == v[v.length - 1]), 1) // 2019/07/10 旭哥说不需要前面的行业
          this.checkedHymcs.splice(
            this.checkedHymcs.findIndex(val => val == item.label),
            1
          );
        }
      }
    },
    // 选择确定后进行的操作，拼接值
    handleEconClick() {
      const arr = [];
      const arrObj = {};
      // 获取选中的值，对对象数组进行筛选和拼接
      for (let i = 0; i < this.hymcSum.length; i++) {
        const item = this.hymcSum[i];
        const obj = (({ id, label }) => ({ id, label }))(item);
        arr.push(obj);
        if (i == 0) {
          this.$set(arrObj, "id", "," + obj.id + ",");
          this.$set(arrObj, "label", obj.label);
        } else {
          this.$set(arrObj, "id", arrObj.id + obj.id + ",");
          this.$set(arrObj, "label", arrObj.label + "," + obj.label);
        }
      }
      // 将筛选的值重新赋值给对象数组
      this.hymcSum = Object.assign([], arr);
      this.$emit("industry", arrObj);
      this.dialogEconTreeVisible = false;
    },
    onDialogClose() {
      this.$emit("industry", "cancel");
      this.dialogEconTreeVisible = false;
    }
  }
};
</script>
<style lang="scss">
.chooseindustry {
  height: 400px;
  @media (min-width: 1920px) {
    height: 600px;
  }
}
</style>
