<!--
 * @Author: MJ
 * @Date: 2021-08-13 15:53:54
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-02 14:25:48
 * @Description:
-->
<template>
  <div>
    <el-form :inline="true" :model="query">
      <el-form-item label="告警名称：">
        <el-input v-model="query.alarmName" placeholder="请输入告警名称"></el-input>
      </el-form-item>

      <el-form-item label-width="130px" label="告警时间">
        <el-date-picker
          v-model="query.searchTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label-width="130px" label="告警等级">
        <el-select v-model="query.level" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label-width="130px" label=" ">
        <el-button type="primary" @click="onSubmits">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="deviceAlarmListAlarmHistory"
      stripe
      style="width: 100%"
      border
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column prop="deviceId" label="设备ID"></el-table-column>
      <el-table-column prop="deviceName" label="设备名称"></el-table-column>
      <el-table-column prop="alarmName" label="告警名称"></el-table-column>
      <el-table-column prop="alarmTime" label="告警时间"></el-table-column>
      <el-table-column prop="level" label="告警等级"></el-table-column>
      <el-table-column label="处理状态">
        <template slot-scope="scope">
          <span
            style="padding: 3vh 1vw; color: #fff; border-radius: 36px"
            :style="{
              backgroundColor: scope.row.arrangeStatus == 0 ? '#ff0000' : '#00ff00',
            }"
            >{{ scope.row.statusTitle }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span style="color: #0000ff; cursor: pointer" @click="details(scope.row)">
            详情
          </span>
          <!-- <span
            style="color: #0000ff; cursor: pointer; margin-left: 0.5vw"
            @click="handle(scope.row)"
            v-show="scope.row.arrangeStatus == 0"
          >
            处理
          </span> -->
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: right; margin-top: 1vh">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNum"
        :page-sizes="[10, 15, 20, 30, 40, 50, 100, 200, 300]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 详情弹窗 -->
    <div>
      <el-dialog title="告警记录详情" :visible.sync="isDialogDetail" width="20%">
        <div class="detail_box">
          <div class="detail_item" v-for="item in detailsData" :key="item.id">
            <span>{{ item.title }}</span>
            <span v-text="item.value"></span>
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- 处理弹窗 -->
    <div>
      <el-dialog title="处理" :visible.sync="isHandle" width="20%" @close="closes">
        <el-form :model="formHandle" ref="refForm" :rules="rules">
          <el-form-item label="处理" label-width="60px" prop="remarks">
            <el-input v-model="formHandle.remarks" placeholder="请输入" />
          </el-form-item>

          <el-form-item style="text-align: right">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getDeviceAlarmListAlarmHistory,
  putDeviceAlarmHistoryUpdate,
} from "@/api/device/deviceClasses";

export default {
  props: {
    detailsId: {
      type: Number,
      default() {
        return 999888777;
      },
    },
  },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        alarmName: "", // 告警名称
        searchTime: "", // 时间范围
        level: "", // 告警等级
        deviceTypeId: this.detailsId, // 设备ID
      },
      options: [],
      deviceAlarmListAlarmHistory: [],
      total: 0,
      isDialogDetail: false,
      detailsData: [],
      isHandle: false,
      formHandle: {
        alarmHistoryId: "",
        remarks: "",
      },
      rules: {
        remarks: [
          { required: true, message: "请输入", trigger: "blur" },
          //
        ],
      },
    };
  },

  mounted() {
    this.deviceAlarmListAlarmHistorys();
    this.getDicts("manager_level").then((response) => {
      this.options = response.data;
    });
  },

  methods: {
    // 获取详情记录
    deviceAlarmListAlarmHistorys() {
      let {
          pageNum,
          pageSize,
          alarmName, // 告警名称
          searchTime, // 时间范围
          level, // 告警等级
          deviceTypeId, // 设备ID
        } = this.query,
        obj = {
          pageNum,
          pageSize,
          alarmName, // 告警名称
          searchTime: searchTime
            ? `${this.parseTime(
                searchTime[0],
                "{y}-{m}-{d} {h}:{i}:{s}"
              )}~${this.parseTime(searchTime[1], "{y}-{m}-{d} {h}:{i}:{s}")}`
            : "", // 时间范围
          alarmLevel: level, // 告警等级
          deviceTypeId, // 设备ID
        };
      getDeviceAlarmListAlarmHistory(obj).then((response) => {
        let { rows, total } = response;
        this.deviceAlarmListAlarmHistory = rows.map((item) => {
          item.level =
            item.alarmLevel == 1 ? "严重" : item.alarmLevel == 2 ? "告警" : "提醒";
          item.statusTitle = item.arrangeStatus == 0 ? "未处理" : "已处理";
          return item;
        });
        this.total = total;
      });
    },

    // 查询
    onSubmits() {
      console.log(this.query);
      // plugId
      this.deviceAlarmListAlarmHistorys();
    },

    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.deviceAlarmListAlarmHistorys();
    },

    handleSizeChange(val) {
      this.query.pageSize = val;
      this.deviceAlarmListAlarmHistorys();
    },

    // 关闭处理弹窗
    closes() {
      this.formHandle = {
        alarmHistoryId: "",
        remarks: "",
      };
    },

    // 处理弹出取消按钮
    cancel() {
      this.isHandle = !this.isHandle;
    },

    // 处理弹窗提交按钮
    onSubmit() {
      this.$refs["refForm"].validate((valid) => {
        if (valid) {
          putDeviceAlarmHistoryUpdate(this.formHandle).then((response) => {
            this.deviceAlarmListAlarmHistorys();
            this.isHandle = false;
          });
        } else {
          return false;
        }
      });
    },

    // 打开处理面板
    handle(row) {
      this.formHandle.alarmHistoryId = row.alarmHistoryId;
      this.isHandle = !this.isHandle;
    },

    // 跳转详情页
    details(row) {
      let templateD = {
          deviceId: "设备ID",
          deviceName: "设备名称",
          deviceTypeName: "设备类型",
          alarmId: "告警ID",
          alarmName: "告警名称",
          regionName: "告警区域",
          alarmTime: "告警时间",
          statusTitle: "告警状态",
          level: "告警等级",
        },
        newData = [],
        i = 1;
      for (const key in templateD) {
        if (Object.hasOwnProperty.call(templateD, key)) {
          newData.push({
            id: (i += 1),
            title: templateD[key],
            value: row[key],
          });
        }
      }
      this.detailsData = newData;
      this.isDialogDetail = !this.isDialogDetail;
    },
  },
};
</script>

<style lang="scss" scoped>
.detail_box {
  border: 1px solid #999;
}

.detail_item {
  border-bottom: 1px solid #999;
}

.detail_item:last-child {
  border-bottom: 0;
}

.detail_item > span {
  display: inline-block;
  width: 50%;
  padding: 1.5vh 0;
  text-align: center;
}

.detail_item > span:first-child {
  background-color: #ddd;
  border-right: 1px solid #999;
}
</style>
