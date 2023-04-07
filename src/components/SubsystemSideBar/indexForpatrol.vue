<template>
  <div class="subsystem-side-bar">
    <!-- 头部 -->
    <div class="head">
      <!-- 标题 -->
      <div class="title">{{ title }}</div>
      <!-- 添加按钮 -->
      <div class="add el-icon-plus" @click="dialogVisible = true"></div>
    </div>

    <!-- 搜索 -->
    <div class="search" v-if="show">
      <el-input
        :placeholder="placeholder"
        v-model="filterText"
        clearable
        prefix-icon="el-icon-search"
      ></el-input>
    </div>

    <!-- 列表 -->
    <div class="list">
      <div
        class="item"
        v-for="(item, index) in items"
        :key="item.id"
        @click="handleNodeClick(item, index)"
        :class="[activeIndex === index ? 'item-active' : '']"
      >
        <div class="content">{{ item.name }}</div>
        <!-- 按钮 -->
        <div class="btn">
          <div
            class="edit el-icon-edit"
            @click="handleEdit(item.name, item.id)"
          ></div>
          <div
            class="delete el-icon-delete"
            @click="handleDelete(item.id)"
          ></div>
        </div>
      </div>
    </div>

    <!-- 添加或编辑的弹出框 -->
    <el-dialog
      :title="is_edit ? '修改路线' : '添加路线'"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleDialogClose"
    >
      <el-form :model="formData">
        <el-form-item label-width="80px" label="路线名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入路线名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogSubmit">提 交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import bus from "@/utils/bus.js";
export default {
  props: {
    title: {
      type: String,
      default: () => {
        return "顶部标题";
      },
    },
    show: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    placeholder: {
      type: String,
      default: () => {
        return "请输入需要搜索的字段";
      },
    },
    list: {
      type: Array,
      default: () => {
        return [
          {
            id: 0,
            name: "测试1",
          },
          {
            id: 1,
            name: "测试21",
          },
          {
            id: 2,
            name: "测试3",
          },
        ];
      },
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          label: "label",
        };
      },
    },
    // 需要搜索的key值
    searchKey: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      // 搜索字段
      filterText: "",
      // 列表项数据
      items: [],
      // 当前选择的项
      activeIndex: 0,
      // 弹出框开关
      dialogVisible: false,
      // 打开编辑
      is_edit: false,
      // 修改或添加的数据
      formData: {
        name: "",
        id: null,
      },
    };
  },
  mounted() {
    // 发射
    this.$nextTick(() => {
      bus.$emit("busMethod", this.items[this.activeIndex]);
    });
  },
  watch: {
    // 监听列表数据
    list: {
      handler(val) {
        this.items = val;
      },
      immediate: true,
      deep: true,
    },
    // 监听搜索框
    filterText(val) {
      this.handleSearchClear();
      this.items = this.list.filter((v) => v.name.indexOf(val) !== -1);
      // this.$emit('busMethod', this.items[this.activeIndex])
    },
  },

  methods: {
    // 鼠标左键方法
    handleNodeClick(data, i) {
      // 保存点击的下标
      this.activeIndex = i;
      bus.$emit("busMethod", data); //传递id到table组件
    },
    // 清空搜索框回调
    handleSearchClear() {
      const obj = this.items[this.activeIndex];
      const index = this.list.findIndex((v) => v.id === obj.id);
      this.activeIndex = index;
    },
    // 关闭dialog的回调
    handleDialogClose() {
      // 关闭编辑
      this.is_edit = false;
      console.log(this.is_edit);
      // 清空数据
      this.formData.name = "";
    },
    // 打开编辑
    handleEdit(name, id) {
      console.log("object");
      // 打开编辑开关
      this.is_edit = true;
      // 填充数据
      this.formData = {
        name,
        id,
      };
      // 打开弹窗
      this.dialogVisible = true;
    },
    // 删除数据
    handleDelete(id) {
      // 发射事件
      this.$emit("remove", id);
    },
    // 弹出框点击提交
    handleDialogSubmit() {
      // 发射事件
      // 判断当前是添加还是编辑
      this.dialogVisible = false;
      if (!this.is_edit) return this.$emit("add", this.formData);
      this.$emit("edit", this.formData);
    },
  },
};
</script>

<style scoped lang="scss">
.subsystem-side-bar {
  min-height: calc(100vh - 124px);
  background: #fff;
  display: flex;
  flex-direction: column;
  .head {
    background-color: #434348;
    color: #fff;
    height: 5vh;
    line-height: 5vh;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 14px;
    }
    .add {
      font-size: 16px;
      font-weight: 600;
      color: #02a7f0;
      cursor: pointer;
    }
  }
  .search {
    padding: 10px;
  }

  .list {
    flex: 1;
    .item {
      height: 50px;
      line-height: 50px;
      text-align: center;
      position: relative;
      background-color: #fff;
      cursor: pointer;
      .content {
        font-size: 14px;
      }
      .btn {
        display: none;
        position: absolute;
        top: 0;
        right: 25px;
        color: #000;
        & > div {
          cursor: pointer;
          font-size: 14px;
          &:hover {
            transform: scale(1.2);
          }
        }
        .edit {
          margin-right: 15px;
          &:hover {
            color: #02a7f0;
          }
        }
        .delete:hover {
          color: #e91002;
        }
      }
      &:hover {
        background-color: #eee;
        .btn {
          display: block;
        }
      }
    }
    .item-active {
      background-color: #c0e9fc;
    }
  }
}
</style>
