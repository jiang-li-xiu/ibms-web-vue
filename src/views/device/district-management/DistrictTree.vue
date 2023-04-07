<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-08-02 17:12:11
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-26 17:11:27
-->
<template>
  <div class="districttree" @click="popupShow = false">
    <!-- 顶部标题 -->
    <div class="districttree-title">区域列表</div>

    <!-- 搜索 -->
    <div style="padding: 10px">
      <el-input placeholder="输入区域名称查询" v-model="filterText"></el-input>
    </div>

    <!-- 树形 -->
    <div class="item_tree">
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        :highlight-current="true"
        node-key="regionId"
        :default-expanded-keys="defaultExpandedKeys"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        ref="tree"
      ></el-tree>
      <!-- <ul
        v-hasRole="['admin', 'oneLevel', 'twoLevel']"
        v-if="popupShow"
        class="mouse_right cursor"
        :style="{
          top: popupLocation.top + 'px',
          left: popupLocation.left + 'px',
        }"
      >
        <li @click="addNode(1)">添加节点</li>
        <li @click="renameNode">重命名</li>
        <li @click="deleteNode">删除</li>
      </ul>-->
    </div>

    <!-- 添加/编辑 -->
    <!-- <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import bus from "@/utils/bus.js";

import {
  getAreaTree,
  addAreaTree,
  deleteAreaTree,
  renameAreaTree,
} from "@/api/device/districtManagement";
export default {
  name: "DistrictTree",
  props: {},
  data() {
    return {
      // 搜索字段
      filterText: "",
      // 树形数据
      treeData: [],
      // 修改树形默认数据
      defaultProps: {
        children: "children",
        label: "regionName",
      },
      // 右键属性弹窗位置
      popupLocation: {
        top: null,
        left: null,
      },
      // 右键弹窗显示控制
      popupShow: false,
      // 节点id
      regionId: 0,
      // 节点父id
      fid: 0,
      // 树形默认展开的id列表
      defaultExpandedKeys: [0],
    };
  },
  created() {
    this.getTree();
  },

  mounted() {
    // 获取树形组件回传的数据、子组件互相传值
    bus.$on("busMethod", (data) => {
      this.defaultExpandedKeys.push(data.regionId);
      this.getTree();
    });
  },

  beforeDestroy() {
    bus.$off("busMethod", this.getTree); // 组件销毁时关闭监听
  },

  methods: {
    // 获取树形数据
    getTree() {
      getAreaTree({ regionId: 0 }).then((response) => {
        let list = [
          {
            regionId: 0,
            fid: 0,
            regionName: "全部",
            children: response.data,
          },
        ];
        this.treeData = this.fnb(list);
      });
    },

    reformTree(data) {
      for (let key in data) {
        if (key == "regionId") {
          data["id"] = data["regionId"].toString();
        }

        if (typeof data[key] == "object") {
          this.reformTree(data[key]);
        }
      }
      return data;
    },

    // 搜索功能：对树节点进行筛选时执行的方法
    filterNode(value, data) {
      if (!value) return true;
      return data.regionName.indexOf(value) !== -1;
    },

    // 鼠标左键方法
    handleNodeClick(data) {
      bus.$emit("busMethod", data); //传递id到table组件
      console.log(data);
    },

    // 鼠标右键事件
    // handleNodeRightClick(tar, data) {
    //   // console.log(data);
    //   // 获取节点id，用于添加节点
    //   this.regionId = data.regionId;
    //   this.popupShow = true;
    //   let width =
    //     document.getElementsByClassName("sidebar-container")[0].offsetWidth;
    //   this.popupLocation.top = tar.clientY - 90;
    //   this.popupLocation.left = tar.clientX - width;
    // },
    // 添加树形节点
    // addNode(id) {
    //   let fid = 0
    //   if (id) {
    //     fid = this.regionId
    //   }
    //   this.$prompt('请输入节点名称', '添加区域', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //   })
    //     .then(({ value }) => {
    //       addAreaTree({ fid: fid, regionName: value }).then((response) => {
    //         this.msgSuccess('添加成功')
    //         this.getTree()
    //       })
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '取消输入',
    //       })
    //     })
    // },
    // 重命名树形节点
    // renameNode() {
    //   this.$prompt('请输入要修改的名称', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //   })
    //     .then(({ value }) => {
    //       renameAreaTree({ regionId: this.regionId, regionName: value }).then(
    //         (response) => {
    //           this.msgSuccess('修改成功')
    //           this.getTree()
    //         }
    //       )
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '取消输入',
    //       })
    //     })
    // },
    // // 删除树形节点
    // deleteNode() {
    //   this.$confirm('是否删除区域节点', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //   })
    //     .then(() => {
    //       deleteAreaTree(this.regionId).then((response) => {
    //         this.getTree()
    //         this.msgSuccess('删除成功')
    //       })
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除',
    //       })
    //     })
    // },
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
          item.children = this.fnb(item.children, " / ", site + ico + item.regionName);
          return item;
        }
      });
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>
<style scoped lang="scss">
.districttree {
  background: #fff;
  width: 15%;
  display: flex;
  flex-direction: column;
  .districttree-title {
    background-color: #434348;
    padding-left: 10px;
    color: #fff;
    height: 5vh;
    line-height: 5vh;
    position: relative;
    .el-icon-plus {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translate(0, -50%);
      font-size: 20px;
      cursor: pointer;
    }
    .el-icon-plus:hover {
      color: #268bd2;
    }
  }
}
// 鼠标右键出现弹窗 start
.mouse_right {
  z-index: 1001;
  background: #f8f8f9;
  position: absolute;
  width: 120px;
  background-color: #fff;
  box-shadow: 0px 0px 10px #888888;
}

.mouse_right > li {
  width: 120px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  text-align: center;
}
.mouse_right > li:hover {
  background: #ebeef5;
}
</style>
