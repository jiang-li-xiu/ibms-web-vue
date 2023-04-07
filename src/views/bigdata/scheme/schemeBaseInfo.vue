<!--
 * @Author: Yelucc
 * @Date: 2021-07-23 15:46:32
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-07-28 14:40:15
 * @Description: 
-->

<template>
  <div class="main">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="方案名称">
            <el-input v-model="form.schemeName"></el-input>
          </el-form-item>
          <el-form-item label="脚本标识">
            <el-input v-model="form.scriptId"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="18">
          <mavonEditor v-model="form.schemeDescription" style="min-height: 80vh"/>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  props: {},
  components: {mavonEditor},
  data() {
    return {
        form:{
          schemeName: null,
          scriptId: null,
          schemeDescription: '# 请在此处描述分析方案',
        },
    };
  },
  created() {
    this.$emit('update:result',this.form)
  },

};
</script>
<style lang='scss' scoped>

</style>