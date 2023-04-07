<!--
 * @Author: Yelucc
 * @Date: 2021-07-26 08:55:09
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-07-26 11:43:59
 * @Description: 
-->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-select
          v-model="triggerCondition.model"
          placeholder="请选择联动触发方式"
        >
          <el-option
            v-for="dict in triggerConditionOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-col>
      <el-col :span="18">
        <!-- 手动触发 -->
        <div v-if="triggerCondition.model == 1">
          <span>将在触摸面板添加手动执行按钮</span>
        </div>
        <!-- 定时触发 -->
        <div v-if="triggerCondition.model == 2">
          <el-input
            v-model="triggerCondition.option.corn"
            placeholder="请输入Corn表达式"
            clearable
            size="small"
          />
        </div>
        <!-- 设备触发 -->
        <div v-if="triggerCondition.model == 3">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-button type="primary" icon="el-icon-search">
                请选择设备
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-select
                v-model="triggerCondition.option.deviceTriggerModel"
                placeholder="请选择设备触发方式"
              >
                <el-option
                  v-for="dict in linkactionDeviceOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-col>
          </el-row>
          <!-- 属性的变动 -->
          <el-row :gutter="10" v-if="deviceTriggerModel == 0">
            <el-col :span="8">
              <!-- TODO 换带搜索建议的输入框 -->
              <el-input
                v-model="triggerCondition.option.paramKey"
                placeholder="请输入监听属性"
                clearable
                size="small"
              />
            </el-col>
            <el-col :span="8">
              <el-select
                v-model="triggerCondition.option.paramCond"
                placeholder="请选择属性变动条件"
              >
                <el-option
                  v-for="dict in deviceParamOperatorOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="triggerCondition.option.paramValue"
                placeholder="请输入属性变动阈值"
                clearable
                size="small"
              />
            </el-col>
          </el-row>
          <!-- 事件的触发 -->
          <el-row :gutter="10" v-if="deviceTriggerModel == 1">
            <el-col :span="8">
              <!-- TODO 换带搜索建议的输入框 -->
              <el-input
                v-model="triggerCondition.option.eventKey"
                placeholder="请输入监听事件（事件触发的返回结果为）"
                clearable
                size="small"
              />
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="triggerCondition.option.eventValue"
                placeholder="请输入事件触发的返回结果"
                clearable
                size="small"
              />
            </el-col>
          </el-row>
        </div>
        <!-- 场景触发 -->
        <div v-if="triggerCondition.model == 4">
          <span>待完成</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
    name:"Trigger",
  props: {
      
  },
  components: {},
  data() {
    return {
      triggerCondition: {
        model: 0,
        option: {
          // 定时器 1
          corn: "",
          // 设备触发
          deviceTriggerModel: 0,
          // 设备属性变动
          paramKey: "",
          paramCond: "",
          paramValue: "",
          // 事件的触发
          eventKey: "",
          eventValue: "",
        },
      },
      deviceParamOperatorOptions: [],
      linkactionDeviceOptions: [],
      triggerConditionOptions: [],
    };
  },
  created() {
    this.getDicts("link_trigger_condition").then((response) => {
      this.triggerConditionOptions = response.data;
    });
    this.getDicts("linkaction_device_cond").then((response) => {
      this.linkactionDeviceOptions = response.data;
    });
    this.getDicts("link_trigger_operator").then((response) => {
      this.deviceParamOperatorOptions = response.data;
    });
   this.$emit('update:triggerConfig',this.triggerCondition)
  },
  methods: {},
  computed: {},
  watch: {
  },
};
</script>
<style lang='scss' scoped>
</style>