<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-09-16 18:11:18
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-29 11:00:08
-->
<template>
  <div>
    <div class="step-title">属性定义</div>
    <el-table
      ref="propertiesTable"
      :height="tableHeight"
      :data="properties"
      style="width: 100%"
      @selection-change="selectPropertiesHandler"
    >
      <el-table-column type="selection"></el-table-column>

      <el-table-column prop="name" label="属性名"></el-table-column>

      <el-table-column prop="field" label="属性标识"></el-table-column>

      <el-table-column prop="dataType.type" label="属性类型">
        <template slot-scope="scope">
          <span>{{ scope.row.dataType.type }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="accessMode" label="读写模式">
        <template slot-scope="scope">
          <span>{{
            (scope.row.accessMode.indexOf("r") != -1 ? "读" : "") +
            (scope.row.accessMode.indexOf("w") != -1 ? "写" : "")
          }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="required" label="必填项">
        <template slot-scope="scope">
          <span>{{ scope.row.required ? "必填" : "可选" }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            class="bg-color"
            @click="openPropDrawer(scope.row)"
            size="small"
          >
            详情
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 属性详情抽屉 -->
    <!-- <el-drawer title="属性详情" :visible.sync="p_drawer" size="25%">
      <properties-card-line :data="property"></properties-card-line>
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
  name: "ModelProperties",
  props: {
    properties: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      // 表格自适应高度
      tableHeight: 0,
      // 保存选择的数据
      selectedData: [],
      // 控制抽屉
      p_drawer: false,
      // 属性抽屉的内容
      property: {},
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
    // 开属性抽屉
    openPropDrawer(obj) {
      this.p_drawer = true;
      this.property = obj;
    },
    // STEP2 属性选择回调钩子
    selectPropertiesHandler(s) {
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
  // watch: {
  // properties: {
  //   handler(newVal) {
  //     this.$refs.propertiesTable.clearSelection();
  //   },
  // },
  // },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
};
</script>
<style scoped lang="scss">
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
