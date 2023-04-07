<!--
 * @Author: Yelucc
 * @Date: 2021-06-24 10:13:51
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-29 11:37:06
 * @Description: 
-->
<template>
  <div class="card-main">
    <el-card class="card" v-if="edit">
      <div slot="header">
        <div>
          <el-row>
            <el-col :span="4">
              <system-svg-icon
                style="margin-top: 5px"
                :icon-class="systemInfo.icon"
              />
            </el-col>

            <el-col :span="20">
              <el-row :gutter="10">
                <el-col :span="14">
                  <el-link :underline="false">
                    <span class="title" @click="onClickDetailPage">{{
                      systemInfo.title || "子系统"
                    }}</span>
                  </el-link>
                </el-col>

                <el-col :span="10">
                  <div
                    style="
                      display: flex;
                      justify-content: flex-end;
                      align-items: center;
                    "
                  >
                    <el-switch
                      class="switch"
                      active-color="#5ebe67"
                      v-model="systemInfo.status"
                      active-text="启用"
                      inactive-text="停用"
                      active-value="ENABLE"
                      inactive-value="DISABLE"
                      @change="changeStatus"
                    ></el-switch>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>

      <div style="overflow: auto; height: 100px">
        <ul v-if="systemInfo.subPluginList.length !== 0" class="list">
          <li
            v-for="item in systemInfo.subPluginList"
            :key="item.id"
            class="list-item sm-title"
          >
            <el-row>
              <el-col :span="14">
                <div class="ellipsis" :title="item.title">{{ item.title }}</div>
              </el-col>

              <el-col :span="10">
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    "
                    @click="changePlugInUnit($event, item)"
                  >
                    <div style="" class="radio-box">
                      <span
                        class="radio-box-activity"
                        v-if="item.use == '1'"
                      ></span>
                      <span v-else></span>
                    </div>

                    <div>
                      <span
                        style="
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          color: #207bff;
                        "
                        v-if="item.use == '1'"
                        >正在使用</span
                      >
                      <span v-else>未使用</span>
                    </div>
                  </div>

                  <el-switch
                    class="switch"
                    v-model="item.status"
                    active-text="启用"
                    inactive-text="停用"
                    active-value="ENABLE"
                    inactive-value="DISABLE"
                    @change="changeEnableOrDisableForPlugin($event, item)"
                  ></el-switch>
                </div>
              </el-col>
            </el-row>
          </li>
        </ul>
        <el-empty
          style="margin-top: -45px; height: 145px"
          v-else
          :image-size="50"
          description="暂无插件"
        ></el-empty>
      </div>
    </el-card>

    <el-card v-else class="click" @click.native="titleClickHandler">
      <div class="flex align-center">
        <el-image
          style="width: 60px; height: 60px"
          :src="systemInfo.icon || require('@/assets/icons/integration.png')"
        />
        <div class="pl-20">
          <div class="title">{{ systemInfo.title || "子系统" }}</div>
          <div class="mb-20" style="font-size: 14px; line-height: 36px">
            {{ systemInfo.code }}
          </div>
          <div class="flex" style="line-height: 20px">
            <div class="status">状态1</div>
            <div class="flex align-center plr-20">
              <div
                class="status-point mr-5"
                :style="{
                  color:
                    systemInfo.status == 'ENABLE'
                      ? 'rgb(13, 206, 61)'
                      : 'rgb(240, 50, 2)',
                }"
              ></div>
              {{ systemInfo.status == "ENABLE" ? "已启动" : "未启动" }}
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
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
  name: "SubSystemCard",
  components: {
    SystemSvgIcon,
  },
  props: {
    edit: {
      type: Boolean,
      default: () => true,
    },
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
    return {
      radio: "1",
    };
  },
  methods: {
    titleClickHandler() {
      // console.log(this.systemInfo);
      this.$emit("titleClickHandler", this.systemInfo);
    },

    // 跳转到详情页
    onClickDetailPage() {
      this.$router.push({
        name: "SystemDetailPage",
        params: { data: this.systemInfo },
      });
    },

    // 选择插件
    changePlugInUnit(e, item) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      putSelectPlug({ code: item.code, subsystem: item.relationSubSystem })
        .then((response) => {
          this.msgSuccess("请求成功");
          this.systemInfo.subPluginList = this.systemInfo.subPluginList.map(
            (items) => {
              if (item.id == items.id) {
                items.use = "1";
              } else {
                items.use = "0";
              }
              console.log("subPluginList:", this.systemInfo.subPluginList);
              return items;
            }
          );
          loading.close();
        })
        .catch(() => {
          loading.close();
        });
    },

    // 服务器启停用
    changeStatus(e) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      console.log(e);
      if (e != "ENABLE") {
        subSystemDisable(this.systemInfo.code)
          .then((res) => {
            loading.close();
            if (res.code === 200) {
              this.msgSuccess("请求成功");
            } else {
              this.msgError("请求失败");
            }
          })
          .catch(() => {
            loading.close();
          });
        return;
      } else {
        subSystemEnable(this.systemInfo.code)
          .then((res) => {
            loading.close();
            if (res.code === 200) {
              this.msgSuccess("请求成功");
            } else {
              this.msgError("请求失败");
            }
          })
          .catch(() => {
            loading.close();
          });
      }
    },

    // 插件启动或停用
    changeEnableOrDisableForPlugin(e, row) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      if (row.status != "ENABLE") {
        subPluginDisable(row.code)
          .then((res) => {
            loading.close();
            if (res.code === 200) {
              this.msgSuccess("请求成功");
            } else {
              this.msgError("请求失败");
            }
          })
          .catch(() => {
            loading.close();
          });
        return;
      }
      subPluginEnable(row.code)
        .then((res) => {
          loading.close();
          if (res.code === 200) {
            this.msgSuccess("请求成功");
          } else {
            this.msgError("请求失败");
          }
        })
        .catch(() => {
          loading.close();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.click {
  height: 139px;
  display: flex;
  align-items: center;
}
.click:hover {
  background-color: #6cd4e2;
  opacity: 0.1;
  cursor: pointer;
}
.card-main {
  width: 450px;
  display: inline-block;
}
.title {
  width: 180px;
  font-size: 20px;
  font-weight: 1000;
  color: rgb(2, 167, 240);
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sm-title {
  font-size: 14px;
}
.status-point {
  width: 5px;
  height: 5px;
  border: 5px solid;
  border-radius: 5px;
  display: inline-block;
}
.list-item {
  width: 95%;
  margin-bottom: 7px;
}
.card {
  margin: 5px;
}
.status {
  color: #aaa;
}

/* ----------------------------------------修改 Switch 组件样式---------------------------------------- */
.switch .el-switch__label {
  position: absolute;
  display: none;
  color: #fff !important;
}

/*打开时文字位置设置*/
.switch .el-switch__label--right {
  z-index: 1;
}

/* 调整打开时文字的显示位子 */
.switch .el-switch__label--right span {
  margin-left: 9px;
}

/*关闭时文字位置设置*/
.switch .el-switch__label--left {
  z-index: 1;
}

/* 调整关闭时文字的显示位子 */
.switch .el-switch__label--left span {
  margin-left: 22px;
}

/*显示文字*/
.switch .el-switch__label.is-active {
  display: block;
}

/* 调整按钮的宽度 */
.switch.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 60px !important;
  margin: 0;
}
/* ----------------------------------------修改 Switch 组件样式---------------------------------------- */

.list-item {
  /* width: 95%; */
}

.ellipsis {
  /* 超出隐藏 */
  overflow: hidden;
  /* 不换行 */
  white-space: nowrap;
  /* 使用省略号 */
  text-overflow: ellipsis;
}

.el-card__body {
  padding: 15px;
}

.radio-box span {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-right: 6px;
  border: 2px solid #777;
}

span {
  cursor: pointer;
}

.radio-box-activity {
  border: 2px solid #207bff !important;
  background: #207bff !important;
}
</style>
