<!--
 * @Author: your name
 * @Date: 2021-09-08 19:10:41
 * @LastEditTime: 2022-05-17 16:22:47
 * @LastEditors: PengXuanwei
 * @Description: In User Settings Edit
 * @FilePath: \ibms-web-vue\src\views\subsystem\parking-system\parking-equipment\assembly-table.vue
-->
<template>
  <el-card class="min-height-124">
    <div class="table-title">{{ regionInfo.title }}</div>
    <!-- <div class="query" ref="queryRef"> -->
    <!-- 查询选项 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      :rules="queryFormRules"
      :inline="true"
    >
      <el-form-item label="通道名称" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入通道名称"
          clearable
          @keyup.enter.native="handleQuery"
          @clear="handleInputClear('remark')"
        />
      </el-form-item>
      <el-form-item label="通道编码" prop="deviceCode">
        <el-input
          v-model="queryParams.deviceCode"
          placeholder="请输入通道编码"
          clearable
          @keyup.enter.native="handleQuery"
          @clear="handleInputClear('deviceCode')"
        />
      </el-form-item>
      <el-form-item label="报警时间" prop="time">
        <el-date-picker
          v-model="queryParams.time"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 导出 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-download" @click="bindingClick"
          >导出</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button :disabled="false" @click="print" icon="el-icon-printer">
          打印
        </el-button>
      </el-col>
    </el-row>
    <!-- </div> -->

    <!-- 表格 -->
    <el-table
      :row-key="rowKey"
      border
      v-loading="loading"
      :data="invasionRecordList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="报警类型" align="center" prop="eventName" />
      <el-table-column
        label="报警通道名称"
        align="center"
        prop="remark"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        label="报警通道编码"
        align="center"
        prop="deviceCode"
        show-overflow-tooltip
      /> -->
      <!-- <el-table-column label="报警状态" align="center">
              <span>报警产生</span>
            </el-table-column> -->
      <el-table-column
        label="报警等级"
        align="center"
        prop="eventGrade"
        :formatter.sync="tableLevelFormatter"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="triggerTime"
        show-overflow-tooltip
      />
      <!-- <el-table-column label="报警画面" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-view"
            @click.stop="handleDetail(scope.row)"
            plain
            >查看</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList()"
    />
    <!-- 查看图片 -->
    <video-dialog ref="modelForm"></video-dialog>
  </el-card>
</template>
<script>
// api接口
import { getInvasionRecordList } from "@/api/subsystem/intrusion-alarm";

import VideoDialog from "./VideoDialog.vue";

import printJS from "print-js";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  components: {
    VideoDialog,
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "id",
      // // 查询区域的高度
      // queryElHeight: 0,
      // 区域信息
      regionInfo: {
        // 标题
        title: "全部",
        // 区域id
        regionId: null,
      },
      invasionRecordList: [], //table数据
      queryParams: {
        // 区域id
        regionId: null,
        // 通道名称
        remark: "",
        // 时间
        time: "",
        // 设备编码
        deviceCode: "",
        pageNum: 1,
        pageSize: 10,
      },
      // 检索验证
      queryFormRules: {
        remark: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
        deviceCode: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },

      // 报警等级字典
      alarmLevel: [],
    };
  },
  created() {
    // 获取报警等级字典
    this.getDicts("sys_alarm_level").then((res) => {
      this.alarmLevel = res.data;
    });
  },
  mounted() {
    // 获取树形组件回传的数据、子组件互相传值
    // // 页面一加载就设置高度
    // this.$nextTick(() => {
    //   this.setQueryElHeight();
    // });
    // 监听查询区域的高度
    // window.addEventListener("resize", this.setQueryElHeight);
  },
  beforeDestroy() {
    // 取消监听
    // window.removeEventListener("resize", this.setQueryElHeight);
  },
  methods: {
    // setQueryElHeight() {
    //   this.queryElHeight = this.$refs.queryRef.offsetHeight;
    // },
    //导出
    bindingClick() {
      // if (this.selectedRowKeys.length > 0) {
        this.download(
          "/intrusion/intrusion/export",
          {
            ids: this.selectedRowKeys,
          },
          "入侵报警记录.xlsx"
        );
      // } else {
      //   this.$message({
      //     message: "由于记录数据过大，请选择需要导出的数据",
      //     type: "warning",
      //   });
      // }
    },

    // 打印
    print() {
      printJS({
        printable: this.invasionRecordList,
        properties: [
          { field: "eventName", displayName: "报警类型" },
          { field: "remark", displayName: "报警通道名称" },
          { field: "deviceCode", displayName: "报警通道编码" },
          // { field: "meterPosition", displayName: "报警状态" },
          { field: "statusText", displayName: "报警等级" },
          { field: "triggerTime", displayName: "创建时间" },
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
    // 输入框清空
    handleInputClear(value) {
      // 清空
      this.queryParams[value] = null;
      // 获取数据
      this.handleQuery();
    },
    //table数据请求
    getList() {
      const params = {
        ...this.queryParams,
        startTime: this.queryParams.time ? this.queryParams.time[0] : null,
        endTime: this.queryParams.time ? this.queryParams.time[1] : null,
      };
      this.loading = true;
      getInvasionRecordList(params)
        .then((res) => {
          // 列表数据
          this.invasionRecordList = res.data.records.map((item) => {
            item.statusText = this.tableLevelFormatter(item);
            return item;
          });
          // total
          this.total = res.data.total;
          // 关闭加载
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    // 获取报警等级字典
    tableLevelFormatter(row) {
      let list = this.alarmLevel;
      for (var i = 0; i < list.length; i++) {
        if (row.eventGrade === list[i].dictValue) {
          return list[i].dictLabel;
        }
      }
      return row.eventGrade;
    },
  },
  watch: {
    treeNode: {
      handler(newVal) {
        this.queryParams.regionId = newVal.regionId;
        this.tableTitle = newVal.regionName;
        this.getList();
      },
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
