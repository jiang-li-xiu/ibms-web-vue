<!--
 * @Descripttion: 
 * @version: 
 * @Author: CenMingGuang
 * @LastEditors: RobertFan
 * @Date: 2021-09-15 14:58:46
 * @LastEditTime: 2022-05-31 14:30:58
-->
<template>
  <div class="app-container assembly-container">
    <div class="card-container">
      <!-- 部门列表 -->
      <div class="department">
        <subsystem-side-bar ref="refP" title="巡更路线列表" placeholder="请输入巡更路线名称" :list="routeList" searchKey="routeName"
          :defaultProps="{
            children: 'children',
            label: 'id',
          }" @edit="edit" @add="add" @remove="remove"></subsystem-side-bar>
      </div>

      <!-- 列表数据 -->
      <div class="department-list">
        <!-- <patrol-route-table></patrol-route-table> -->
        <div class="patrol-person-table">
          <div class="assembly-table-title">{{ title }}</div>
          <!-- 查询 -->
          <div class="query" ref="queryRef">
            <div class="query-col">
              <el-button type="primary" @click="openDialogVisible" icon="el-icon-plus"
              :disabled="!treeId"
                v-hasPermi="['patrol:route:add']">添加</el-button>
            </div>
            <div class="query-col">
              <el-button :disabled="!treeId || !ids.length" type="danger" icon="el-icon-close" @click="batchDelete" v-hasPermi="['patrol:route:delete']">删除
              </el-button>
            </div>
          </div>

          <!-- 表格 -->
          <div class="table">
            <div class="table-container" :style="{ height: `calc(100vh - ${queryElHeight}px)` }">
              <el-table :data="tableList" border :max-height="tableHeight" @select="selectTable"
                @select-all="selectAll">
                <el-table-column align="center" type="selection" width="55">
                </el-table-column>
                <el-table-column align="center" label="地点名称" prop="positionName"></el-table-column>
                <el-table-column align="center" label="在线状态" prop="patrolStatus">
                  <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.patrolStatus == 1">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="地点图片" prop="image">
                  <template slot-scope="scope">
                    <el-image style="width: 50px; height: 50px" :src="scope.row.image"
                      :preview-src-list="[...scope.row.image]">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" @click="deleteLine(scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 分页 -->
          <pagination class="pagination" v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SubsystemSideBar from "@/components/SubsystemSideBar/indexForpatrol.vue";
// import PatrolRouteTable from "./PatrolRouteTable.vue";
import { TableListMixin } from "@/mixins/TableListMixin";
import bus from "@/utils/bus.js";
import {
  getPatrolRouterList,
  addRouter,
  updateRouter,
  deletePatrolRoute,
  getPatrolRoute,
  putRoutUnbindByIds,
  getRoutGetUnBindPosition,
  putRout,
} from "@/api/subsystem/envir-monitoring/patrol-eqpt/index.js";
export default {
  components: {
    SubsystemSideBar,
    // PatrolRouteTable
  },
  mixins: [TableListMixin],
  data() {
    return {
      // 查询区域的高度
      refP: "",
      routeList: [],
      defaultProps: {
        children: "children",
        label: "routeName",
      },
      queryParams: {
        name: "routeName",
        pageNum: 1,
        pageSize: 10,
      },

      // 列表数据
      title: "请选择巡更路线", //标题
      ids: [], //多选后获取到的id
      // 查询区域的高度
      tableHeight: "0px",
      queryElHeight: 0,
      // 弹窗开关
      dialogVisible: false,
      // 弹窗查询参数
      // queryParams: {
      //   pageNum:1,
      //   pageSize:10,
      //   positionName: "", // 地点名称
      //   id:null
      // },
      dialogTableData: [], //新增面板数据
      treeId: null,
      selectTableCheckout: [],
      // 添加面板表格多选
      selectTableCheckoutPlanel: [],
      // 添加面板多选ids
      positionIds: null,
    };
  },
  mounted() {
    this.getRouteData();
    // 获取树形组件回传的数据、子组件互相传值
    bus.$on("busMethod", (data) => {
      if (data) {
        this.getTitle(data);
      }
    });

    this.$nextTick(() => {
      this.getTableElHeight();
    });
    // 监听查询区域的高度
    window.addEventListener("resize", this.getTableElHeight);
  },

  beforeDestroy() {
    // 取消监听
    window.removeEventListener("resize", this.getTableElHeight);
    bus.$off("busMethod");
  },

  methods: {
    //删除
    remove(ids) {
      let that = this;
      that
        .$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          deletePatrolRoute(ids).then(({ code, message }) => {
            if (code == 200) {
              that.$message({
                type: "success",
                message: message,
              });
              that.getRouteData();
            } else {
              that.$message({
                type: "warning",
                message: message,
              });
            }
          });
        })
        .catch((error) => {
          console.log(error);
          if (error == "cancel") {
            that.$message({
              type: "info",
              message: "已取消删除",
            });
          } else {
            that.$message.error(error);
          }
        });
    },
    // 添加
    add(a) {
      var data = { routeName: a.name };
      console.log("添加", a, data);
      if (data.routeName === null || data.routeName === "") {
        this.$message({
          type: "warning",
          message: "路线名称不能为空，请重新输入",
        });
        return;
      }

      addRouter(data).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getRouteData();
        }
      });
    },
    // 编辑
    edit(e) {
      var data = {
        routeName: e.name,
        id: e.id,
      };
      console.log(data);
      updateRouter(data).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getRouteData();
        }
      });
    },
    getRouteData() {
      getPatrolRouterList(this.queryParams)
        .then(({ rows, total }) => {
          console.log(rows);
          this.routeList = rows.map((item) => {
            item.name = item.routeName;
            return item;
          });
          this.total = total;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 列表数据方法
    // 提交选好的巡更地点
    addPlanel() {
      if (!this.positionIds) return this.$message.warning("请选择数据");
      putRout({ id: this.treeId, positionIds: this.positionIds }).then(
        ({ code, message }) => {
          if (code == 200) {
            this.$message.success(message);
            this.dialogVisible = false;
            this.getList();
          } else {
            this.$message.error(message);
          }
        }
      );
    },

    // 打开新增面板
    openDialogVisible() {
      this.queryParams.id = this.treeId;
      this.getAddPanel();
      this.dialogVisible = true;
    },

    // 添加面板表格多选
    selectTablePanel(selection) {
      this.selectTableCheckoutPlanel = selection;
      this.positionIds = selection.map((item) => item.id).toString();
    },

    // 添加面板全选/反全选
    selectAllPlanel(selection) {
      this.positionIds = selection.map((item) => item.id).toString();
    },

    getTableElHeight() {
      const innerHeight = window.innerHeight;
      this.queryElHeight = this.$refs.queryRef.offsetHeight + 245;
      this.tableHeight = innerHeight - this.queryElHeight + "px";
    },

    // 表格多选触发
    selectTable(selection) {
      this.selectTableCheckout = selection;
      this.ids = selection.map((item) => item.id).toString();
    },

    // 表格多选全选/反全选
    selectAll(selection) {
      this.selectTableCheckout = selection;
      this.ids = selection.map((item) => item.id).toString();
    },

    // table数据请求
    async getList() {
      this.loading = true;
      let { code, rows, message, total } = await getPatrolRoute(this.treeId,this.queryParams);
      if (code == 200) {
        this.tableList = rows;
        this.total = total;
        this.loading = false;
      } else {
        this.$message.error(message);
        this.loading = false;
      }
    },

    // 删除Function
    deleteTotal() {
      let that = this;
      that
        .$confirm("此操作将永久删除数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          putRoutUnbindByIds(that.treeId, that.ids).then(
            ({ code, message }) => {
              if (code == 200) {
                that.$message({
                  type: "success",
                  message: message,
                });
                that.tableList = [];
                that.getList();
              } else {
                that.$message({
                  type: "warning",
                  message: message,
                });
              }
            }
          );
        })
        .catch((error) => {
          console.log(error);
          if (error == "cancel") {
            that.$message({
              type: "info",
              message: "已取消删除",
            });
          } else {
            that.$message.error(error);
          }
        });
    },

    // 批量删除
    batchDelete() {
      this.deleteTotal();
    },

    // 删除
    deleteLine(row) {
      this.ids = row.row.id;
      this.deleteTotal();
    },

    // 关闭新增面板
    close() {
      this.dialogVisible = false;
    },

    // 获取新增面板数据
    getAddPanel() {
      getRoutGetUnBindPosition(this.queryParams).then(({ code, data }) => {
        if (code == 200) {
          this.dialogTableData = data;
        }
      });
    },

    // 导出
    bindingClick() { },

    // 打印
    print() {
      printJS({
        printable: this.tableList,
        properties: [
          { field: "cardNumber", displayName: "卡号" },
          { field: "location", displayName: "地点名称" },
          { field: "department", displayName: "所在部门" },
          { field: "longitude", displayName: "经度" },
          { field: "latitude", displayName: "纬度" },
        ],
        type: "json",
        gridStyle: "border: 1px solid #3971A5; text-align: center",
        gridHeaderStyle: "border: 1px solid #3971A5;",
        scanStyles: false, // 不适用默认样式
        repeatTableHeader: false, // 打印json表头只显示在第一页
        style: "@page{size: auto; margin: 0cm 1cm 0cm 1cm;}", // 去除页眉页脚
        // scanStyles: false,
      });
    },

    // 查询地点
    searchPlace() {
      this.getAddPanel();
    },

    // 添加面板的重置
    resetForm() {
      this.resetFields();
      this.getAddPanel();
    },

    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
    },

    // 获取树形组件回传的数据
    getTitle(rowTree) {
      this.title = rowTree.name || "请选择巡更路线";
      this.treeId = rowTree.id;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.assembly-container {
  height: calc(100vh - 84px);
  background-color: #eee;
}

.card-container {
  height: calc(100vh - 124px);
  display: flex;
  justify-content: space-between;
}

.department {
  width: 20%;
}

.department-list {
  width: 79%;
  background-color: #fff;
}

// 列表数据样式
.patrol-person-table {
  height: 100%;
}

.assembly-table-title {
  letter-spacing: 2px;
  font-weight: 600;
  padding: 10px;
  font-size: 18px;
  border-bottom: 1px solid #d6d6d6;
}

// 内容
.assembly-table-main {
  height: calc(100vh - 210px);
  overflow: hidden;
}

.query {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 15px;
}

.query-col {
  margin-right: 15px;
}

.table {
  margin: 0 15px;
}

// 分页
.pagination {
  margin-top: 5px;
}

.search-refresh-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
