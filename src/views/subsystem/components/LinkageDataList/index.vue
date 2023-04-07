<template>
  <div>
    <div
      class="card_main margin_top_1"
      v-for="item in linkageList"
      :key="item.id"
    >
      <el-card>
        <el-row>
          <el-col :span="4">
            <el-image :src="tIcon" />
          </el-col>

          <el-col :span="19" style="padding-left: 8px">
            <el-row :gutter="10">
              <el-col :span="24" class="ellipsis">
                <span
                  class="title"
                  v-text="item.linkName"
                  :title="item.linkName"
                ></span>
              </el-col>
            </el-row>

            <!-- <el-row :gutter="10" class="sm-title">
              <el-col :span="24"
                ><span style="color: #aaa">{{ item.linkCode }}</span></el-col
              >
            </el-row> -->
          </el-col>
        </el-row>

        <el-row :gutter="10" class="margin_top_1 ellipsis">
          <span>触发方式 </span>
          <span
            class="margin_left_10"
            v-text="item.triggerModeText"
            :title="item.triggerMode"
          ></span>
        </el-row>

        <el-row :gutter="10" class="margin_top_1">
          <span>场景状态</span>
          <span class="margin_left_10">
            <em
              class="icon"
              :style="{
                backgroundColor: item.status == 1 ? '#FF0000' : '#00FF00',
              }"
            ></em>
            <span v-text="item.statusText"></span>
          </span>
        </el-row>

        <el-row :gutter="10">
          <div class="icon_btn_box margin_top_1">
            <!-- 编辑 -->
            <em
              class="icon_bnt el-icon-edit-outline"
              style="color: #0000ff"
              @click="editData(item.actionId)"
            ></em>

            <em class="rotates el-icon-minus"></em>

            <!-- 联动记录 -->
            <em class="icon_bnt el-icon-tickets" @click="linkRecordOne(item)">
            </em>

            <em class="rotates el-icon-minus"></em>

            <!-- 引用第三方库字体图标（阿里巴巴矢量图标库） -->
            <em
              class="icon_bnt iconfont icon-disable"
              style="color: #ff0000; font-size: 23px"
              v-if="item.status == 0"
              @click.stop="changeState(item)"
            ></em>

            <em
              class="icon_bnt el-icon-circle-check"
              style="color: #00ff00"
              v-else
              @click.stop="changeState(item)"
            ></em>

            <em class="rotates el-icon-minus"></em>

            <!-- 删除 -->
            <em
              class="icon_bnt el-icon-delete"
              style="color: #ff0000"
              @click.stop="deleteData(item)"
            ></em>
          </div>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getLinkConfigSetStatus,
  deleteLinkConfig,
} from "@/api/subsystem/linkageAdministration";
// import eventBus from "../../../../utils/eventBus";

export default {
  props: {
    linkageList: {
      type: Array,
      default() {
        return [];
      },
    },
    total: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      tIcon: require("@/assets/icons/plug-in.png"),
      // 搜索的值
      searchVal: {},
    };
  },

  mounted() {
    // 从头部组件传过来的值
    // 使用了兄弟组件间传参
    // 在组件实例创建时不会调用此代码段
    // eventBus.$on("search", (val) => {
    //   this.searchVal = val;
    //   this.getDataList();
    // });
  },

  methods: {
    // 获取数据列表
    // getDataList() {
    //   console.log("获取数据列表:", this.searchVal.status);
    // },

    // 删除数据
    deleteData(data) {
      let that = this;
      that
        .$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          deleteLinkConfig(data.actionId).then((response) => {
            if (response.code == 200) {
              that.$message({
                type: "success",
                message: "删除成功!",
              });
              that.$emit("trigger", {
                type: "trigger",
                id: null,
              });
            }
          });
        });
      // .catch(() => {
      //   that.$message({
      //     type: "info",
      //     message: "已取消",
      //   });
      // });
    },

    // 改变状态
    changeState(data) {
      getLinkConfigSetStatus({
        actionId: data.actionId,
        status: data.status == 0 ? 1 : 0,
      }).then((response) => {
        if (response.code == 200) {
          this.msgSuccess("修改成功");
          this.$emit("trigger", {
            type: "trigger",
            id: null,
          });
        }
      });
    },

    // 编辑
    editData(actionId) {
      this.$emit("trigger", {
        type: "editTrigger",
        id: actionId,
      });
    },

    // 联动记录
    linkRecordOne(item) {
      this.$router.push({
        name: "LinkRecordOne",
        params: item,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.card_main {
  width: 385px;
  display: inline-block;
  margin-left: 0.5vw;
}

.title {
  font-size: 20px;
  font-weight: 1000;
}

.margin_top_1 {
  margin-top: 1vh;
}

.margin_left_10 {
  margin-left: 10px;
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.trigger_switch {
  /* display: flex; */
  /* justify-content: flex-end; */
  /* align-items: center; */
}

.icon {
  display: inline-block;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  margin-right: 0.2vw;
}

.icon_btn_box {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-top: 1px solid #ccc;
  padding: 1vh 0;
  box-sizing: border-box;
}

.icon_bnt {
  font-size: 26px;
  cursor: pointer;
}

.rotates {
  transform: rotate(90deg);
  font-size: 26px;
  font-weight: 300;
  color: #00ff00;
}
</style>
