<!--
 * @Author: Yelucc
 * @Date: 2021-06-25 11:22:54
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-06-25 14:10:13
 * @Description: 
-->

<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="属性定义" name="first">
        <el-table :data="tProperties">
          <el-table-column prop="id" label="标识" />
          <el-table-column prop="name" label="属性名称" />
          <el-table-column prop="valueType.type" label="属性类型" />
          <el-table-column prop="description" label="说明" />
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleInfo(scope.$index, scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="事件定义" name="second">
        <el-table :data="tProperties">
          <el-table-column prop="id" label="标识" />
          <el-table-column prop="name" label="属性名称" />
          <el-table-column prop="valueType.type" label="属性类型" />
          <el-table-column prop="description" label="说明" />
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleInfo(scope.$index, scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="功能定义" name="third">
        <el-table :data="tProperties">
          <el-table-column prop="id" label="标识" />
          <el-table-column prop="name" label="属性名称" />
          <el-table-column prop="valueType.type" label="属性类型" />
          <el-table-column prop="description" label="说明" />
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleInfo(scope.$index, scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 属性详情
    <el-drawer title="属性详情" :visible.sync="drawer" direction="rtl">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="属性标识">
          <el-input v-model="form.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="属性名称">
          <el-input v-model="form.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="属性类型">
          <el-input v-model="form.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer> -->
  </div>
</template>

<script>
export default {
  name: "ThingModelInfo",
  data() {
    return {
      tProperties: [],
      tEvents: [],
      tFunctions: [],
      title: null,
      open: false,
      from: {},
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>