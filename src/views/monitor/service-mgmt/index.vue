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
      <el-form-item label="子系统名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" filterable clearable>
          <el-option label="启用" value="ENABLE"> </el-option>
          <el-option label="停用" value="DISABLE"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          v-hasPermi="['subsystem-mgr:subsystem:save']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          :disabled="single"
          @click="handleEdit"
          v-hasPermi="['subsystem-mgr:subsystem:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['subsystem-mgr:subsystem:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      :row-key="rowKey"
      :height="tableHeight"
      v-loading="loading"
      :data="subSystemList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="225%" />

      <el-table-column
        label="子系统图标"
        align="center"
        prop="icon"
        width="130"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>

      <el-table-column
        label="子系统名称"
        align="center"
        prop="title"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="服务名"
        align="center"
        prop="code"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <router-link
            :to="{
              path: '/subplugin/service/index',
              query: { code: scope.row.code },
            }"
            class="link-type"
          >
            <span>{{ scope.row.code }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="服务状态" align="center" prop="statusText" width="130">
        <template slot-scope="scope">
          <el-button type="primary" @click="editStatus(scope.row)">{{
            scope.row.statusText
          }}</el-button>
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

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link
            :to="{
              path: '/subplugin/service/index',
              query: { code: scope.row.code },
            }"
            style="margin-right: 16px"
          >
            <!-- <span class="link-type">详情</span> -->
            <el-button icon="el-icon-edit" type="primary">详情</el-button>
          </router-link>

          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
            v-hasPermi="['subsystem-mgr:subsystem:edit']"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['subsystem-mgr:subsystem:remove']"
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

    <add-or-edit ref="modelForm" @refreshList="getList" />
  </div>
</template>

<script>
import { queryPage, delBatch, putSubSystemsV1SetVisible } from "@/api/service/subsystem";
import { subSystemEnable, subSystemDisable } from "@/api/service/nacosService";

import AddOrEdit from "./addOrEdit";
import { TableListMixin } from "@/mixins/TableListMixin"

export default {
  mixins: [TableListMixin],
  name: "NoticeConfig",
  components: {
    AddOrEdit,
  },
  data() {
    return {
      visible: true,
      tableHeight: 0, //表格高度
      rowKey: "id",
      // 选中数组
      ids: [],
      // 公告表格数据
      subSystemList: [],
      serviceOptions: [],
      // 是否显示弹出层
      // open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        title: "",
        status: null,
      },
      interface: {
        delList: delBatch,
      },
    };
  },
  created() {
    this.getDicts("service_status").then((res) => {
      this.serviceOptions = res.data;
    });
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
  },
  mounted() {
  },
  methods: {
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 320;
    },
    statusFormat(row) {
      return this.selectDictLabel(this.serviceOptions, row.status);
    },

    /** 查询公告列表 */
    getList() {
      this.loading = true;
      queryPage(this.queryParams)
        .then((response) => {
          console.log("查询公告列表:", response);
          this.subSystemList = response.data.records.map((item) => {
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

    // 菜单显示隐藏
    menuIsShow(row) {
      console.log("菜单显示隐藏:", row.systemMenuId);
      putSubSystemsV1SetVisible(row.systemMenuId)
        .then((response) => {
          this.msgSuccess("请求成功");
          this.getList();
        })
        .catch(() => {
          this.msgError("请求失败");
        });
    },

    // 修改状态
    editStatus(e) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      console.log(e);

      if (e.status == "ENABLE") {
        subSystemDisable(e.code)
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
      } else {
        subSystemEnable(e.code)
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
      }
    },
  },
};
</script>
