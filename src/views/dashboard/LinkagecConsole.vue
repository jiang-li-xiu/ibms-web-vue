<!--
 * @Author: your name
 * @Date: 2021-08-13 09:16:44
 * @LastEditTime: 2021-10-28 08:56:27
 * @LastEditors: MJ
 * @Description: In User Settings Edit
 * @FilePath: \ibms-web-vue\src\views\dashboard\LinkagecConsole.vue
-->
<template>
  <div class="conten">
    <div class="linkage_head">
      <div class="linkage_head_title">联动控制台</div>
      <div
        class="el-icon-d-arrow-right"
        @click.stop="openLinkageConfiguration"
      ></div>
    </div>

    <div class="linkage-main">
      <el-row :gutter="24" v-if="dataList.length">
        <el-col :span="6" v-for="item in dataList" :key="item.linkId">
          <div class="linkage_frame">
            <div class="linkage_info">
              <h4 :title="item.linkName">{{ item.linkName }}</h4>
              <div
                class="el-icon-switch-button"
                @click.stop="manualTrigger(item.actionId)"
              ></div>
            </div>
            <div class="linkage_info_text" v-text="item.linkCode"></div>
          </div>
        </el-col>
      </el-row>

      <div class="null-text" v-else>暂无数据</div>
    </div>
  </div>
</template>
<script>
import { getLinkConfigV1Manual } from "@/api/index";

export default {
  name: "LinkagecConsole",
  props: {
    dataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      timer: true,
      id: null,
    };
  },

  methods: {
    // 跳转到联动配置
    openLinkageConfiguration() {
      this.$router.push({
        path: `/systemFun/linkage/linkage-administration`,
      });
    },

    manualTrigger(id) {
      if (this.id != id) {
        this.timer = true;
        if (this.timer) {
          this.timer = false;
          this.id = id;
          getLinkConfigV1Manual(id).then(() => {
            this.$message.success("触发成功");
          });
          setTimeout(() => {
            this.timer = true;
          }, 1000 * 10);
          return false;
        }
        this.$nextTick(() => this.$message.error("请误频繁点击呢"));
      } else if (this.id == id) {
        if (this.timer) {
          this.timer = false;
          this.id = id;
          getLinkConfigV1Manual(id).then(() => {
            this.$message.success("触发成功");
          });
          setTimeout(() => {
            this.timer = true;
          }, 1000 * 10);
          return false;
        }
        this.$nextTick(() => this.$message.error("请误频繁点击呢"));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.conten {
  background-color: #fff;
  margin-bottom: 32px;
  padding-bottom: 25px;
}
// .el-scrollbar__wrap {
//   overflow-x: hidden;
// }
.linkage_head {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e7e7e7;
  .linkage_head_title {
    font-size: 16px;
    color: #666666;
    font-weight: 600;
  }
  .el-icon-d-arrow-right {
    cursor: pointer;
    color: #d9d9d9;
    font-size: 16px;
    font-weight: 600;
  }
}
.linkage-main::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.linkage-main {
  padding: 25px 25px 0 25px;
  height: 540px;
  // overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */

  .linkage_frame {
    margin-bottom: 24px;
    border-radius: 2px;
    box-shadow: 0px 0px 8.28px 0.72px rgba(196, 198, 200, 0.38);

    .linkage_info {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      border-bottom: 1px solid rgb(238, 238, 238);
      h4 {
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-icon-switch-button {
        width: 30px;
        height: 30px;
        cursor: pointer;
        color: #62a2ff;
        border-width: 0.22px;
        border-color: rgb(229, 229, 229);
        border-style: solid;
        border-radius: 50%;
        background-color: rgb(255, 255, 255);
        box-shadow: 0px 1px 2px 0px rgba(163, 163, 164, 0.51);
        padding: 7px;
      }
    }
    .linkage_info_text {
      padding: 19px;
      font-size: 12px;
      color: rgb(153, 153, 153);
      line-height: 30px;
    }
  }
}
.linkage_frame:hover {
  box-shadow: 0px 0px 8.28px 0.72px rgba(32, 123, 255, 0.25);
}

.null-text {
  height: 510px;
  line-height: 510px;
  text-align: center;
}
</style>
