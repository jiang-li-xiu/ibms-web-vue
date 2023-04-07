<!--
 * @Descripttion:
 * @Author: ZhouFanSong
 * @Date: 2021-09-10 10:13:03
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-06-02 17:04:14
-->
<template>
  <div class="assembly-container">
    <div class="assembly-table-main assembly-container-col">
      <!-- 头部选项 -->
      <div class="assembly-header" v-show="showSearch">
        <el-radio-group
          class="assembly-header-time"
          v-model="queryParams.queryMode"
          @change="dateChange"
        >
          <el-radio-button label="Month">月</el-radio-button>
          <el-radio-button label="Quarter">季</el-radio-button>
          <el-radio-button label="Year">年</el-radio-button>
        </el-radio-group>
        <!-- <el-date-picker
          v-model="date"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          @change="selectDateChange"
        >
        </el-date-picker> -->
      </div>
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
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <!-- table表格 -->
      <el-table
        :height="tableHeight"
        v-loading="loading"
        :data="regioninfoList"
      >
        <el-table-column
          label="日期"
          align="center"
          width="200"
          style="background: #ffffff !important"
        >
          <el-table-column
            label="计量项目"
            align="center"
            width="200"
            style="background: #ffffff"
          >
            <template slot-scope="scope"> {{ scope.row.meterName }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in labelList"
          :key="index"
          :label="item.time"
          align="center"
          :prop="item.time"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[item.time] || 0 }} KWh</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getEnergyConsumptionList } from "@/api/subsystem/meter-reading/pricing-management.js";
import moment from "moment";
export default {
  data() {
    return {
      showSearch: true, // 显示搜索条件
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      tableHeight: 0, //表格高度
      loading: "", //加载
      labelList: [], //多选后获取到的id
      dialogVisible: false, //弹框显示
      regioninfoList: [], //table数据
      date: [], //时间数组
      queryParams: {
        beginTime: "", //开始时间
        endTime: "", //结束时间
        meterType: "远程抄表系统-电表", //仪表类型
        queryMode: "Month", //查询方式 (周=Week、月份=Month、季度=Quarter、年=Year)
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
    this.getList();
  },
  methods: {
    //获取选择时间
    // selectDateChange(e) {
    //   this.queryParams.queryMode = "";
    //   this.queryParams.beginTime = e[0];
    //   this.queryParams.endTime = e[1];
    //   this.getList();
    // },
    //获取选项点击
    dateChange(e) {
      this.date = "";
      this.queryParams.beginTime = "";
      this.queryParams.endTime = "";
      this.getList();
    },
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 320;
    },
    //导出
    bindingClick() {
      const _this = this;
      this.$confirm("是否确认导出全部数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _this.download(
            "/meterread/report/exportEnergyConsumption",
            _this.queryParams,
            `能耗报表数据-${this.queryParams.meterType}.xlsx`
          );
        })
        .catch(() => {});
    },
    //table数据请求
    getList() {
      this.loading = true;
      getEnergyConsumptionList(this.queryParams).then((response) => {
        let obj = {};
        //去重
        let peon = response.data.title.reduce((cur, next) => {
          obj[next.time] ? "" : (obj[next.time] = true && cur.push(next));
          return cur;
        }, []);
        this.regioninfoList = response.data.value;
        this.labelList = peon.sort((t1, t2) => {
          return (
            moment(t2.time, "YYYY/MM").format("x") -
            moment(t1.time, "YYYY/MM").format("x")
          );
        });
        this.loading = false;
      });
    },
  },
};
</script>
<style lang="scss">
.assembly-container {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  padding: 20px;
}
.assembly-container-col {
  min-height: calc(100vh - 124px);
  background-color: #fff;
}
//头部
.assembly-header {
  padding: 10px 0;
  margin-bottom: 10px;
  .assembly-header-time {
    margin-right: 40px;
  }
}
// 内容
.assembly-table-main {
  padding: 10px;
}
.onstate {
  color: #95f204;
}
.unstate {
  color: #d9001b;
}
.el-table thead.is-group th {
  background: none;
  padding: 0px;
}
.el-table thead.is-group tr:first-of-type th:first-of-type,
.el-table thead.is-group tr:last-of-type th:first-of-type {
  background: #ffffff !important;
}
.el-table thead.is-group tr:first-of-type th:first-of-type {
  border-bottom: none;
}
.el-table thead.is-group tr:first-of-type th:first-of-type div.cell {
  text-align: right;
}
.el-table thead.is-group tr:last-of-type th:first-of-type div.cell {
  text-align: left;
}
.el-table thead.is-group tr:first-of-type th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  // height: 55px;
  height: 145px; //自行调整
  top: 0;
  left: 0;
  background-color: grey;
  opacity: 0.2;
  display: block;
  // transform: rotate(-43deg);
  transform: rotate(-68.5deg); //自行调整
  -webkit-transform-origin: top;
  transform-origin: top;
}
.el-table thead.is-group tr:last-of-type th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  // height: 60px;
  height: 145px; //自行调整
  bottom: 0;
  right: 0;
  background-color: grey;
  opacity: 0.2;
  display: block;
  // transform: rotate(-45deg);  //自行调整
  transform: rotate(-68.5deg);
  -webkit-transform-origin: bottom;
  transform-origin: bottom;
}
</style>
