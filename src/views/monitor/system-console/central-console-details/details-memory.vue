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
        <span class="title">{{ "内存" + `: ${name}` }}</span>
      </div>
      <div class="sm-title">
        <el-row :gutter="10">
          <el-col :span="current.metaspace ? 6 : 8" v-if="current.metaspace">
            <span>初始空间</span>
          </el-col>
          <el-col :span="current.metaspace ? 6 : 8"><span>已用</span></el-col>
          <el-col :span="current.metaspace ? 6 : 8">
            <span>当前可用</span>
          </el-col>
          <el-col :span="current.metaspace ? 6 : 8"><span>最大</span></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="current.metaspace ? 6 : 8" v-if="current.metaspace">
            <span>{{ (current.metaspace / 1024 / 1024).toFixed(2) + "M" }}</span>
          </el-col>
          <el-col :span="current.metaspace ? 6 : 8">
            <span>{{ (current.used / 1024 / 1024).toFixed(2) + "M" }}</span>
          </el-col>
          <el-col :span="current.metaspace ? 6 : 8">
            <span>{{ (current.committed / 1024 / 1024).toFixed(2) + "M" }}</span>
          </el-col>
          <el-col :span="current.metaspace ? 6 : 8">
            <span>{{ (current.max / 1024 / 1024).toFixed(2) + "M" }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24"
            ><mem-chart v-if="chartData.length > 0" :data="chartData"
          /></el-col>
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
// import prettyBytes from "pretty-bytes";
import memChart from "./mem-chart";
import { take } from "rxjs/operators";

export default {
  props: {
    instance: {
      type: Instance,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  mixins: [subscribing],
  components: { memChart },
  data: () => ({
    hasLoaded: false,
    error: null,
    current: {
      metaspace: null,
    },
    chartData: [],
  }),
  computed: {
    name() {
      switch (this.type) {
        case "heap":
          return "Heap";
        case "nonheap":
          return "Non heap";
        default:
          return this.type;
      }
    },
  },
  methods: {
    // prettyBytes,
    async fetchMetrics() {
      try {
        const responseMax = this.instance.fetchMetric("jvm.memory.max", {
          area: this.type,
        });
        const responseUsed = this.instance.fetchMetric("jvm.memory.used", {
          area: this.type,
        });
        const hasMetaspace = (await responseUsed).data.availableTags.some(
          (tag) => tag.tag === "id" && tag.values.includes("Metaspace")
        );
        const responeMetaspace =
          this.type === "nonheap" && hasMetaspace
            ? this.instance.fetchMetric("jvm.memory.used", {
                area: this.type,
                id: "Metaspace",
              })
            : null;
        const responseCommitted = this.instance.fetchMetric("jvm.memory.committed", {
          area: this.type,
        });
        return {
          max: (await responseMax).data.measurements[0].value,
          used: (await responseUsed).data.measurements[0].value,
          metaspace: responeMetaspace
            ? (await responeMetaspace).data.measurements[0].value
            : null,
          committed: (await responseCommitted).data.measurements[0].value,
        };
      } catch (err) {
        console.log(err);
        let e = err;
      }
    },
    createSubscription() {
      const vm = this;
      return timer(0, sbaConfig.uiSettings.pollTimer.memory)
        .pipe(
          concatMap(this.fetchMetrics),
          retryWhen((err) => {
            return err.pipe(delay(1000), take(5));
          })
        )
        .subscribe({
          next: (data) => {
            // vm.hasLoaded = true;
            vm.current = data;
            vm.chartData.push({ ...data, timestamp: moment().valueOf() });
          },
          error: (error) => {
            // vm.hasLoaded = true;
            // console.warn("Fetching memory metrics failed:", error);
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
.memory-current {
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
