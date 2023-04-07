<template>
  <div class="regionalListTree">
    <!-- 顶部标题 -->
    <div class="title">{{ title }}</div>
    <!-- 搜索 -->
    <div class="search" v-if="show">
      <el-input :placeholder="placeholder" v-model="filterText"></el-input>
    </div>
    <!-- 树形 -->
    <div class="tree">
      <el-tree
        v-if="condition"
        class="filter-tree"
        :data="dataList"
        :props="defaultProps"
        accordion
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :default-expanded-keys="defaultExpandedKeys"
        node-key="regionId"
        @node-click="handleNodeClick"
        ref="tree"
      >
        <template #default="{ node, data }">
          <div class="tree-item">
            <div class="tree-item-name">{{ node.label }}</div>
            <div class="tree-item-btn">
              <el-tooltip
                class="item"
                effect="dark"
                content="添加子节点"
                :enterable="false"
                placement="top"
                v-if="data.regionLevel < 5"
              >
                <em class="el-icon-plus" @click="handleOpenDialog(data)"></em>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                :enterable="false"
                placement="top"
                v-if="data.regionId !== 0"
              >
                <em class="el-icon-edit" @click="handleEditRegion(data)"></em>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                :enterable="false"
                placement="top"
                v-if="data.regionId !== 0"
              >
                <em
                  class="el-icon-delete"
                  @click="handleRemoveRegion(data)"
                ></em>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-tree>
    </div>
    <!-- 编辑区域 -->
    <region-edit
      ref="RegionEditDialog"
      @getData="getDataEmit"
      @getDataAdd="getDataAdd"
    ></region-edit>
  </div>
</template>

<script>
import RegionEdit from "./RegionEdit";
import bus from "@/utils/bus.js";

import { removeRegion } from "@/api/system/regionalManagement.js";

export default {
  components: {
    RegionEdit,
  },
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
    treeData: {
      type: Array,
      default: () => {
        return [
          {
            label: "一级 1",
            regionName: "一级 1",
            children: [
              {
                regionName: "二级 1-1",
                label: "一级 1 / 二级 1-1",
                children: [
                  {
                    regionName: "三级 1-1-1",
                    label: "一级 1 / 二级 1-1 / 三级 1-1-1",
                  },
                ],
              },
            ],
          },
        ];
      },
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          label: "regionName",
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
      condition: true,
      dataList: [],
      // 弹窗开关
      dialogVisible: false,
      formData: {},
      // 验证表单
      rules: {
        regionName: [
          { required: true, message: "请输入区域名称", trigger: "blur" },
        ],
        fid: [{ required: true, message: "请选择父级区域", trigger: "blur" }],
        regionType: [
          { required: true, message: "请选择区域类型", trigger: "blur" },
        ],
        // subSytemCodes: [
        //   { required: true, message: '请选择子系统', trigger: 'blur' },
        // ],
      },
      // 当前选择的父级区域
      parentRegion: {},
      // 区域类型
      regionTypes: [],
      // 子系统列表
      subSystems: [],
      // 默认展开的id数组
      defaultExpandedKeys: [0],
    };
  },
  created() {
    this.getData(this.treeData);
    bus.$on("refreshTree", (id) => {
      this.defaultExpandedKeys = [id];
      this.$emit("getData");
    });
  },
  beforeDestroy() {
    bus.$off("refreshTree"); // 组件销毁时关闭监听
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    treeData: function (val) {
      this.getData(val);
    },
  },

  methods: {
    getData(val) {
      let list = [
        {
          regionId: 0,
          fid: 0,
          regionName: "全部",
          regionLevel: 0,
          children: val,
        },
      ];
      this.condition = false;
      this.dataList = this.fnb(list);
      this.condition = true;
    },
    /*
     * list 这里开始为 arr 数组
     * ico 连接 的字符
     * site 记录前一段的位置
     */
    fnb(list, ico = "", site = "") {
      return list.map((item) => {
        item.label = site + ico + item.regionName;
        // 判断有没有子节点 NO
        if (!item.children) {
          return item;
        } else {
          item.children = this.fnb(
            item.children,
            " / ",
            site + ico + item.regionName
          );
          return item;
        }
      });
    },
    // 搜索功能：对树节点进行筛选时执行的方法
    filterNode(value, data) {
      if (!value) return true;
      return data["regionName"].indexOf(value) !== -1;
    },

    // 鼠标左键方法
    handleNodeClick(data) {
      this.$emit("getTreeNode", data); //传递id到table组件
    },
    // 获取区域类型字典
    getRegionTypeDicts() {
      this.getDicts("region_type").then((res) => {
        this.regionTypes = res.data;
      });
    },
    // 获取子系统列表
    async getSubSystems() {
      const { data } = await getSubSystemList();
      this.subSystems = data;
    },
    // 打开弹窗
    handleOpenDialog(data) {
      this.$refs.RegionEditDialog.add(data);
      this.$refs.RegionEditDialog.title = "新增";
      // 打开弹窗
      this.$refs.RegionEditDialog.dialogVisible = true;
    },
    // 编辑区域
    handleEditRegion(data) {
      this.$refs.RegionEditDialog.edit(data);
      this.$refs.RegionEditDialog.title = "编辑";
      // 打开弹窗
      this.$refs.RegionEditDialog.dialogVisible = true;
    },
    // 删除区域
    handleRemoveRegion(data) {
      this.$confirm(
        `此操作将永久删除该区域 '${data.regionName}', 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          removeRegion(data.regionId).then((res) => {
            this.$message.success("删除成功!");
            // 刷新数据
            this.$emit("getData");
            this.defaultExpandedKeys = [data.fid];
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
.regionalListTree {
  height: 100%;
  background: #fff;
  .title {
    background-color: #434348;
    text-align: center;
    color: #fff;
    height: 5vh;
    line-height: 5vh;
    font-weight: 600;
    font-size: 15px;
  }
  .search {
    padding: 10px;
  }
  .tree-item {
    width: 100%;
    position: relative;

    .tree-item-btn {
      display: none;
      position: absolute;
      top: 0;
      right: 6%;
      i {
        line-height: 16px;
        margin-left: 10px;
        cursor: pointer;
        &:hover {
          transform: scale(1.2);
          &:nth-child(1) {
            color: #409eff;
          }
          &:nth-child(2) {
            color: #67c23a;
          }
          &:last-child {
            color: #f56c6c;
          }
        }
      }
    }
    &:hover {
      .tree-item-btn {
        display: block;
      }
    }
  }
}
</style>
