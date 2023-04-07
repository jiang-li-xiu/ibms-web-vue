<!--
 * @Author: MJ
 * @Date: 2021-07-20 11:52:11
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-07 14:38:04
 * @Description: 
-->
<template>
  <div class="container_box">
    <div class="row_one">
      <!-- <div class="breadcrumb_box">
        <span class="breadcrumb_item" v-for="(item, i) in title" :key="item">
          {{ item }}
          <span v-if="i != title.length - 1">/</span>
        </span>
      </div> -->
      <!-- <div class="back" @click="back">返回</div> -->
    </div>

    <div class="type_status_box margin_top">
      <div class="type_item">设备类型：{{ inforDetails.deviceTypeName }}</div>

      <div class="status_item">
        <span
          :style="{
            backgroundColor: inforDetails.isStatus == 0 ? '#00ff00' : '#ff0000',
          }"
        ></span>
        <span>{{ inforDetails.isStatus == 0 ? "已启用" : "已停用" }}</span>
        <span
          @click="putStatus(inforDetails)"
          v-text="inforDetails.isStatus == 0 ? '停用' : '启用'"
        ></span>
      </div>

      <!-- <div class="back" style="margin-left: 30px" @click="back">返回</div> -->
    </div>

    <div class="count_box margin_top">
      <span>设备数量：{{ inforDetails.deviceCount }}</span>
      <span class="see margin_left_1" @click="sees">查看</span>
    </div>
  </div>
</template>

<script>
import { statusUpdate } from "@/api/device/deviceClasses";

export default {
  name: "",
  props: {
    inforDetails: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      title: ["设备管理中心", "设备类型管理", "查看设备类型详情"],
    };
  },

  methods: {
    // 查看
    sees() {
      this.$router.push({
        name: "ThingSees",
        params: { deviceTypeId: this.inforDetails.deviceTypeId },
      });
    },

    // 修改状态
    putStatus(data) {
      let { deviceTypeId, isStatus } = data;
      statusUpdate({ deviceTypeId, isStatus: isStatus == 0 ? 1 : 0 }).then(
        (response) => {
          if (response.code == 200) {
            this.$emit("trigger", {
              type: "delete",
              id: null,
            });
            this.inforDetails.isStatus =
              this.inforDetails.isStatus == 0 ? 1 : 0;
            this.msgSuccess("修改成功");
          }
        }
      );
    },

    back() {
      this.$emit("trigger", {
        type: "back",
        id: null,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.margin_left_1 {
  margin-left: 1vw;
}

.margin_top {
  margin-top: 20px;
}

.container_box {
  background-color: #fff;
  padding: 10px 30px 16px 30px;
  box-sizing: border-box;
  box-shadow: 0 0 5px #888888;
}

.row_one {
  display: flex;
  /* justify-content: space-between; */
  justify-content: flex-end;
  align-content: center;
}

.breadcrumb_box {
  color: #555;
}

.breadcrumb_item:last-child {
  color: #000;
}

.back {
  cursor: pointer;
  font-weight: 600;
}

.type_status_box {
  display: flex;
  align-items: center;
}

.type_item {
  font-size: 30px;
  font-weight: 600;
}

.status_item {
  margin-left: 1vw;
}

.status_item > span:first-child {
  width: 10px;
  height: 10px;
  display: inline-block;
  border-radius: 50%;
}

.status_item > span:nth-child(2) {
  font-size: 18px;
  font-weight: 600;
  margin-left: 6px;
}

.status_item > span:last-child {
  color: #0000ff;
  cursor: pointer;
  margin-left: 10px;
}

.see {
  color: #0000ff;
  cursor: pointer;
}
</style>
