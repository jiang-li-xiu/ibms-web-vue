<template>
  <div class="patrol-person-table">
    <div class="assembly-table-title" v-show="title">{{ title }}</div>
    <!-- 查询 -->
    <div class="query" ref="queryRef">
      <div class="query-col">
        <el-button
          type="primary"
          @click="openDialogVisible"
          icon="el-icon-plus"
          v-hasPermi="['patrol:route:add']"
          >添加</el-button
        >
      </div>
      <div class="query-col">
        <el-button
          type="danger"
          icon="el-icon-close"
          @click="batchDelete"
          v-hasPermi="['patrol:route:delete']"
          >删除</el-button
        >
      </div>

      <!-- <div class="query-col">
        <el-button @click="print" icon="el-icon-plus">打印</el-button>
      </div> -->
    </div>

    <!-- 表格 -->
    <div class="table">
      <div
        class="table-container"
        :style="{ height: `calc(100vh - ${queryElHeight}px)` }"
      >
        <el-table
          :data="tableData"
          border
          :max-height="tableHeight"
          @select="selectTable"
          @select-all="selectAll"
        >
          <el-table-column align="center" type="selection" width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="卡号"
            prop="cardNum"
          ></el-table-column>
          <el-table-column
            align="center"
            label="地点名称"
            prop="positionName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="所在部门"
            prop="positionDept"
          ></el-table-column>
          <el-table-column
            align="center"
            label="经度"
            prop="longitude"
          ></el-table-column>
          <el-table-column
            align="center"
            label="纬度"
            prop="latitude"
          ></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteLine(scope)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页 -->
    <pagination
      class="pagination"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- ************************************************************************************************ -->
    <!-- 添加巡更地点的弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      title="添加巡更地点"
      width="40%"
    >
      <!-- 头部查询 -->
      <div class="search-refresh-box">
        <!-- 查询区域 -->
        <div>
          <el-form
            ref="refQueryParameter"
            :model="queryPanel"
            label-position="right"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="卡号：" label-width="60px" prop="cardNum">
                  <el-input
                    v-model="queryPanel.cardNum"
                    clearable
                    placeholder="请输入卡号"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label="地点名称："
                  label-width="100px"
                  prop="positionName"
                >
                  <el-input
                    v-model="queryPanel.positionName"
                    clearable
                    placeholder="请输入地点名称"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <div>
          <el-button type="primary" icon="el-icon-search" @click="searchPlace"
            >查询</el-button
          >
          <el-button @click="resetForm" icon="el-icon-refresh">重置</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <div class="dialog-table">
        <div class="dialog-table-container">
          <el-table
            :data="dialogTableData"
            border
            max-height="500px"
            @select="selectTablePanel"
            @select-all="selectAllPlanel"
          >
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column
              align="center"
              label="卡号"
              prop="cardNum"
            ></el-table-column>
            <el-table-column
              align="center"
              label="地点名称"
              prop="positionName"
            ></el-table-column>
            <el-table-column
              align="center"
              label="所在部门"
              prop="positionDept"
            ></el-table-column>
            <el-table-column
              align="center"
              label="经度"
              prop="longitude"
            ></el-table-column>
            <el-table-column
              align="center"
              label="纬度"
              prop="latitude"
            ></el-table-column>
          </el-table>
        </div>
      </div>

      <template #footer>
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="addPlanel">提 交</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import bus from "@/utils/bus.js";
import {
  getPatrolRoute,
  putRoutUnbindByIds,
  getRoutGetUnBindPosition,
  putRout,
} from "@/api/subsystem/envir-monitoring/patrol-eqpt/index.js";
export default {
  data() {
    return {
      // 查询区域的高度
      tableHeight: "0px",
      queryElHeight: 0,
      loading: "", //加载
      title: "请选择巡更路线", //标题
      ids: [], //多选后获取到的id
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      // 弹窗开关
      dialogVisible: false,
      // 弹窗查询参数
      queryPanel: {
        id: null,
        cardNum: "", // 卡号
        positionName: "", // 地点名称
      },
      dialogTableData: [],
      treeId: null,
      selectTableCheckout: [],
      ids: null,
      // 添加面板表格多选
      selectTableCheckoutPlanel: [],
      // 添加面板多选ids
      positionIds: null,
    };
  },
  mounted() {
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

    // 添加面板全选/反全选
    selectAllPlanel(selection) {
      this.positionIds = selection.map((item) => item.id).toString();
    },

    // 添加面板表格多选
    selectTablePanel(selection) {
      this.selectTableCheckoutPlanel = selection;
      this.positionIds = selection.map((item) => item.id).toString();
    },

    // 查询地点
    searchPlace() {
      this.getAddPanel();
    },

    // 表格多选全选/反全选
    selectAll(selection) {
      this.selectTableCheckout = selection;
      this.ids = selection.map((item) => item.id).toString();
    },

    // 表格多选触发
    selectTable(selection) {
      this.selectTableCheckout = selection;
      this.ids = selection.map((item) => item.id).toString();
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
                that.tableData = [];
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
      if (!this.ids) return this.$message.warning("请选择");
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
      getRoutGetUnBindPosition(this.queryPanel).then(({ code, data }) => {
        if (code == 200) {
          this.dialogTableData = data;
        }
      });
    },

    // 打开新增面板
    openDialogVisible() {
      if (!this.treeId) return this.$message.warning("请先选择巡更路线");
      this.queryPanel.id = this.treeId;
      this.getAddPanel();
      this.dialogVisible = true;
    },

    getTableElHeight() {
      const innerHeight = window.innerHeight;
      this.queryElHeight = this.$refs.queryRef.offsetHeight + 245;
      this.tableHeight = innerHeight - this.queryElHeight + "px";
    },

    // 导出
    bindingClick() {},

    // 打印
    print() {
      printJS({
        printable: this.tableData,
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

    // 添加面板的重置
    resetForm() {
      this.$refs.refQueryParameter.resetFields();
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

    // table数据请求
    async getList() {
      this.loading = true;
      let { code, rows, message, total } = await getPatrolRoute(this.treeId);
      if (code == 200) {
        this.tableData = rows;
        this.total = total;
        this.loading = false;
      } else {
        this.$message.error(message);
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
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
