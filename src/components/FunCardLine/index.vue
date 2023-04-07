<!--
 * @Author: Yelucc
 * @Date: 2021-07-05 14:10:36
 * @LastEditors: MJ
 * @LastEditTime: 2021-08-11 14:36:39
 * @Description: 
-->
<template>
  <div>
    <el-form ref="data" :model="data" label-width="80px">
      <el-form-item label="功能标识">
        <el-input v-model="data.identifier" :disabled="!edit"></el-input>
      </el-form-item>

      <el-form-item label="功能名称">
        <el-input v-model="data.name" :disabled="!edit"></el-input>
      </el-form-item>
      
      <!-- <el-form-item label="异步调用">
        <el-input v-model="data.callType" :disabled="!edit"></el-input>
      </el-form-item> -->

      <el-form-item label="输入参数">
        <el-table :data="data.inputData">
          <el-table-column prop="field" label="属性标识">
          </el-table-column>
          <el-table-column prop="name" label="属性名"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                class="bg-color"
                size="small"
                @click="handleUpdate(scope.row)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="输出参数">
        <el-table :data="data.outputData">
          <el-table-column prop="field" label="属性标识">
          </el-table-column>
          <el-table-column prop="name" label="属性名"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                class="bg-color"
                size="small"
                @click="handleUpdate(scope.row)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item v-if="edit">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 属性详情抽屉 -->
    <el-drawer title="属性详情" :visible.sync="p_drawer" :append-to-body="true">
      <properties-card-line :data="dataInfo"></properties-card-line>
    </el-drawer>
  </div>
</template>

<script>
import PropertiesCardLine from "@/components/PropertiesCardLine";
export default {
  name: "FunCardLine",
  components: { PropertiesCardLine },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          identifier: "sfe342552332sdafd",
          name: "抓拍",
          desc: "抓拍",
          required: true,
          callType: "async",
          inputData: [
            {
              identifier: "cameraIndexCode",
              name: "监控点唯一标识",
              dataType: {
                type: "text",
                specs: {
                  length: 200,
                },
              },
            },
          ],
          outputData: [
            {
              identifier: "picUrl",
              name: "图片url信息",
              dataType: {
                type: "text",
                specs: {
                  length: 2000,
                },
              },
            },
          ],
          method: "dfsaf4325dfslgjfl",
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
      p_drawer: false,
        dataInfo:null,
    };
  },
  methods: {
    onSubmit() {},
    handleUpdate(v) {
      this.p_drawer = true;
      this.dataInfo = v
    },
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
  color:oldlace;
}

.main {
  width: 85vw;
}
</style>