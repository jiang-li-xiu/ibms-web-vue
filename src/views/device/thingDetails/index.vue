<!--
 * @Author: MJ
 * @Date: 2021-08-09 09:18:05
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-07 14:36:13
 * @Description: 
-->
<template>
  <div>
    <thing-details-head :inforDetails="inforDetails" @trigger="triggers">
    </thing-details-head>

    <thing-details :detailsId="detailsId"></thing-details>
  </div>
</template>

<script>
import { getDeviceDevicetype } from "@/api/device/deviceClasses";

import ThingDetailsHead from "@/components/ThingDetailsHead";
import ThingDetails from "@/components/ThingDetails";

export default {
  name: "thisngDetails",
  components: {
    ThingDetailsHead,
    ThingDetails,
  },
  data() {
    return {
      // 详情数据
      inforDetails: {},
      // detailsId
      detailsId: null,
      // 页面传过来的 id
      detailsId: null,
    };
  },

  created() {
    this.detailsId = this.$route.params.detailsId;
    if (this.detailsId == undefined) {
      this.detailsId = Number(localStorage.getItem("detailsId"));
    } else {
      localStorage.setItem("detailsId", this.detailsId);
    }
    this.getDeviceDevicetypes(this.detailsId);
  },

  methods: {
    // 设备详情
    getDeviceDevicetypes(id) {
      getDeviceDevicetype(id).then((response) => {
        this.inforDetails = response.data;
      });
    },

    // 列表子组件给父组件传值
    triggers({ type, id }) {
      console.log(type, id);
      // if (type == "delete") {
      //   this.getList();
      // } else if (type == "details") {
      //   this.detailsId = id;
      //   this.getDeviceDevicetypes(id);
      //   // this.isListDetails = !this.isListDetails;
      //   this.$router.push({
      //     name: "ThisngDetails",
      //     // params: { deviceData: data },
      //   });
      // } else if (type == "back") {
      //   this.isListDetails = !this.isListDetails;
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
