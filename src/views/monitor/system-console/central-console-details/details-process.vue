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
    <el-descriptions
      class="margin-top"
      title="进程"
      :column="5"
      direction="vertical"
      border
    >
      <el-descriptions-item>
        <template slot="label">
          <em class="el-icon-user"></em>
          进程ID
        </template>
        {{ pid }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <em class="el-icon-mobile-phone"></em>
          运行时间
        </template>
        <process-uptime :value="toMillis(uptime.value, uptime.baseUnit)" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <em class="el-icon-location-outline"></em>
          进程CPU使用率
        </template>
        {{ processCpuLoad }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <em class="el-icon-tickets"></em>
          系统CPU使用率
        </template>
        {{ systemCpuLoad }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <em class="el-icon-tickets"></em>
          CPU核心数
        </template>
        {{ systemCpuCount }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import sbaConfig from "@/sba-config";
import subscribing from "@/mixins/subscribing";
import Instance from "@/api/subsystem/instance";
import { concatMap, delay, retryWhen, timer } from "@/utils/rxjs";
import { toMillis } from "../metrics/metric";
import processUptime from "./process-uptime";
import { take } from "rxjs/operators";

export default {
  props: {
    instance: {
      type: Instance,
      required: true,
    },
  },
  mixins: [subscribing],
  components: { processUptime },
  data: () => ({
    hasLoaded: false,
    error: null,
    pid: null,
    uptime: { value: null, baseUnit: null },
    systemCpuLoad: null,
    processCpuLoad: 0,
    systemCpuCount: 0,
  }),
  created() {
    this.fetchPid();
    this.fetchUptime();
    this.fetchCpuCount();
  },
  methods: {
    toMillis,
    async fetchUptime() {
      try {
        const response = await this.fetchMetric("process.uptime");
        this.uptime = {
          value: response.measurements[0].value,
          baseUnit: response.baseUnit,
        };
      } catch (error) {
        this.error = error;
        console.warn("Fetching Uptime failed:", error);
      }
      this.hasLoaded = true;
    },
    async fetchPid() {
      if (this.instance.hasEndpoint("env")) {
        try {
          const response = await this.instance.fetchEnv("PID");
          this.pid = response.data.property.value;
        } catch (error) {
          console.warn("Fetching PID failed:", error);
        }
        this.hasLoaded = true;
      }
    },
    async fetchCpuCount() {
      try {
        this.systemCpuCount = (
          await this.fetchMetric("system.cpu.count")
        ).measurements[0].value;
      } catch (error) {
        console.warn("Fetching Cpu Count failed:", error);
      }
      this.hasLoaded = true;
    },
    createSubscription() {
      const vm = this;
      return timer(0, sbaConfig.uiSettings.pollTimer.process)
        .pipe(
          concatMap(this.fetchCpuLoadMetrics),
          retryWhen((err) => {
            return err.pipe(delay(1000), take(5));
          })
        )
        .subscribe({
          next: (data) => {
            vm.processCpuLoad = data.processCpuLoad;
            vm.systemCpuLoad = data.systemCpuLoad;
          },
          error: (error) => {
            vm.hasLoaded = true;
            console.warn("Fetching CPU Usage metrics failed:", error);
            vm.error = error;
          },
        });
    },
    async fetchCpuLoadMetrics() {
      const fetchProcessCpuLoad = this.fetchMetric("process.cpu.usage");
      const fetchSystemCpuLoad = this.fetchMetric("system.cpu.usage");
      let processCpuLoad;
      let systemCpuLoad;
      try {
        processCpuLoad = (
          await fetchProcessCpuLoad
        ).measurements[0].value.toFixed(2);
      } catch (error) {
        console.warn("Fetching Process CPU Load failed:", error);
      }
      try {
        systemCpuLoad = (
          await fetchSystemCpuLoad
        ).measurements[0].value.toFixed(2);
      } catch (error) {
        console.warn("Fetching Sytem CPU Load failed:", error);
      }
      return {
        processCpuLoad,
        systemCpuLoad,
      };
    },
    async fetchMetric(name) {
      const response = await this.instance.fetchMetric(name);
      return response.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-main {
  width: 100%;
}
.title {
  font-weight: 800;
}
.sm-title {
  font-size: 14px;
  text-align: center;
}
</style>
