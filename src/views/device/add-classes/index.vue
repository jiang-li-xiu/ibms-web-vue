<template>
  <div class="card-main-all">
    <el-card>
      <!-- 顶部流程条 -->
      <div slot="header">
        <el-steps :active="active" align-center finish-status="success">
          <el-step
            title="设备类型基础信息"
            description="配置设备类型的基本信息"
          ></el-step>

          <el-step title="属性定义" description="从物模型中选择需要的属性"></el-step>
          <el-step title="事件定义" description="从物模型中选择需要的事件"></el-step>
          <el-step title="功能定义" description="从物模型中选择需要的设备功能"></el-step>
          <el-step title="完成配置" description="最后设备类的相关状态"></el-step>
        </el-steps>
      </div>

      <!-- step内容切换 -->
      <div>
        <!-- STEP1 -->
        <div class="step" v-show="active == 0">
          <basic-information @nextStep="finishFirstStep"></basic-information>
        </div>

        <!-- STEP2 -->
        <div class="step" v-show="active == 1">
          <model-properties
            :properties="thingModelObject.properties"
            @backStep="backStep"
            @nextStep="finishSecondStep"
          ></model-properties>
        </div>

        <!-- STEP3 -->
        <div class="step" v-show="active == 2">
          <model-events
            :events="thingModelObject.events"
            @backStep="backStep"
            @nextStep="finishThirdStep"
          ></model-events>
        </div>

        <!-- STEP4 -->
        <div class="step" v-show="active == 3">
          <model-functions
            :functionsData="thingModelObject.functions"
            @backStep="backStep"
            @nextStep="finishFourthStep"
          ></model-functions>
        </div>

        <!-- STEP5 -->
        <div class="step" v-show="active == 4">
          <all-information
            :selectedData="formData"
            :thingModelObject="thingModelSelectedObject"
            @backStep="backStep"
            @finish="finishAll"
          ></all-information>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getThingModelByTid, addDeviceType } from "@/api/subsystem/system";
// 局部组件
import BasicInformation from "./BasicInformation"; //新
import ModelProperties from "./ModelProperties";
import ModelEvents from "./ModelEvents";
import ModelFunctions from "./ModelFunctions";
import AllInformation from "./AllInformation";
export default {
  name: "AddClasses",
  components: {
    BasicInformation,
    ModelProperties,
    ModelEvents,
    ModelFunctions,
    AllInformation,
  },
  data() {
    return {
      // 保存第一步的物模型id
      stepOneModelId: "",
      // 步骤条的进度控制
      active: 0,
      // 提交的设备类的基本信息Form
      formData: {},
      // 请求到的物模型详细类
      thingModelObject: {
        properties: [],
        functions: [],
        events: [],
      },
      // 已选择的物模型属性、事件、功能数据
      thingModelSelectedObject: {
        properties: [],
        functions: [],
        events: [],
      },
    };
  },
  methods: {
    // 完成第一步
    //子组件方法传值：获取第一步form表单数据
    finishFirstStep(data) {
      console.log("完成第一步:", data);
      // 判断是否重新选择物模型，未重新选择，不再进行物模型属性、事件、功能数据请求
      if (this.stepOneModelId == data.id) {
        this.active = 1;
      }
      // 如果重新选择，重新获取对应的物模型属性、事件、功能
      else {
        this.stepOneModelId = data.id;
        this.formData = data;
        getThingModelByTid(data.id).then((res) => {
          console.log("获取数据:", res.data);
          this.thingModelObject = res.data;
          this.active = 1;
        });
      }
    },

    // 第二步去到第三步
    finishSecondStep(data) {
      this.thingModelSelectedObject.properties = data;
      this.active = 2;
    },

    // 第三步到第四步
    finishThirdStep(data) {
      this.thingModelSelectedObject.events = data;
      this.active = 3;
    },

    // 第四步到第五步
    finishFourthStep(data) {
      this.thingModelSelectedObject.functions = data;
      this.active = 4;
      this.formData.thingModelDto = this.thingModelSelectedObject;
    },

    // 第五步完成
    finishAll() {
      addDeviceType(this.formData).then((res) => {
        console.log(res);
        this.$message({
          message: "提交成功",
          type: "success",
        });
        // 返回至第一步
        this.active = 0;
        // 清空第一步选中的数据

        let visitedViews = this.$store.state.tagsView.visitedViews,
          index = visitedViews.findIndex(
            (item) => item.fullPath == "/device/device-classes/add/device-type"
          );
        this.$store.state.tagsView.visitedViews.splice(index, 1);

        // 路由跳转
        this.$router.push({
          name: "DeviceClasses",
          params: { type: "DeviceClasses" },
        });
      });
    },

    // 返回上一步
    backStep() {
      this.active--;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-main-all {
  min-height: calc(100vh - 84px);
}
.step {
  position: relative;
}

$c1: #40a0ff77;
$c2: #67c23a9f;
$c3: #3ce6bcbb;
$c4: #d44926a1;
$c5: #a341d1a9;
$c6: #e6a23c94;

$list: $c1, $c2, $c3, $c4, $c5, $c6;

@mixin rcolor() {
  $random-color: random(length($list));
  background: nth($list, $random-color);
}
</style>
