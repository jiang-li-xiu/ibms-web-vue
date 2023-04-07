<!--
 * @Author: Yelucc
 * @Date: 2021-06-24 10:13:51
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-27 11:01:29
 * @Description: 
-->
<template>
  <div class="card-main">
    <el-card class="card" v-if="edit">
      <div slot="header">
        <el-row>
          <el-col :span="4">
            <system-svg-icon
              style="margin-top: 5px"
              :icon-class="pluginBasicInfo.icon"
            />
          </el-col>
          <el-col :span="19" style="padding-left: 8px">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-link :underline="false" @click="infoPage()">
                  <span class="title">{{ pluginBasicInfo.title }}</span>
                </el-link>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="sm-title">
              <el-col :span="24"
                ><span class="k-status" style="color: #aaa">{{
                  pluginBasicInfo.code
                }}</span></el-col
              >
            </el-row>
          </el-col>
        </el-row>
        <el-row
          :gutter="10"
          class="sm-title"
          style="color: #aaa; font-size: 15px"
        >
          <el-col :span="8"><span>所属服务</span></el-col>
          <el-col :span="16"
            ><span>{{ pluginBasicInfo.relationSubSystem }}</span></el-col
          >
        </el-row>
        <el-row
          :gutter="10"
          class="sm-title"
          style="color: #aaa; font-size: 15px"
        >
          <el-col :span="8"><span>物模型数量</span></el-col>
          <el-col :span="16"
            ><span>{{ pluginBasicInfo.thingModelNum }}</span></el-col
          >
        </el-row>
        <el-row
          :gutter="10"
          class="sm-title"
          style="color: #aaa; font-size: 15px"
        >
          <el-col :span="8"><span>状态</span></el-col>
          <el-col :span="16"
            ><span
              ><div
                class="status-point"
                :style="{
                  color:
                    pluginBasicInfo.status === 'ENABLE'
                      ? 'rgb(13, 206, 61)'
                      : 'rgb(240, 50, 2)',
                }"
              ></div>
              {{ pluginBasicInfo.status === "ENABLE" ? "启用" : "停用" }}</span
            ></el-col
          >
        </el-row>
      </div>

      <div style="overflow: hidden; text-align: center">
        <el-row :gutter="10">
          <el-col :span="12">
            <div style="border-right: 1px solid #ccc">
              <el-link :underline="false">
                <em
                  title="查看详情"
                  class="el-icon-view icon_font cursor_pointer"
                  style="color: #0000ff"
                  @click="infoPage()"
                ></em>
              </el-link></div
          ></el-col>

          <el-col :span="12"
            ><div>
              <el-link :underline="false">
                <em
                  class="el-icon-circle-close icon_font cursor_pointer"
                  style="color: #ff0000"
                  title="停用"
                  v-if="pluginBasicInfo.status === 'ENABLE'"
                  @click="enableOrDisable"
                >
                </em>
                <em
                  class="el-icon-circle-check icon_font cursor_pointer"
                  style="color: #00ff00"
                  title="开启"
                  v-else
                  @click="enableOrDisable"
                ></em>
              </el-link></div
          ></el-col>
        </el-row>
      </div>
    </el-card>

    <!-- <el-card v-else>
      <div @click="titleClickHandler" style="height: 6vh">
        <el-row>
          <el-col :span="4">
            <el-image
              :src="
                pluginBasicInfo.icon ||
                require('@/assets/icons/plug-in.png')
              "
            />
          </el-col>
          <el-col :span="19" style="padding-left: 8px">
            <el-row :gutter="10">
              <el-col :span="24">
                <span class="title">{{ pluginBasicInfo.title }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="sm-title">
              <el-col :span="24"
                ><span class="k-status" style="color: #aaa">{{
                  pluginBasicInfo.code
                }}</span></el-col
              >
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-card> -->

    <el-card v-else class="click" @click.native="titleClickHandler">
      <div class="flex align-center">
        <el-image
          style="width: 60px; height: 60px"
          :src="
            pluginBasicInfo.icon || require('@/assets/icons/integration.png')
          "
        />
        <div class="pl-20">
          <div class="title">{{ pluginBasicInfo.title || "插件" }}</div>
          <div class="mb-20" style="font-size: 14px; line-height: 36px">
            {{ pluginBasicInfo.code }}
          </div>
          <div class="flex" style="line-height: 20px">
            <div class="status">状态</div>

            <div class="flex align-center plr-20">
              <div
                class="status-point mr-5"
                :style="{
                  color:
                    pluginBasicInfo.status == 'ENABLE'
                      ? 'rgb(13, 206, 61)'
                      : 'rgb(240, 50, 2)',
                }"
              ></div>
              {{ pluginBasicInfo.status == "ENABLE" ? "已启动" : "未启动" }}
            </div>
            <!-- <el-link
              :type="systemInfo.status == 'ENABLE' ? 'danger' : 'success'"
              >{{ systemInfo.status == "ENABLE" ? "停用" : "启动" }}</el-link
            > -->
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import SystemSvgIcon from "@/components/SystemSvgIcon";
import { subPluginEnable, subPluginDisable } from "@/api/service/nacosService";

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
    pluginBasicInfo: {
      type: Object,
      default: () => {
        return {
          title: "海康威视视频插件-1.0",
          relationSubSystem: "视频监控",
          thingModelNum: 3,
          status: true,
          code: "hik-1.0",
          icon: require("@/assets/icons/plug-in.png"),
        };
      },
    },
  },
  data() {
    return {};
  },

  methods: {
    infoPage() {
      console.log(this.pluginBasicInfo);
      this.$router.push({
        name: "PluginsDetailPage",
        params: { data: this.pluginBasicInfo },
      });
    },
    titleClickHandler() {
      this.$emit("titleClickHandler", this.pluginBasicInfo);
    },
    // 服务器启停
    enableOrDisable() {
      let msg = `是否确认${
        this.pluginBasicInfo.status === "ENABLE" ? "停用" : "启用"
      } [ ${this.pluginBasicInfo.title} ]的服务？`;

      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (this.pluginBasicInfo.status === "ENABLE") {
            subPluginDisable(this.pluginBasicInfo.code)
              .then((res) => {
                console.log("subPluginDisable:", res);
                let msg =
                  this.pluginBasicInfo.status === "ENABLE" ? "停用" : "启用";
                this.msgSuccess(msg + "成功");
                this.$emit("subPlugins");
              })
              .catch(() => {
                this.msgError(msg + "失败");
              });

            return;
          }

          subPluginEnable(this.pluginBasicInfo.code)
            .then((res) => {
              console.log("subPluginEnable:", res);
              let msg =
                this.pluginBasicInfo.status === "ENABLE" ? "停用" : "启用";
              this.msgSuccess(msg + "成功");
              this.$emit("subPlugins");
            })
            .catch(() => {
              this.msgError(msg + "失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
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
  background: rgba($color: #6cd4e2, $alpha: 0.1);
  cursor: pointer;
}
.card-main {
  width: 300px;
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
  margin-top: 6px;
}
.status-point {
  width: 5px;
  height: 5px;
  border: 5px solid;
  border-radius: 5px;
  display: inline-block;
}
.footer {
  height: 16px;
}
.status {
  color: #aaa;
}
.card {
  margin: 5px;
}
.icon_font {
  font-size: 24px;
}
</style>
