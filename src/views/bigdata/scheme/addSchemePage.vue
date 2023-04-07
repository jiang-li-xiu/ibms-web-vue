<!--
 * @Author: Yelucc
 * @Date: 2021-07-23 09:37:46
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-08-04 15:41:37
 * @Description: 新增方案页（跳转）要写 按流程上中下结构
-->

<template>
  <div>
    <!-- 主体卡片 -->
    <el-card>
      <div slot="header">
        <el-steps :active="step" finish-status="success" align-center>
          <el-step title="基本配置"></el-step>
          <el-step title="代码和变量"></el-step>
          <el-step title="完成配置"></el-step>
        </el-steps>
      </div>
      <div>
        <!-- 主面板 -->
        <el-row :gutter="10" style="height:80vh">
          <el-col :span="24">
            <scheme-base-info :result.sync="baseInfo" v-if="step == 0"/>
            <scheme-variable-page :scriptId="baseInfo.scriptId" :scriptData.sync="scriptdata" v-if="step == 1"/>
            <div v-if="step == 2">
              <el-row :gutter="10" type="flex" justify="center">
                <el-col :span="6">
                  <div>
                    配置完成
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 下一步 -->
        <el-row :gutter="10" justify="end" type="flex" style="padding-top:20px">
          <el-col :span="2">
            <el-button @click="onBack" v-if="step != 0">上一步</el-button>
            <el-button type="primary" @click="onNext">下一步</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import schemeBaseInfo from "@/views/bigdata/scheme/schemeBaseInfo";
import schemeVariablePage from '@/views/bigdata/scheme/schemeVariablePage'
import { selectDbTableList, columnList,addScheme } from "@/api/bigdata/scheme";
import {addScriptManager} from '@/api/bigdata/scriptManager'

export default {
  name: "AddSchemePage",
  props: {},
  components: { schemeBaseInfo,schemeVariablePage },
  data() {
    return {
        step:0,
        baseInfo:null,
        scriptdata:null,
    };
  },
  // created() {},
  methods: {

  
      onNext(){
        if(this.step == 1){
          this.scriptdata.scriptId = this.baseInfo.scriptId;
        }
        if(this.step == 2){
          addScriptManager(this.scriptdata).then(res=>{
            addScheme(this.baseInfo).then(res=>{
              this.msgSuccess("添加成功");
              this.step = 0
              this.$router.push({name:'Scheme'})
            })
          })
          
        }

          if(this.step <5) this.step++; 
      },
        onBack(){
            if(this.step >0) this.step--; 
        }
  },
  computed: {},
  // mounted: {},
  watch: {},
};
</script>
<style lang='scss' scoped>
</style>
