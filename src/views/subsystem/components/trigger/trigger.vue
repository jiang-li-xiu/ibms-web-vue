<!--
 * @Author: MJ
 * @Date: 2021-07-26 11:07:19
 * @LastEditors: MJ
 * @LastEditTime: 2021-07-27 11:10:31
 * @Description: 
-->
<template>
  <div class="">
    <el-row class="padding_left_3">
      <el-col :span="10">
        <el-select v-model="triggerCondition.model" placeholder="请选择触发器">
          <el-option
            v-for="item in linkTriggerCondition"
            :key="item.dictValue"
            :label="item.dictLabel"
            v-model="item.dictValue"
          />
        </el-select>
      </el-col>
    </el-row>

    <el-row class="padding_left_3 margin_top_1">
      <!-- 定时触发 -->
      <el-col style="width: 13.8rem" v-if="triggerCondition.model == 2">
        <el-input
          v-model="triggerCondition.corn"
          placeholder="请输入corn表达式"
          clearable
          size="small"
        />
      </el-col>

      <!-- 设备触发1 -->
      <el-col v-if="triggerCondition.model == 3" style="width: 13.8rem">
        <el-button style="width: 13.8rem; text-align: left; padding-left: 1rem"
          >请选择设备</el-button
        >
      </el-col>

      <!-- 场景触发 -->
      <el-col v-if="triggerCondition.model == 4" style="width: 13.8rem">
        <el-button style="width: 13.8rem; text-align: left">暂未开发</el-button>
      </el-col>
    </el-row>

    <!-- 设备触发2 -->
    <el-row
      class="padding_left_3 margin_top_1"
      v-if="triggerCondition.model == 3"
    >
      <el-col>
        <el-select
          v-model="triggerCondition.attributeEventFunction"
          placeholder="请选择类型"
        >
          <el-option
            v-for="item in linkageTriggerType"
            :key="item.dictValue"
            :label="item.dictLabel"
            v-model="item.dictValue"
          />
        </el-select>

        <el-select
          class="margin_left_1"
          v-model="triggerCondition.attributeEventFunctionVal"
          placeholder=""
        >
          <el-option
            v-for="item in linkageTriggerType"
            :key="item.dictValue"
            :label="item.dictLabel"
            v-model="item.dictValue"
          />
        </el-select>
      </el-col>
    </el-row>

    <!-- 设备触发3 -->
    <el-row
      class="padding_left_3 margin_top_1"
      v-if="
        triggerCondition.model == 3 &&
        triggerCondition.attributeEventFunction != ''
      "
    >
      <el-input
        style="width: 13.8rem"
        v-model="triggerCondition.corn"
        placeholder="请输入过滤条件"
        clearable
        size="small"
      />

      <el-select
        class="margin_left_1"
        style="width: 13.8rem"
        v-model="triggerCondition.operator"
        placeholder="请选择操作符"
      >
        <el-option
          v-for="item in linkTriggerOperator"
          :key="item.dictValue"
          :label="item.dictLabel"
          v-model="item.dictValue"
        />
      </el-select>

      <el-input
        class="margin_left_1"
        style="width: 13.8rem"
        v-model="triggerCondition.corn"
        placeholder="请输入过滤值"
        clearable
        size="small"
      />
    </el-row>
  </div>
</template>
<script>
export default {
  name: "Trigger",
  props: {
    triggerCondition: {
      type: Object,
      default() {
        return {};
      },
    },
    // ids: {
    //   type: Number,
    //   default() {
    //     return 1;
    //   },
    // },
  },
  components: {},
  data() {
    return {
      // triggerCondition: {
      //   // 触发器
      //   model: "",
      //   // 定时器表达式
      //   corn: "",
      //   // 属性事件功能
      //   attributeEventFunction: "",
      //   // 属性事件功能后面的框
      //   attributeEventFunctionVal: "",
      //   // 操作符
      //   operator: "",
      // },

      linkTriggerCondition: [],
      linkageTriggerType: [],
      linkTriggerOperator: [],
      linkageExecutionMode: [],
      linkageNotifyType: [],
    };
  },

  watch: {
    triggerCondition: {
      handler() {
        this.asyncs();
      },
    },
  },

  created() {
    console.log(this.ids);
    this.getDictionaries("linkTriggerCondition", "link_trigger_condition");
    this.getDictionaries("linkageTriggerType", "linkage_trigger_type");
    this.getDictionaries("linkTriggerOperator", "link_trigger_operator");
    // this.getDictionaries("linkageExecutionMode", "linkage_execution_mode");
    // this.getDictionaries("linkageNotifyType", "linkage_notify_type");
    // this.$emit("update:triggerConfig", this.triggerCondition);
  },

  methods: {
    //
    asyncs() {
      let data = this.triggerCondition;
      // data.id = this.ids;
      this.$emit("update:triggerConfig", data);
    },

    // 获取字典数据
    getDictionaries(key, value) {
      this.getDicts(value).then((response) => {
        let { code, data } = response;
        if (code == 200) {
          this[key] = data;
          //   console.log("字典：", data);
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.margin_top_1 {
  margin-top: 1vh;
}

.margin_left_1 {
  margin-left: 1vw;
}

.margin_left_2 {
  margin-left: 2vw;
}

.padding_left_3 {
  padding-left: 3vw;
}

::v-deep .el-input__inner {
  height: 37px !important;
  line-height: 37px !important;
}
</style>
