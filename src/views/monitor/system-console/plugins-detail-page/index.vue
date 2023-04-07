<!--
 * @Author: Yelucc
 * @Date: 2021-06-24 15:05:32
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-24 16:20:26
 * @Description: 
-->
<template>
  <div>
    <!-- 顶部返回及标题 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :xl="5" :lg="6" :sm="8" :xs="10">
          <el-page-header @back="goBack" :content="pluginsData.title">
          </el-page-header>
        </el-col>
        <el-col :xl="19" :lg="18" :sm="16" :xs="14"
          ><div
            class="status-point"
            :style="{
              color:
                pluginsData.status == 'ENABLE'
                  ? 'rgb(13, 206, 61)'
                  : 'rgb(240, 50, 2)',
            }"
          ></div>
          {{ pluginsData.status == "ENABLE" ? "已启用" : "已停用" }}</el-col
        >
      </el-row>
    </el-card>
    <el-tabs type="border-card">
      <el-tab-pane label="服务信息">
        <div v-if="hasProcess && hasGc && hasThreads && hasMemory">
          <el-row :gutter="10" type="flex">
            <el-col :xs="24" :sm="24" :lg="24" :xl="12">
              <details-process :instance="instance" />
            </el-col>
            <el-col :xs="24" :sm="24" :lg="24" :xl="12"
              ><details-gc :instance="instance"
            /></el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :lg="8" :xl="8"
              ><details-threads :instance="instance"
            /></el-col>
            <el-col :xs="24" :sm="24" :lg="8" :xl="8"
              ><details-memory :instance="instance" type="heap"
            /></el-col>
            <el-col :xs="24" :sm="24" :lg="8" :xl="8"
              ><details-memory :instance="instance" type="nonheap"
            /></el-col>
          </el-row>
        </div>
        <el-empty
          v-else
          description="服务详细信息为空"
          :image-size="300"
        ></el-empty>
      </el-tab-pane>
      <el-tab-pane label="物模型">
        <div v-if="thingModelList.length !== 0">
          <thing-model-table :modelData="thingModelList"></thing-model-table>
        </div>
        <el-empty
          v-else
          description="物模型信息为空"
          :image-size="300"
        ></el-empty>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 局部组件
import detailsCaches from "../central-console-details/details-caches";
import detailsDatasources from "../central-console-details/details-datasources";
import detailsGc from "../central-console-details/details-gc";
import detailsHealth from "../central-console-details/details-health";
import detailsInfo from "../central-console-details/details-info";
import detailsMemory from "../central-console-details/details-memory";
import detailsMetadata from "../central-console-details/details-metadata";
import detailsProcess from "../central-console-details/details-process";
import detailsThreads from "../central-console-details/details-threads";

// 全局组件
import Instance from "@/api/subsystem/instance";
import ThingModelTable from "../components/ThingModelTable";
import { getThingModelByPid } from "@/api/subsystem/system";
export default {
  name: "PluginsDetailPage",
  components: {
    detailsHealth,
    detailsInfo,
    detailsProcess,
    detailsThreads,
    detailsDatasources,
    detailsMemory,
    detailsGc,
    detailsCaches,
    detailsMetadata,
    ThingModelTable,
  },
  data() {
    return {
      hasLoaded: false,
      error: null,
      metrics: [],
      //子插件数据
      pluginsData: {},
      // 系统运行数据
      instance: null,
      // 系统id
      instanceId: null,
      // 物模型数据
      thingModelList: [],
    };
  },
  activated() {
    if (this.$route.params.data !== undefined) {
      console.log(this.$route.params.data);
      // 保存子系统id
      this.instanceId = this.$route.params.data.instanceId;
      // 头部数据展示
      this.pluginsData = this.$route.params.data;
    }
    this.instance = new Instance({ id: this.instanceId });
    this.fetchMetricIndex();
    getThingModelByPid(this.pluginsData.code).then((res) => {
      console.log(res);
      this.thingModelList = res.data;
    });
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
    goBack() {
      this.$router.push({ path: "/subsusteminfo/systemdetailpage" });
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
</style>