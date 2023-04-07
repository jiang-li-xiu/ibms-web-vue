<!--
 * @Author: Yelucc
 * @Date: 2021-07-26 08:42:20
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-07-29 17:40:39
 * @Description: 
-->

<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="联动标题" prop="linkName">
            <el-input v-model="ruleForm.linkName"></el-input>
          </el-form-item>

          <el-form-item label="触发器" prop="linkTrigger">
            <el-button type="primary" plain @click="addTriggerBtn"
              >新增触发器</el-button
            >
            <trigger
              :triggerConfig.sync="ruleForm.linkTrigger[index]"
              v-for="(item, index) in ruleForm.linkTrigger"
              :key="index"
            ></trigger>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import trigger from "@/views/subsystem/components/LinkageAddPanel/trigger";
export default {
  props: {},
  components: { trigger },
  data() {
    return {
      ruleForm: {
        linkName: "",
        linkTrigger: [],
      },
      rules: {},
    };
  },
  methods: {
    addTriggerBtn() {
      this.ruleForm.linkTrigger.push({});
    },
  },
  computed: {},
  watch: {
      ruleForm:{
          handler(n){
              console.log(n);
          },
          deep:true
      }
  },
};
</script>
<style lang='scss' scoped>
</style>