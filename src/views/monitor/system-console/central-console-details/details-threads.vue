<!--
  - Copyright 2014-2018 the original author or authors.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div class="card-main">
    <el-card>
      <div slot="header">
        <span class="title">线程</span>
      </div>
      <div class="sm-title">
        <el-row :gutter="10">
          <el-col :span="8"><span>活动线程</span></el-col>
          <el-col :span="8"><span>守护进程</span></el-col>
          <el-col :span="8"><span>线程峰值</span></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8"
            ><span>{{ current.live }}</span></el-col
          >
          <el-col :span="8"
            ><span>{{ current.daemon }}</span></el-col
          >
          <el-col :span="8"
            ><span>{{ current.peak }}</span></el-col
          >
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <threads-chart v-if="chartData.length > 0" :data="chartData" />
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import sbaConfig from "@/sba-config";
import subscribing from "@/mixins/subscribing";
import Instance from "@/api/subsystem/instance";
import { concatMap, delay, retryWhen, timer } from "@/utils/rxjs";
import moment from "moment";
import threadsChart from "./threads-chart";
import { take } from "rxjs/operators";

export default {
  props: {
    instance: {
      type: Instance,
      required: true,
    },
  },
  mixins: [subscribing],
  components: { threadsChart },
  data: () => ({
    hasLoaded: false,
    error: null,
    current: {
      live: 0,
    },
    chartData: [],
  }),
  methods: {
    async fetchMetrics() {
      const responseLive = this.instance.fetchMetric("jvm.threads.live");
      const responsePeak = this.instance.fetchMetric("jvm.threads.peak");
      const responseDaemon = this.instance.fetchMetric("jvm.threads.daemon");

      return {
        live: (await responseLive).data.measurements[0].value,
        peak: (await responsePeak).data.measurements[0].value,
        daemon: (await responseDaemon).data.measurements[0].value,
      };
    },
    createSubscription() {
      const vm = this;
      return timer(0, sbaConfig.uiSettings.pollTimer.threads)
        .pipe(
          concatMap(this.fetchMetrics),
          retryWhen((err) => {
            return err.pipe(delay(1000), take(5));
          })
        )
        .subscribe({
          next: (data) => {
            vm.hasLoaded = true;
            vm.current = data;
            vm.chartData.push({ ...data, timestamp: moment().valueOf() });
          },
          error: (error) => {
            vm.hasLoaded = true;
            console.warn("Fetching threads metrics failed:", error);
            vm.error = error;
          },
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.card-main {
  width: 100%;
}
.threads-current {
  margin-bottom: 0 !important;
}
.title {
  font-weight: 800;
}
.sm-title {
  font-size: 14px;
  text-align: center;
}
</style>
