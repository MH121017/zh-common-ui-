<template>
  <el-tree
    ref="treeDropDownRef"
    :data="treeData"
    :props="props"
    highlight-current
    accordion
    @node-click="onNodeClick"
  >
    <span slot-scope="{node, data}" class="custom-tree-node-dropdown">
      <span class="text-eclipse">{{ node.label }}</span>
      <span v-if="!editable">
        <el-dropdown trigger="hover" @command="onDropDownCommand">
          <span>
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="editTypes.includes('add')"
              :command="{'type':'add', 'data': data, 'node': node}"
              class="text-primary"
              icon="el-icon-plus"
            >添加</el-dropdown-item>
            <el-dropdown-item
              v-if="editTypes.includes('edit')"
              :command="{'type':'edit', 'data': data, 'node': node}"
              class="text-warning"
              icon="el-icon-edit"
            >修改</el-dropdown-item>
            <el-dropdown-item
              v-if="editTypes.includes('delete')"
              :command="{'type':'delete', 'data': data, 'node': node}"
              class="text-danger"
              icon="el-icon-delete"
            >删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </span>
  </el-tree>
</template>
<script>
export default {
  name: "zhTreeDropDown",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default: () => {}
    },
    editable: {
      type: Boolean,
      default: false
    },
    editTypes: {
      type: Array,
      default: function() {
        return ["add", "edit", "delete"];
      },
      validater: function(value) {
        const defa = ["add", "edit", "delete"];
        if (!(defa instanceof Array) || !(value instanceof Array)) {
          return false;
        }
        if (defa.length < value.length) {
          return false;
        }
        const defaStr = defa.toString();
        for (let index = 0; index < value.length; index++) {
          if (defaStr.indexOf(value[index] == -1)) {
            return false;
          }
        }
        return true;
      }
    }
  },
  data() {
    return {
      treeData: []
    };
  },
  watch: {
    data: function(newVal) {
      this.treeData = this.data;
    }
  },
  mounted() {
    this.treeData = this.data;
  },
  methods: {
    onNodeClick(data, node, item) {
      this.$emit("nodeClick", data);
    },
    onDropDownCommand(command) {
      if (command.type == "add") {
        this.$emit("nodeAdd", command.data, command.node);
      } else if (command.type == "edit") {
        this.$emit("nodeEdit", command.data, command.node);
      } else if (command.type == "delete") {
        this.$emit("nodeDelete", command.data, command.node);
      }
    }
  }
};
</script>
<style lang="scss">
.custom-tree-node-dropdown {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>