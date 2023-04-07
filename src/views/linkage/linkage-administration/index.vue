<!--
 * @Author: MJ
 * @Date: 2021-07-13 12:00:09
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-19 09:21:46
 * @Description:
-->
<template>
  <div class="main">
    <div class="linkage-administration">
      <!-- 检索 -->
      <el-form
        :model="queryParams"
        :rules="queryFormRules"
        ref="queryForm"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="联动名称" prop="linkName">
          <el-input
            v-model="queryParams.linkName"
            placeholder="请输入联动名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态">
            <el-option
              v-for="item in enableStatus"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 新增 -->
      <el-button type="primary" @click="addLinkage">
        <em class="el-icon-plus"></em>
        新增联动
      </el-button>
      <!-- 列表 -->
      <linkage-data-list
        :linkageList="tableList"
        @trigger="triggers"
      ></linkage-data-list>
      <!-- 分页 -->
      <pagination
        class="pagination"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 新增/编辑面板 -->
    <linkage-edit-panel
      ref="modelForm"
      @ok="EditFormDialog"
    ></linkage-edit-panel>
  </div>
</template>

<script>
import { getLinkConfig } from "@/api/linkage/linkageAdministration";
import eventBus from "@/utils/eventBus";

// 列表组件
import LinkageDataList from "./LinkageDataList.vue";
// 编辑联动的组件
import LinkageEditPanel from "./LinkageEditPanel.vue";
import { TableListMixin } from "@/mixins/TableListMixin";

export default {
  mixins: [TableListMixin],
  components: {
    LinkageDataList,
    LinkageEditPanel,
  },

  data() {
    return {
      // 请求列表数据参数
      queryParams: {
        // 页数
        pageNum: 1,
        // 每页大小
        pageSize: 10,
        // 联动名称
        linkName: "",
        // 联动状态
        status: "",
      },
      // 检索验证
      queryFormRules: {
        linkName: [
          { validator: this.validateQueryFormRules, trigger: "change" },
        ],
      },
      // 字典
      enableStatus: [],
      interface: {
        getTableList: getLinkConfig,
      },
    };
  },

  mounted() {
    // 获取字典值
    this.getDictionaries();
    // 从头部组件传过来的值
    // 使用了兄弟组件间传参
    // 在组件实例创建时不会调用此代码段
    eventBus.$on("search", (val) => {
      this.queryParams.linkName = val.linkageName;
      this.queryParams.status = val.status;
      this.getList();
    });
  },

  methods: {
    // 获取字典数据
    getDictionaries() {
      this.getDicts("enable_status").then((response) => {
        let { data } = response;
        this.enableStatus = [...data];
      });
    },

    // 接收列表组件返回的值
    triggers({ type, id }) {
      if (type == "trigger") {
        this.getList();
      } else if (type == "editTrigger") {
        this.$refs.modelForm.edit(id);
        this.$refs.modelForm.title = "编辑";
      }
    },
    // 接收添加面板返回的数据
    addLinkage() {
      this.$refs.modelForm.add();
      this.$refs.modelForm.title = "新增";
    },
    EditFormDialog() {
      this.getList();
    },
  },
  beforeDestroy() {
    eventBus.$off("search"); // 组件销毁时关闭监听
  },
};
</script>

<style  lang='scss' scoped>
.main {
  padding: 20px;
  background-color: #eee;
}
.linkage-administration {
  min-height: calc(100vh - 124px);
  background: #fff;
  padding: 20px;
}
.pagination {
  // height: 60px;
  background-color: #fff;
}
// @media screen and (max-width: 830px) {
//   .list {
//     height: 100%;
//     overflow: auto;
//     position: static;
//   }
// }
</style>
