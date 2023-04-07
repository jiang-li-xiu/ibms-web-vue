<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-04-14 09:36:07
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-05 09:09:53
-->
<template>
  <el-card class="system-card">
    <!-- 头部 -->
    <div class="card-top">
      <!-- 子系统图标 -->
      <system-svg-icon class="card-top-icon" :icon-class="systemInfo.icon" />
      <!-- 子系统名称 -->
      <div class="card-top-name" @click="handelDetailPage">
        {{ systemInfo.title || "子系统" }}
      </div>
      <!-- 开关 -->
      <el-switch
        class="card-switch"
        active-color="#5ebe67"
        v-model="systemInfo.status"
        active-text="开启"
        inactive-text="关闭"
        active-value="ENABLE"
        inactive-value="DISABLE"
        @change="changeSystem"
      ></el-switch>
    </div>

    <!-- 主体-插件 -->
    <div class="card-main" v-if="systemInfo.subPluginList.length">
      <div
        class="card-main-for"
        v-for="item in systemInfo.subPluginList"
        :key="item.id"
      >
        <!-- 插件名称 -->
        <div class="card-main-title" :title="item.title">{{ item.title }}</div>
        <!-- 使用开关 -->
        <!-- <el-switch
          class="card-switch2"
          v-model="item.use"
          active-value="0"
          inactive-value="1"
          active-text="使用中"
          inactive-text="停用中"
          @change="changePlugin(item)"
        ></el-switch> -->
        <!-- 调试开关 -->
        <el-switch
          class="card-switch"
          v-model="item.status"
          active-value="ENABLE"
          inactive-value="DISABLE"
          active-text="开启"
          inactive-text="关闭"
          @change="debugPlugin(item)"
        ></el-switch>
      </div>
    </div>
    <el-empty v-else :image-size="50" description="暂无插件"></el-empty>
  </el-card>
</template>

<script>
import SystemSvgIcon from "@/components/SystemSvgIcon";
import {
  subSystemEnable,
  subSystemDisable,
  subPluginEnable,
  subPluginDisable,
  putSelectPlug,
} from "@/api/service/nacosService";
export default {
  name: "SubsystemCard",
  components: {
    SystemSvgIcon,
  },
  props: {
    systemInfo: {
      type: Object,
      default: () => {
        return {
          icon: require("@/assets/icons/integration.png"),
          title: "视频监控系统",
          code: "videomonitor",
          status: true,
          subPluginList: [
            {
              pname: "海康威视子插件-V1.0",
              status: true,
            },
          ],
        };
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    //   跳转至详情页
    handelDetailPage() {
      this.$router.push({
        name: "SystemDetailPage",
        params: { data: this.systemInfo },
      });
    },
    // 控制子系统开关
    changeSystem(value) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let func;
      if (value != "ENABLE") {
        func = subSystemDisable;
      } else {
        func = subSystemEnable;
      }
      func(this.systemInfo.code)
        .then((res) => {
          loading.close();
          this.msgSuccess("操作成功");
        })
        .catch(() => {
          loading.close();
        });
    },
    // 控制插件开关
    changePlugin(value) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      putSelectPlug({ code: value.code, subsystem: value.relationSubSystem })
        .then((response) => {
          this.msgSuccess("操作成功");
          // this.systemInfo.subPluginList.forEach((item) => {
          //   if (value.id == item.id) {
          //     item.use = "0";
          //   } else {
          //     item.use = "1";
          //   }
          // });
          loading.close();
        })
        .catch(() => {
          loading.close();
        });
    },
    // 控制插件是否可调式开关
    debugPlugin(value) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let func;
      if (value.status != "ENABLE") {
        func = subPluginDisable;
      } else {
        func = subPluginEnable;
      }
      func(value.code)
        .then((res) => {
          loading.close();
          this.msgSuccess("操作成功");
        })
        .catch(() => {
          loading.close();
        });
    },
  },
};
</script>
<style lang='scss' >
.system-card {
  width: 450px;
  height: 200px;
  margin: 5px;
  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid #ddd;
    .card-top-icon {
      //   flex: 1;
    }
    .card-top-name {
      width: 250px;
      font-size: 20px;
      font-weight: 1000;
      color: rgb(2, 167, 240);
      line-height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .card-top-switch {
      //   flex: 1;
    }
  }
  .card-main {
    height: 111px;
    margin-top: 12px;
    overflow-y: auto;
    overflow-x: hidden;
    .card-main-for {
      display: flex;
      justify-content: space-between;
      padding-bottom: 12px;
      .card-main-title {
        width: 160px;
      }
    }
  }
  .card-switch .el-switch__label,
  .card-switch2 .el-switch__label {
    position: absolute;
    display: none;
    color: #fff !important;
  }
  /*打开时文字位置设置*/
  .card-switch .el-switch__label--right,
  .card-switch2 .el-switch__label--right {
    z-index: 1;
  }
  .card-switch .el-switch__label--left,
  .card-switch2 .el-switch__label--left {
    z-index: 1;
  }
  /* 调整关闭时文字的显示位子 */
  .card-switch .el-switch__label--left span,
  .card-switch2 .el-switch__label--left span {
    margin-left: 22px;
  }
  /*显示文字*/
  .card-switch .el-switch__label.is-active,
  .card-switch2 .el-switch__label.is-active {
    display: block;
  }
  /* 调整按钮的宽度 */
  .card-switch.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 60px !important;
  }
  .card-switch2.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 73px !important;
  }
}
</style>