<template>
  <div class="patrol-person-table">
    <div class="assembly-table-title">{{ title }}</div>
    <!-- 查询 -->
    <div style="margin: 7px 0; padding: 0 1em" ref="queryRef">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :rules="queryFormRules"
        inline
      >
        <el-form-item label="巡检人员名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入巡检人员名称"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label=" " label-width="100px">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >查询</el-button
          >
          <el-button @click="resetQuery" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table">
      <div
        class="table-container"
        :style="{ height: `calc(100vh - ${queryElHeight}px)` }"
      >
        <el-table
          :data="tableList"
          border
          :max-height="tableHeight"
          :row-key="rowKey"
        >
          <el-table-column
            align="center"
            label="卡号"
            prop="cardNum"
          ></el-table-column>
          <el-table-column
            align="center"
            label="人员名称"
            prop="peopleName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="所在部门"
            prop="deptName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="指纹数量"
            prop="fingerprintCount"
          ></el-table-column>
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
  </div>
</template>

<script>
import bus from "@/utils/bus.js";
import { getDeptList } from "@/api/subsystem/electronic-patrol/patrol-person/index.js";
import { TableListMixin } from "@/mixins/TableListMixin";

export default {
  mixins: [TableListMixin],
  data() {
    return {
      rowKey: "deviceId",
      // 查询区域的高度
      tableHeight: "0px",
      queryElHeight: 0,
      title: "所有部门", // 标题
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: 0, // 巡检部门id
        name: "", // 巡检人员名称
      },
      // 检索验证
      queryFormRules: {
        name: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },
      interface: {
        getTableList: getDeptList,
      }
    };
  },
  mounted() {
    // 获取树形组件回传的数据、子组件互相传值
    bus.$on("busMethod", (data) => {
      this.getTreeData(data);
    });

    // this.getTreeData();

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
    getTableElHeight() {
      const innerHeight = window.innerHeight;
      this.queryElHeight = this.$refs.queryRef.offsetHeight + 240;
      this.tableHeight = innerHeight - this.queryElHeight + "px";
    },

    // 导出
    bindingClick() {},

    // 打印
    print() {
      printJS({
        printable: this.tableList,
        properties: [
          { field: "cardNumber", displayName: "卡号" },
          { field: "name", displayName: "人员名称" },
          { field: "department", displayName: "所在部门" },
          { field: "count", displayName: "指纹数量" },
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

    // 获取树形组件回传的数据
    getTreeData(data) {
      console.log("获取树形组件回传的数据:", data);
      this.title = data.label;
      this.queryParams.deptId = data.id;
      this.getList();
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

.table {
  margin: 0 15px;
}

// 分页
.pagination {
  margin-top: 5px;
}
</style>
