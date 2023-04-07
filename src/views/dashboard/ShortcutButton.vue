<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-08-10 15:50:19
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-24 09:01:51
-->
<template>
  <div>
    <div class="shortcut-button" :style="{ width: width }">
      <div class="title">子系统便捷导航</div>
      <el-row :gutter="20" v-loading="systemLoading">
        <div v-if="routerList.length">
          <el-col
            class="card-panel-col"
            :xs="12"
            :sm="6"
            :md="6"
            :lg="4"
            :xl="3"
            v-for="(item, index) in routerList"
            :key="index"
          >
            <div class="card" @click="routeClick(item.routePath)">
              <div class="card-top flex justify-between w-100">
                <div class="flex">
                  <!-- <img class="system-svg" :src="item.icon" alt /> -->
                  <svg-icon :icon-class="item.icon" style="font-size: 30px" />

                  <div class="flex flex-column justify-between">
                    <div class="name text-207BFF">
                      {{ item.title }}
                    </div>
                    <div class="name status text-8AD416">
                      {{ item.status == "DISABLE" ? "离线" : "在线" }}
                    </div>
                  </div>
                </div>
                <img
                  @click.stop="recode(item)"
                  class="recode-svg"
                  :src="require('../../assets/images/home/recode.png')"
                  alt
                  title="查看详情"
                />
              </div>
              <div class="text flex-row-csa w-100 pt-10">
                <div class="flex-column-cc">
                  <div>总数</div>
                  <div class="text-207BFF">{{ item.deviceTotalNum }}</div>
                </div>
                <div class="flex-column-cc">
                  <div>在线</div>
                  <div class="text-8AD416">{{ item.deviceOnlineNum }}</div>
                </div>
                <div class="flex-column-cc">
                  <div>离线</div>
                  <div>{{ item.deviceOfflineNum }}</div>
                </div>
              </div>
            </div>
          </el-col>
        </div>
        <el-col v-else>
          <div class="null-text">暂无数据</div>
        </el-col>
      </el-row>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="50%">
      <template #title>
        <div>
          <span style="font-size: 20px; font-weight: 600">基本信息详情</span>
          <span
            style="color: #1890ff; margin-left: 16px; cursor: pointer"
            @click="seeDetail"
            >查看详情</span
          >
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="dataDetail"
        :height="tableHeight"
        style="width: 100%"
      >
        <el-table-column
          prop="serviceName"
          label="服务名"
          :formatter="subSystemFormat"
        >
        </el-table-column>

        <el-table-column prop="serviceUrl" label="服务地址"> </el-table-column>

        <el-table-column prop="occurrenceTime" label="发生时间">
        </el-table-column>

        <el-table-column prop="status" label="服务健康状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status == "UP" ? "上线" : "离线" }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.pageNum"
        :limit.sync="query.pageSize"
        :page-sizes="[15, 20, 30, 50]"
        @pagination="getDetails"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getServiceRecords } from "@/api/index";

export default {
  name: "ShortcutButton",
  props: {
    systemLoading: {
      type: Boolean,
      require: true,
    },
    width: {
      type: String,
      default: "100%",
    },
    routerList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 15,
        serviceName: "", // 服务名
      },
      dataDetail: [],
      total: 0,
      dialogVisible: false,
      sub_system: [],
      loading: false,
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight(), true);
    // 获取字典数据
    this.getDicts("operate_type").then((response) => {
      this.operateType = response.data;
    });

    this.getDicts("sub_system").then((response) => {
      console.log("sub_system:", response);
      this.sub_system = response.data;
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight, true);
  },

  methods: {
    // 获取详情数据
    getDetails() {
      this.loading = true;
      getServiceRecords(this.query)
        .then((response) => {
          let {
            data: { total, records },
          } = response;
          this.loading = false;
          this.total = total;
          this.dataDetail = records;
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
    },

    subSystemFormat(row) {
      return this.selectDictLabel(this.sub_system, row.serviceName);
    },

    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 520;
    },

    routeClick(path) {
      console.log("routeClick:", path);
      this.$router.push({ path: "/" + path });
    },

    // 查看详情
    seeDetail() {
      this.$router.push({
        path: `/monitor/service-record?serviceName=${this.query.serviceName}`,
      });

      // this.$router.push(
      //   `/monitor/service-record?serviceName=${this.query.serviceName}`
      // );
    },

    // 查看大概信息
    recode(data) {
      this.query.serviceName = data.code;
      this.dialogVisible = true;
      this.getDetails();
    },
  },
};
</script>

<style scoped lang="scss">
.status {
  margin-top: 6px;
}

.shortcut-button {
  background-color: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}
.title {
  height: 22px;
  font-size: 16px;
  color: #666666;
  font-weight: 600;
  margin-bottom: 16px;
}
.card-panel-col {
  margin-bottom: 30px;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  box-shadow: 0px 0px 6px 1px #d9d9d9;
  background-color: #fff;
  cursor: pointer;
  transform: 2s;
}
.card:hover {
  transform: scale(1.1);
}
.card-top {
  padding-bottom: 16px;
  border-bottom: 1px solid #d9d9d9;
}
.system-svg {
  width: 50px;
  height: 50px;
}
.recode-svg {
  width: 20px;
  height: 20px;
}
.name {
  padding-left: 10px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text {
  padding-top: 16px;
  font-size: 14px;
  color: #999999;
}
.text-207BFF {
  color: #207bff;
}
.text-8AD416 {
  color: #8ad416;
}

.null-text {
  padding-bottom: 20px;
  text-align: center;
}
</style>
