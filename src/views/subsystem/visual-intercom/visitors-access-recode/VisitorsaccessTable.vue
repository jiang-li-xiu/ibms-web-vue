<template>
  <div>
    <div class="assembly-table-title">{{ title }}<span>出入情况</span></div>
    <div class="assembly-table-main">
      <!-- 查询选项 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :rules="queryFormRules"
        :inline="true"
      >
        <el-form-item label="姓名" prop="personName">
          <el-input
            v-model="queryParams.personName"
            placeholder="请输入姓名"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="卡号" prop="cardId">
          <el-input
            v-model="queryParams.cardId"
            placeholder="请输入卡号"
            clearable
          />
        </el-form-item>

        <el-form-item label="时间" prop="time">
          <el-date-picker
            v-model="queryParams.time"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="changeTime"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="地点" prop="deviceLocation">
          <el-input
            v-model="queryParams.deviceLocation"
            placeholder="请输入地点"
            clearable
          />
        </el-form-item>

        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 导出 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            :disabled="false"
            @click="bindingClick"
            icon="el-icon-download"
          >
            导出
          </el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button :disabled="false" @click="print" icon="el-icon-printer">
            打印
          </el-button>
        </el-col>
      </el-row>

      <!-- table表格 -->
      <el-table
        :row-key="rowKey"
        :height="tableHeight"
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="personName" />
        <el-table-column
          label="卡号"
          width="100"
          align="center"
          prop="cardId"
        />
        <el-table-column
          label="设备名称"
          width="200"
          align="center"
          prop="deviceName"
        />
        <el-table-column
          label="地点"
          align="center"
          prop="deviceLocation"
          show-overflow-tooltip
        />
        <el-table-column label="操作类型" align="center" prop="operateType" />
        <el-table-column
          label="时间"
          align="center"
          prop="eventTime"
          show-overflow-tooltip
        />

        <el-table-column align="center" label="访客抓拍">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              plain
              @click="seePictureFiles(scope.row)"
            >
              查看
            </el-button>
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
    </div>

    <!-- 图片查看窗 -->
    <el-dialog :visible.sync="dialogVisible" width="40%">
      <div class="image-box">
        <el-image class="images" :src="imageUrl"></el-image>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  postIntercomEventQuery,
  getPicUrl,
} from "@/api/subsystem/visual-intercom/visitorsAccessRecode";
import { TableListMixin } from "@/mixins/TableListMixin";

export default {
  mixins: [TableListMixin],
  data() {
    return {
      rowKey: "id",
      tableHeight: 0, //表格高度
      title: "全部", //标题
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        personName: "", // 访客名字
        cardId: "", // 卡号
        time: [], // 时间组件存放值
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        deviceLocation: "", //地点
      },
      // 检索验证
      queryFormRules: {
        // personName: [
        //   {
        //     validator: this.validateQueryFormRules,
        //     trigger: ["blur", "change"],
        //   },
        // ],
        // cardId: [
        //   {
        //     validator: this.validateQueryFormRules,
        //     trigger: ["blur", "change"],
        //   },
        // ],
        // deviceLocation: [
        //   {
        //     validator: this.validateQueryFormRules,
        //     trigger: ["blur", "change"],
        //   },
        // ],
      },
      // 操作类型 字典
      operateType: [],
      dialogVisible: false,
      imageUrl: "",
      interface: {
        getTableList: postIntercomEventQuery,
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
    // 获取字典数据
    this.getDicts("operate_type").then((response) => {
      this.operateType = response.data;
    });
  },
  mounted() {},
  methods: {
    // 查看访客抓拍
    async seePictureFiles(row) {
      let { data } = await getPicUrl(row.id);
      this.imageUrl = data;
      this.dialogVisible = true;
    },

    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 550;
    },

    // 导出
    bindingClick() {
      this.download("/intercom/export", { ids: this.selectedRowKeys }, "访客出入记录.xlsx");
    },

    // 打印
    print() {
      printJS({
        printable: this.tableList,
        properties: [
          { field: "personName", displayName: "姓名" },
          { field: "cardId", displayName: "卡号" },
          { field: "deviceName", displayName: "设备名称" },
          { field: "deviceLocation", displayName: "地点" },
          { field: "operateType", displayName: "操作类型" },
          { field: "eventTime", displayName: "时间" },
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

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.startTime = "";
      this.queryParams.endTime = "";
      this.getList();
    },

    //查看详情
    // viewdetailsClick(row) {
    //   this.dialogVisible = true;
    // },

    // 时间处理
    changeTime() {
      if (this.queryParams.time) {
        this.queryParams.startTime = this.parseTime(
          this.queryParams.time[0],
          "{y}-{m}-{d} {h}:{i}:{s}"
        );
        this.queryParams.endTime = this.parseTime(
          this.queryParams.time[1],
          "{y}-{m}-{d} {h}:{i}:{s}"
        );
      } else {
        this.queryParams.startTime = ""; // 开始时间
        this.queryParams.endTime = ""; // 结束时间
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.assembly-table-title {
  letter-spacing: 2px;
  font-weight: 600;
  padding: 10px;
  font-size: 18px;
  border-bottom: 1px solid #d6d6d6;
  span {
    margin-left: 5px;
  }
}
// 内容
.assembly-table-main {
  padding: 10px;
}
/* 弹框 */
.dialog-form {
  display: flex;
  div {
    flex: 1;
    border: 1px solid #bfbfbf;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-bottom: 0;
  }
  .dialog-form-left {
    background-color: #f2f2f2;
  }
}
.dialog-form:last-child {
  border-bottom: 1px solid #bfbfbf;
}

.image-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
}

.images {
  width: 100%;
  height: 100%;
}
</style>
