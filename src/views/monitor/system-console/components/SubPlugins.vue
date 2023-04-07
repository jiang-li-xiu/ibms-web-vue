<template>
  <div class="app-container">
    <el-card style="margin-bottom: 10px; margin-top: -20px">
      <div>
        <el-row :gutter="10" style="text-align: center">
          <el-col :span="8">全部子插件</el-col>
          <el-col :span="8"
            ><div class="status-point" style="color: rgb(13, 206, 61)"></div>
            已启用</el-col
          >
          <el-col :span="8"
            ><div class="status-point" style="color: rgb(240, 50, 2)"></div>
            已停用</el-col
          >
        </el-row>
        <el-row :gutter="10" class="bg-title">
          <el-col :span="8">{{ countList.allCount || 0 }}</el-col>
          <el-col :span="8">{{ countList.enableCount || 0 }}</el-col>
          <el-col :span="8">{{ countList.disableCount || 0 }}</el-col>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="100px"
      >
        <!-- <el-form-item label="服务名" prop="code">
          <el-input
            v-model="queryParams.code"
            placeholder="请输入服务名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <el-form-item label="子插件名称" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入子插件名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <div style="height: calc(100vh - 500px); overflow-y: auto">
        <sub-plugins-card
          v-for="(item, k) in pluginList"
          :key="k"
          :pluginBasicInfo="item"
          @subPlugins="subPlugins"
        />
      </div>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <el-empty
        v-show="total == 0"
        description="子插件信息为空"
        :image-size="300"
      ></el-empty>
    </el-card>
  </div>
</template>

<script>
import { queryPageByCode, countOfStatus } from "@/api/subsystem/plugin";
import SubPluginsCard from "@/components/SubPluginsCard";

// window.onbeforeunload = function (e) {
//   e = e || window.event;
//   if (e) {
//     e.returnValue = "关闭提示";
//   }
//   // return "关闭提示";

//   // let visitedViews = this.$store.state.tagsView.visitedViews,
//   //   index = visitedViews.findIndex(
//   //     (item) => item.fullPath == "/subsusteminfo/systemdetailpage"
//   //   );
//   // this.$store.state.tagsView.visitedViews.splice(index, 1);
//   // this.$router.push({ path: "/monitor/system-console" });
// };

export default {
  name: "subPlugins",
  components: {
    SubPluginsCard,
  },
  props: {
    serviceName: {
      type: String,
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 子系统管理表格数据
      pluginList: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: undefined,
        title: undefined,
      },
      countList: {},
    };
  },

  mounted() {},

  methods: {
    // 子组件更新重新获取数据
    subPlugins() {
      this.getList(this.serviceName);
    },

    /** 查询子系统管理列表 */
    getList(data) {
      this.loading = true;
      queryPageByCode(data, this.queryParams).then((response) => {
        this.pluginList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },

    // 统计子插件起停用数量
    getCountOfStatus(data) {
      countOfStatus(data).then((res) => {
        this.countList = res.data;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        systemId: null,
        systemName: null,
        systemGroup: null,
        systemStatus: "0",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.serviceName);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  },

  watch: {
    serviceName: {
      handler(newVal) {
        console.log("newVal", newVal);
        this.getList(newVal);
        this.getCountOfStatus(newVal);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.status-point {
  width: 5px;
  height: 5px;
  border: 5px solid;
  border-radius: 5px;
  display: inline-block;
}
.bg-title {
  font-size: 24px;
  font-weight: 800;
  text-align: center;
}
</style>
