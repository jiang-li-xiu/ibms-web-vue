<!--
 * @Author: Yelucc
 * @Date: 2021-06-24 15:05:32
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-27 11:10:27
 * @Description: 
-->
<template>
  <div>
    <!-- 顶部返回及标题 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :xl="5" :lg="6" :sm="8" :xs="10">
          <el-page-header @back="goBack" :content="subsystemData.title"> </el-page-header>
        </el-col>

        <el-col :xl="19" :lg="18" :sm="16" :xs="14">
          <div
            class="status-point"
            :style="{
              color:
                subsystemData.status == 'ENABLE' ? 'rgb(13, 206, 61)' : 'rgb(240, 50, 2)',
            }"
          ></div>

          <span>{{ subsystemData.status == "ENABLE" ? "已启用" : "已停用" }}</span>
        </el-col>
      </el-row>
    </el-card>

    <!-- 切换功能 -->
    <el-tabs type="border-card">
      <el-tab-pane label="服务信息">
        <div
          v-if="
            subsystemData.status === 'ENABLE' &&
            hasProcess &&
            hasGc &&
            hasThreads &&
            hasMemory
          "
        >
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :lg="24" :xl="12">
              <details-process v-if="hasProcess" :instance="instance" />
            </el-col>

            <el-col :xs="24" :sm="24" :lg="24" :xl="12"
              ><details-gc v-if="hasGc" :instance="instance"
            /></el-col>
          </el-row>

          <el-row :gutter="10" style="margin-top: 2em">
            <el-col :xs="24" :sm="24" :lg="8" :xl="8"
              ><details-threads v-if="hasThreads" :instance="instance"
            /></el-col>

            <el-col :xs="24" :sm="24" :lg="8" :xl="8"
              ><details-memory v-if="hasMemory" :instance="instance" type="heap"
            /></el-col>

            <el-col :xs="24" :sm="24" :lg="8" :xl="8"
              ><details-memory v-if="hasMemory" :instance="instance" type="nonheap"
            /></el-col>
          </el-row>
        </div>

        <el-empty v-else description="服务详细信息为空" :image-size="300"></el-empty>
      </el-tab-pane>
      <el-tab-pane label="插件列表">
        <!-- <sub-plugins-card
          v-for="(item, index) in subsystemData.subPluginList"
          :key="index"
          :pluginBasicInfo="item"
        ></sub-plugins-card> -->
        <sub-plugins :serviceName="subsystemData.code || null" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
//局部组件
import detailsCaches from "../central-console-details/details-caches";
import detailsDatasources from "../central-console-details/details-datasources";
import detailsGc from "../central-console-details/details-gc";
import detailsHealth from "../central-console-details/details-health";
import detailsInfo from "../central-console-details/details-info";
import detailsMemory from "../central-console-details/details-memory";
import detailsMetadata from "../central-console-details/details-metadata";
import detailsProcess from "../central-console-details/details-process";
import detailsThreads from "../central-console-details/details-threads";
// import { getApplications } from "@/api/subsystem/system";
//全局组件
import Instance from "@/api/subsystem/instance";
import SubPluginsCard from "@/components/SubPluginsCard";
import SubPlugins from "../components/SubPlugins.vue";
export default {
  name: "SystemDetailPage",
  components: {
    SubPluginsCard,
    detailsHealth,
    detailsInfo,
    detailsProcess,
    detailsThreads,
    detailsDatasources,
    detailsMemory,
    detailsGc,
    detailsCaches,
    detailsMetadata,
    SubPlugins,
  },
  data() {
    return {
      hasLoaded: false,
      error: null,
      metrics: [],
      //子系统数据
      subsystemData: {},
      // 系统运行数据
      instance: null,
      // 系统id
      instanceId: null,
    };
  },
  activated() {
    if (this.$route.params.data !== undefined) {
      // 保存子系统id
      this.instanceId = this.$route.params.data.instanceId;
      // 头部数据展示
      this.subsystemData = this.$route.params.data;
    }
    this.instance = new Instance({ id: this.instanceId });
    this.fetchMetricIndex();
  },
  computed: {
    hasCaches() {
      return this.hasMetric("cache.gets");
    },
    hasDatasources() {
      return this.hasMetric("data.source.active.connections");
    },
    hasGc() {
      return this.hasMetric("jvm.gc.pause");
    },
    hasInfo() {
      return this.instance.hasEndpoint("info");
    },
    hasMemory() {
      return this.hasMetric("jvm.memory.max");
    },
    hasProcess() {
      return this.hasMetric("process.uptime");
    },
    hasThreads() {
      return this.hasMetric("jvm.threads.live");
    },
    hasMetadata() {
      return this.instance.registration && this.instance.registration.metadata;
    },
  },
  methods: {
    // 返回
    goBack() {
      let visitedViews = this.$store.state.tagsView.visitedViews,
        index = visitedViews.findIndex(
          (item) => item.fullPath == "/subsusteminfo/systemdetailpage"
        );
      this.$router.push({ path: "/monitor/system-console" });
      this.$store.state.tagsView.visitedViews.splice(index, 1);
    },

    hasMetric(metric) {
      return this.metrics && this.metrics.includes(metric);
    },
    async fetchMetricIndex() {
      if (this.instance.hasEndpoint("metrics")) {
        this.error = null;
        try {
          const res = await this.instance.fetchMetrics();
          this.metrics = res.data.names;
        } catch (error) {
          console.warn("Fetching metric index failed:", error);
          this.error = error;
        }
        this.hasLoaded = true;
      }
    },
  },
  // mounted() {
  //   this.height = Math.floor(document.body.clientHeight * 0.85);

  //   window.onresize = () => {
  //     if (!this.timer) {
  //       this.height = Math.floor(document.body.clientHeight * 0.85);
  //       this.timer = true;
  //       let _this = this;
  //       setTimeout(function () {
  //         _this.timer = false;
  //       }, 500);
  //     }
  //   };
  // },
};
</script>

<style lang="scss" scoped>
.status-point {
  width: 5px;
  height: 5px;
  border: 5px solid;
  border-radius: 5px;
  display: inline-block;
}
.details-header {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__urls {
    width: 100%;
    text-align: center;
  }
}
// .el-row {
//   margin-bottom: 20px;
//   &:last-child {
//     margin-bottom: 0;
//   }
// }
</style>
