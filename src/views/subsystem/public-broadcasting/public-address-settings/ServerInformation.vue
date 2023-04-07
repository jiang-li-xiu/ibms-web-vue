<!--
 * @Author: MJ
 * @Date: 2021-09-16 09:40:35
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-25 15:22:13
 * @Description: 
-->
<template>
  <div>
    <div class="public-address-settings-box">
      <el-row>
        <el-col>
          <el-form>
            <el-form-item>
              <div style="border-bottom: 1px solid #bbb; padding-left: 10px">
                公共广播服务器信息
              </div>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col>
          <el-form>
            <el-form-item>
              <div class="table">
                <div class="table-box">
                  <el-table :data="tableData" border>
                    <el-table-column
                      align="center"
                      label="服务器"
                      prop="systemStatus"
                    ></el-table-column>
                    <el-table-column align="center" label="设备在线/离线数">
                      <template slot-scope="scope">
                        <span>{{ scope.row.onLine }}/{{ scope.row.offLine }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getSystemStateAndDeviceStatusCount } from "@/api/subsystem/public-broadcasting/index";

export default {
  props: {},
  data() {
    return {
      tableData: [
        {
          id: 1,
          systemStatus: "离线",
          onLine: 0,
          offLine: 0,
        },
      ],
    };
  },
  mounted() {
    this.getSystemStateAndDeviceStatusCounts();
  },

  methods: {
    // 获取 公共广播服务器信息
    getSystemStateAndDeviceStatusCounts() {
      getSystemStateAndDeviceStatusCount().then((response) => {
        let data = response.data;
        data.systemStatus = data.systemStatus == 0 ? "上线" : "下线";
        this.tableData = [response.data];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.public-address-settings-box {
  background-color: #fff;
  height: 190px;
}

.table {
  display: flex;
  justify-content: center;
  align-items: center;

  .table-box {
    width: 95%;
    text-align: center;
  }
}
</style>
