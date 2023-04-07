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
      title="垃圾回收"
      :column="3"
      direction="vertical"
      border
    >
      <el-descriptions-item>
        <template slot="label">
          <em class="el-icon-user"></em>
          总计
        </template>
        {{ current.count || "" }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <em class="el-icon-mobile-phone"></em>
          总耗时
        </template>
        {{ current.total_time }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <em class="el-icon-location-outline"></em>
          最大耗时
        </template>
        {{ `${current.max}s` }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import sbaConfig from "@/sba-config";
import subscribing from "@/mixins/subscribing";
import Instance from "@/api/subsystem/instance";
import { concatMap, delay, retryWhen, timer } from "@/utils/rxjs";
import moment from "moment";
import { toMillis } from "../metrics/metric";
import { take } from "rxjs/operators";

export default {
  props: {
    instance: {
      type: Instance,
      required: true,
    },
  },
  mixins: [subscribing],
  data: () => ({
    hasLoaded: false,
    error: null,
    current: {
      count: 0,
    },
  }),
  methods: {
    async fetchMetrics() {
      const response = await this.instance.fetchMetric("jvm.gc.pause");
      const measurements = response.data.measurements.reduce(
        (current, measurement) => ({
          ...current,
          [measurement.statistic.toLowerCase()]: measurement.value,
        }),
        {}
      );
      return {
        ...measurements,
        total_time:
          moment
            .duration(toMillis(measurements.total_time, response.baseUnit))
            .asSeconds()
            .toFixed(4) + "s",
        max: moment
          .duration(toMillis(measurements.max, response.baseUnit))
          .asSeconds()
          .toFixed(4),
      };
    },
    createSubscription() {
      const vm = this;
      return timer(0, sbaConfig.uiSettings.pollTimer.gc)
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
          },
          error: (error) => {
            vm.hasLoaded = true;
            console.warn("Fetching GC metrics failed:", error);
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
.title {
  font-weight: 800;
}
.sm-title {
  font-size: 14px;
  text-align: center;
}
</style>
