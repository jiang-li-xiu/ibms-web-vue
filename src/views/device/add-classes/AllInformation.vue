<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-09-22 10:41:42
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-26 12:01:46
-->
<template>
  <div>
    <div class="step-title">完成配置</div>
    <!-- 顶部基础信息 -->
    <div class="flex mb-20 justify-between">
      <el-card class="flex-3">
        <div class="flex-row-cc">
          <div class="card-main flex">
            <!-- 暂时写死 -->
            <svg-icon
              class="card-image"
              v-if="selectedData.iconFilepath"
              :icon-class="selectedData.iconFilepath"
            />

            <el-image
              v-else
              class="card-image"
              :src="require('@/assets/icons/plug-in.png')"
            />

            <div class="card-text">
              <div :title="selectedData.deviceTypeName">
                {{ selectedData.deviceTypeName }}
              </div>
              <div>
                {{ selectedData.deviceTypeCode }}
              </div>
            </div>
          </div>

          <div class="el-icon-arrow-right plr-20"></div>

          <div class="card-main flex">
            <!-- 暂时写死 -->
            <el-image
              class="card-image"
              :src="require('@/assets/icons/plug-in.png')"
            />

            <div class="card-text">
              <div title="所属子系统">所属子系统</div>
              <div :title="systemName">
                {{ systemName }}
              </div>
            </div>
          </div>

          <div class="el-icon-arrow-right plr-20"></div>

          <div class="card-main flex">
            <!-- 暂时写死 -->
            <el-image
              class="card-image"
              :src="require('@/assets/icons/plug-in.png')"
            />
            <div class="card-text">
              <div title="所属子插件">所属子插件</div>
              <div :title="plugName">
                {{ plugName }}
              </div>
            </div>
          </div>

          <div class="el-icon-arrow-right plr-20"></div>

          <div class="card-main flex">
            <!-- 暂时写死 -->
            <el-image
              class="card-image"
              :src="require('@/assets/icons/plug-in.png')"
            />
            <div class="card-text">
              <div title="所属物模型">所属物模型</div>
              <div :title="modelName">
                {{ modelName }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 物模型信息切换 -->
    <el-card>
      <el-tabs type="card">
        <el-tab-pane label="属性 Properties">
          <el-table
            :height="tableHeight"
            :data="thingModelObject.properties"
            style="width: 100%"
          >
            <el-table-column prop="name" label="属性名"></el-table-column>
            <el-table-column prop="field" label="属性标识"></el-table-column>
            <el-table-column prop="dataType.type" label="属性类型">
              <template slot-scope="scope">
                <span>{{ scope.row.dataType.type }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="accessMode" label="读写模式">
              <template slot-scope="scope">
                <span>{{
                  (scope.row.accessMode.indexOf("r") != -1 ? "读" : "") +
                  (scope.row.accessMode.indexOf("w") != -1 ? "/写" : "")
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="事件 Event">
          <el-table
            :height="tableHeight"
            :data="thingModelObject.events"
            style="width: 100%"
          >
            <el-table-column prop="eventName" label="事件名"></el-table-column>
            <el-table-column
              prop="identifier"
              label="事件标识"
            ></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="功能 Function">
          <el-table
            :height="tableHeight"
            :data="thingModelObject.functions"
            style="width: 100%"
          >
            <el-table-column prop="name" label="功能名"></el-table-column>
            <el-table-column
              prop="identifier"
              label="功能标识"
            ></el-table-column>
            <el-table-column prop="required" label="必填项">
              <template slot-scope="scope">
                <span>{{ scope.row.required ? "必填" : "可选" }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 底部按钮 -->
    <div class="step-button">
      <el-button @click="backStep">上一步</el-button
      ><el-button type="primary" @click="finish">完成</el-button>
    </div>
  </div>
</template>

<script>
import bus from "@/utils/bus.js";

export default {
  name: "AllInformation",
  props: {
    // 第一步的form表单数据，用于渲染顶部卡片
    selectedData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 被选中的物模型属性
    thingModelObject: {
      type: Object,
      default: () => {
        return {
          properties: [],
          events: [],
          functions: [],
        };
      },
    },
  },
  data() {
    return {
      // 表格自适应高度
      tableHeight: 0,
      //所属子系统名称
      systemName: "",
      //所属子插件名称
      plugName: "",
      //所属物模型名称
      modelName: "",
    };
  },
  created() {
    this.getHeight();
    window.addEventListener("resize", this.getHeight);
  },
  mounted() {
    bus.$on("getSelectedData", (data) => {
      // console.log(data);
      this.getData(data);
    });
  },
  beforeDestroy() {
    bus.$off("getSelectedData", this.getData); // 组件销毁时关闭监听
  },
  methods: {
    // 兄弟间传值
    getData(data) {
      this.systemName = data.systemName;
      this.plugName = data.plugName;
      this.modelName = data.modelName;
    },
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 618;
    },
    // 返回上一步
    backStep() {
      this.$emit("backStep");
    },
    // 完成
    finish() {
      this.$emit("finish");
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
};
</script>
<style scoped lang="scss">
.step-title {
  font-size: 24px;
  font-weight: 600;
  padding-left: 20px;
  margin-bottom: 20px;
}
.step-button {
  width: 100%;
  padding: 20px 50px 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.el-icon-arrow-right {
  color: #1890ff;
  font-size: 20px;
}
.card-main {
  flex: 1;
  border: 1px solid #1890ff;
  padding: 20px;
  border-radius: 5px;
  .card-image {
    height: 80px;
    width: 80px;
  }
  .card-text {
    flex: 1;
    padding-left: 10px;
    div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 10px;
      color: #1890ff;
    }
    div:first-child {
      font-weight: 600;
    }
    div:last-child {
      font-size: 14px;
    }
  }
}
@media screen and (max-width: 1920px) {
  .card-text {
    div {
      width: 200px;
    }
  }
}
@media screen and (max-width: 1610px) {
  .card-text {
    div {
      width: 150px;
    }
  }
}
@media screen and (max-width: 1470px) {
  .card-text {
    div {
      width: 140px;
    }
  }
}
@media screen and (max-width: 1460px) {
  .card-text {
    div {
      width: 130px;
    }
  }
}
@media screen and (max-width: 1400px) {
  .card-text {
    div {
      width: 100px;
    }
  }
}
</style>
