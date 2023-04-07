<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="服务名" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入服务名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="子插件名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="服务状态" prop="status">
        <el-select v-model="queryParams.status" filterable placeholder="请选择">
          <el-option label="启用" value="ENABLE"> </el-option>
          <el-option label="停用" value="DISABLE"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label=" ">
        <el-button type="primary" icon="el-icon-search"  @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        <el-button icon="el-icon-refresh" @click="previousQuery"
          >返回上一页</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          v-hasPermi="['subsystem-mgr:subplugin:save']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['subsystem-mgr:subplugin:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['subsystem-mgr:subplugin:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      :height="650"
      :row-key="rowKey"
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" width="225%" />
      <el-table-column
        label="子系统图标"
        align="center"
        prop="icon"
        width="100"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        label="子插件名称"
        align="center"
        prop="title"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="服务名"
        align="center"
        prop="code"
        :show-overflow-tooltip="true"
      />

      <el-table-column label="服务状态" align="center" prop="status" width="130">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="changeEnableOrDisableForPlugin(scope.row)"
            >{{ scope.row.statusText }}</el-button
          >
        </template>
      </el-table-column>

      <el-table-column label="是否隐藏" align="center" prop="visible" width="130">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.visible"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            @change="menuIsShow(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>

      <!-- :formatter="statusFormat" :show-overflow-tooltip="true" -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['subsystem-mgr:subplugin:edit']"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['subsystem-mgr:subplugin:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <add-or-edit ref="addOrEdit" v-if="open" @refreshList="getList" />
  </div>
</template>

<script>
import {
  queryPage,
  delBatch,
  putSubsystemSubPluginsV1ServiceSetVisible,
} from "@/api/service/subplugin";
import { subPluginEnable, subPluginDisable } from "@/api/service/nacosService";

import AddOrEdit from "./components/addOrEdit";
import { TableListMixin } from "@/mixins/TableListMixin"

export default {
  mixins: [TableListMixin],
  name: "NoticeConfig",
  components: {
    AddOrEdit,
  },
  data() {
    return {
      rowKey:"id",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      // single: true,
      // 非多个禁用
      // multiple: true,
      // 显示搜索条件
      // showSearch: true,
      // 总条数
      // total: 0,
      // 公告表格数据
      // tableList: [],
      serviceOptions: [],
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      statusOptions: [],
      noticeOptions: [],
      height: 0,
      code: undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        title: null,
        status: null,
      },
    };
  },
  created() {
    this.code = this.$route.query.code;

    this.getDicts("service_status").then((res) => {
      this.serviceOptions = res.data;
    });
  },
  mounted() {
    // this.getList();
  },

  methods: {
    statusFormat(row) {
      return this.selectDictLabel(this.serviceOptions, row.status);
    },
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      queryPage(this.code, this.queryParams)
        .then((response) => {
          this.tableList = response.data.records.map((item) => {
            item.statusText = this.statusFormat(item);
            return item;
          });
          this.total = response.data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 显示隐藏
    menuIsShow(row) {
      // id
      putSubsystemSubPluginsV1ServiceSetVisible(row.code)
        .then((response) => {
          this.msgSuccess("请求成功");
          this.getList();
        })
        .catch(() => {
          this.msgError("请求失败");
        });
      console.log("菜单显示隐藏:", row);
    },

    // 插件启动或停用
    changeEnableOrDisableForPlugin(row) {
      console.log(row);
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      if (row.status == "ENABLE") {
        subPluginDisable(row.code)
          .then((res) => {
            loading.close();
            if (res.code === 200) {
              this.msgSuccess("请求成功");
              this.getList();
            } else {
              this.msgError("请求失败");
            }
          })
          .catch(() => {
            loading.close();
          });
        return;
      }
      subPluginEnable(row.code)
        .then((res) => {
          loading.close();
          if (res.code === 200) {
            this.msgSuccess("请求成功");
            this.getList();
          } else {
            this.msgError("请求失败");
          }
        })
        .catch(() => {
          loading.close();
        });
    },

    /** 搜索按钮操作 */
    // handleQuery() {
    //   this.queryParams.pageNum = 1;
    //   this.getList();
    // },
    /** 重置按钮操作 */
    // resetQuery() {
    //   this.resetForm("queryForm");
    //   this.handleQuery();
    // },

    // 返回上一页
    previousQuery() {
      // this.$router.go(-1);
      this.$router.push({
        path: "/monitor/service-mgmt",
      });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.addOrEdit.init({ parentCode: this.code });
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true;
      let code = {};

      if (row.id) {
        code = { id: row.id, code: row.code, parentCode: this.code };
      }
      if (this.ids.map((item) => item.id).length === 1) {
        code = this.ids.map((item) => {
          const plugin = {
            id: item.id,
            code: item.code,
            parentCode: this.code,
          };
          return plugin;
        })[0];
      }

      this.$nextTick(() => {
        this.$refs.addOrEdit.init(code);
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids.map((item) => item.id);
      this.$confirm('是否确认删除子插件服务编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delBatch(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
