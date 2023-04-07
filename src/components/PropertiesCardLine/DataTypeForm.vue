<!--
 * @Author: Yelucc
 * @Date: 2021-07-06 15:01:25
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-29 11:37:12
 * @Description: 
-->
<template>
  <div>
    <!-- 数型 -->
    <el-form
      ref="data"
      :model="data"
      label-width="80px"
      v-if="
        data.type.indexOf('int') != -1 ||
        data.type.indexOf('float') != -1 ||
        data.type.indexOf('double') != -1 ||
        data.type.indexOf('long') != -1
      "
    >
      <el-form-item label="最小值">
        <el-input v-model="data.specs.min" disabled></el-input>
      </el-form-item>
      <el-form-item label="最大值">
        <el-input v-model="data.specs.max" disabled></el-input>
      </el-form-item>
      <el-form-item label="单位">
        <el-input v-model="data.specs.unit" disabled></el-input>
      </el-form-item>
    </el-form>

    <!-- 字符串 -->
    <el-form
      ref="data"
      :model="data"
      label-width="80px"
      v-if="data.type.indexOf('string') != -1"
    >
      <el-form-item label="限制长度">
        <el-input v-model="data.specs.length" disabled></el-input>
      </el-form-item>
    </el-form>

    <!-- 时间 -->
    <el-form
      ref="data"
      :model="data"
      label-width="80px"
      v-if="
        data.type.indexOf('date') != -1 ||
        data.type.indexOf('time') != -1 ||
        data.type.indexOf('datetime') != -1
      "
    >
      <el-form-item label="时间格式">
        <el-input v-model="data.specs.format" disabled></el-input>
      </el-form-item>
      <el-form-item label="时区">
        <el-input v-model="data.specs.tz" disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "DataTyptForm",
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          type: "int",
          specs: {
            min: 0,
            max: 60000,
            unit: "T",
          },
        };
      },
    },
  },
};
</script>
<style lang="scss" scoped>
</style>