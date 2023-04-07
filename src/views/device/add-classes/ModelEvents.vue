<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-09-16 17:09:20
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-23 15:12:25
-->
<template>
  <div>
    <div class="step-title">事件定义</div>
    <el-table
      :height="tableHeight"
      :data="events"
      style="width: 100%"
      @selection-change="selectEventHandler"
      row-class-name="bg-color"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="eventName" label="事件名"></el-table-column>

      <el-table-column prop="identifier" label="事件标识"></el-table-column>

      <!-- <el-table-column prop="desc" label="描述"></el-table-column> -->

      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            class="bg-color"
            size="small"
            @click="openEventDrawer(scope.row)"
          >
            详情
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 事件详情抽屉 -->
    <!-- <el-drawer title="事件详情" :visible.sync="e_drawer" size="25%">
      <events-card-line :data="event"></events-card-line>
    </el-drawer> -->
    <!-- 底部按钮 -->
    <div class="step-button">
      <el-button @click="backStep">上一步</el-button
      ><el-button type="primary" @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModelEvents",
  props: {
    events: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      // 保存选择的数据
      selectedData: [],
      // 表格自适应高度
      tableHeight: 0,
      // 控制抽屉
      e_drawer: false,
      // 事件抽屉的内容
      event: {},
    };
  },
  created() {
    this.getHeight();
    window.addEventListener("resize", this.getHeight);
  },
  methods: {
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 346;
    },
    // 开事件抽屉
    openEventDrawer(obj) {
      this.e_drawer = true;
      this.event = obj;
    },
    // STEP2 属性选择回调钩子
    selectEventHandler(s) {
      console.log(s);
      this.selectedData = s;
    },
    // 上一步
    backStep() {
      this.$emit("backStep");
    },
    // 下一步
    nextStep() {
      this.$emit("nextStep", this.selectedData);
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
};
</script>
<style scoped lang='scss' >
.step-title {
  font-size: 24px;
  font-weight: 600;
  padding-left: 20px;
  margin-bottom: 20px;
}
.step-button {
  width: 100%;
  padding: 20px 50px 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>