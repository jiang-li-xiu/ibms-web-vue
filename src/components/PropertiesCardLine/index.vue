<!--
 * @Author: Yelucc
 * @Date: 2021-07-05 14:10:36
 * @LastEditors: MJ
 * @LastEditTime: 2021-08-11 14:11:57
 * @Description: 
-->
<template>
  <div>
    <el-form ref="data" :model="data" label-width="80px">
      <el-form-item label="属性标识">
        <el-input v-model="data.field" :disabled="!edit"></el-input>
      </el-form-item>

      <el-form-item label="属性名称">
        <el-input v-model="data.name" :disabled="!edit"></el-input>
      </el-form-item>

      <el-form-item label="读写状态">
        <el-select
          v-model="data.accessMode"
          placeholder="读写状态"
          :disabled="!edit"
        >
          <el-option
            v-for="(item, k) in rwStatus"
            :key="k"
            :value="item.value"
            :label="item.label"
          >
            <!-- <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.value
            }}</span> -->
          </el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="必填">
        <el-input v-model="data.required" :disabled='!edit'></el-input>
      </el-form-item> -->

      <el-form-item label="数据类型">
        <el-select
          v-model="data.dataType.type"
          placeholder="请选择数据类型"
          :disabled="!edit"
        >
          <el-option
            v-for="(item, k) in dataTypes"
            :key="k"
            v-model="item.value"
            :label="item.label"
          >
            <!-- <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ 
              item.value
            }}</span> -->
          </el-option>
        </el-select>
      </el-form-item>

      <!-- <data-type-form :data="data.dataType"></data-type-form> -->

      <el-form-item v-if="edit">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import DataTypeForm from "@/components/PropertiesCardLine/DataTypeForm";

export default {
  name: "PropertiesCardLine",
  // components: { DataTypeForm },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          field: "k3214dsafd324",
          name: "端口",
          accessMode: "rw",
          required: true,
          dataType: {
            type: "int",
            specs: {
              min: 0,
              max: 60000,
              step: 1,
            },
          },
        };
      },
    },
    edit: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      from: null,
      dataTypes: [
        {
          label: "整型",
          value: "int",
        },
        {
          label: "单精度浮点型",
          value: "float",
        },
        {
          label: "双精度浮点型",
          value: "double",
        },
        {
          label: "长整型",
          value: "long",
        },
        {
          label: "字符串",
          value: "string",
        },
        {
          label: "布尔",
          value: "bool",
        },
        {
          label: "日期",
          value: "date",
        },
        {
          label: "时间",
          value: "time",
        },
        {
          label: "日期时间",
          value: "datetime",
        },
        {
          label: "Json",
          value: "json",
        },
      ],
      rwStatus: [
        {
          label: "只读",
          value: "r",
        },
        {
          label: "只写",
          value: "w",
        },
        {
          label: "读写",
          value: "rw",
        },
      ],
    };
  },

  methods: {
    onSubmit() {},
  },
};
</script>

<style lang="scss" scoped>
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

.bg-color {
  @include rcolor;
  //   padding: 0;
  font-weight: 600;
  color: oldlace;
}

.main {
  width: 85vw;
}
</style>