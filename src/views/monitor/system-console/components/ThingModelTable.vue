<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-09-15 15:55:33
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-15 16:49:06
-->
<template>
  <el-tabs :tab-position="tabPosition" style="height: calc(100vh - 270px)">
    <el-tab-pane
      v-for="(item, index) in modelData"
      :key="index"
      :label="item.name"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="属性定义" name="first">
          <el-table :data="item.properties" border>
            <el-table-column label="属性ID" align="center" prop="field" />
            <el-table-column label="属性名称" align="center" prop="name" />
            <el-table-column
              label="数据类型"
              align="center"
              prop="dataType.type"
            />
            <el-table-column label="是否只读" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.accessMode == "r" ? "是" : "否" }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="功能定义" name="second">
          <el-table :data="item.functions" border>
            <el-table-column label="功能Id" align="center" prop="identifier" />
            <el-table-column label="功能名称" align="center" prop="name" />
            <el-table-column label="是否必需" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.required ? "是" : "否" }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="事件定义" name="third">
          <el-table :data="item.events" border>
            <el-table-column label="事件Id" align="center" prop="identifier" />
            <el-table-column label="事件名称" align="center" prop="eventName" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "ThingModelTable",
  props: {
    modelData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      // 控制tab标签靠左竖线排列
      tabPosition: "left",
      // 默认选中一个
      activeName: "first",
    };
  },
};
</script>
<style scoped lang='scss' >
</style>