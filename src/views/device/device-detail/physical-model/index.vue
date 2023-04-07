<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-27 17:08:05
 * @LastEditors: MJ
 * @LastEditTime: 2021-08-23 15:25:41
-->
<template>
  <div class="physical-model">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="属性定义" name="first">
        <attribute-definition
          :attributeDate="attributeDate"
        ></attribute-definition>
      </el-tab-pane>
      <el-tab-pane label="功能定义" name="second">
        <function-definition :functionData="functionData"></function-definition>
      </el-tab-pane>
      <el-tab-pane label="事件定义" name="third">
        <event-definition :eventData="eventData"></event-definition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AttributeDefinition from "./AttributeDefinition.vue";
import EventDefinition from "./EventDefinition.vue";
import FunctionDefinition from "./FunctionDefinition.vue";

export default {
  name: "PhysicalModel",
  props: {
    modelData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    AttributeDefinition,
    EventDefinition,
    FunctionDefinition,
  },
  data() {
    return {
      //默认选中属性定义
      activeName: "first",
      // 属性定义-数据
      attributeDate: [],
      // 功能定义-数据
      eventData: [],
      // 事件定义-数据
      functionData: [],
    };
  },

  methods: {
    getData(data) {
      if (data) {
        this.attributeDate = data.properties;
        this.eventData = data.events;
        this.functionData = data.functions;
      }
    },
    
    handleClick(tab, event) {
      // console.log(tab, event);
    },
  },

  watch: {
    modelData: {
      handler(newVal) {
        this.getData(newVal);
      },
    },
  },
};
</script>
<style scoped lang='scss' >
</style>