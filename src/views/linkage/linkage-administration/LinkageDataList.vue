<template>
  <div class="linkage-data-list">
    <div class="item" v-for="item in linkageList" :key="item.id">
      <el-card class="main-card">
        <!-- 图片、标题 -->
        <div class="flex">
          <el-image class="el-image" :src="item.imgUrl ? item.imgUrl : tIcon" />
          <div class="ellipsis title" :title="item.linkName">
            {{ item.linkName }}
          </div>
        </div>
        <div class="flex justify-around">
          <div class="col">
            <div class="mt10">触发方式</div>
            <div class="mt10 font-1000">
              {{
                item.triggerMode == 1
                  ? "手动触发"
                  : item.triggerMode == 2
                  ? "定时触发"
                  : item.triggerMode == 3
                  ? "设备触发"
                  : "未知"
              }}
            </div>
          </div>

          <div class="col">
            <div class="mt10">场景状态</div>
            <div class="mt10">
              <em
                class="icon"
                :style="{
                  backgroundColor: item.status == 0 ? '#00FF00' : '#FF0000',
                }"
              ></em>
              <span class="font-1000">{{
                item.status == 0 ? "已启用" : "已停用"
              }}</span>
            </div>
          </div>
        </div>
        <!-- 底部图标栏 -->
        <div class="icon-btn-box mt10">
          <em
            class="icon-bnt el-icon-edit-outline"
            style="color: #207bff"
            @click="editData(item.actionId)"
          ></em>

          <em class="rotates el-icon-minus"></em>

          <router-link
            :to="{ name: 'LinkRecordOne', params: item }"
            class="icon-bnt el-icon-tickets"
            style="color: #8ad416"
          ></router-link>

          <em class="rotates el-icon-minus"></em>

          <!-- 引用第三方库字体图标（阿里巴巴矢量图标库） -->
          <em
            class="icon-bnt el-icon-circle-close"
            style="color: #ff0000"
            v-if="item.status == 0"
            @click.stop="changeState(item)"
          ></em>

          <em
            class="icon-bnt el-icon-circle-check"
            style="color: #8ad416"
            v-else
            @click.stop="changeState(item)"
          ></em>

          <em class="rotates el-icon-minus"></em>

          <em
            class="icon-bnt el-icon-delete"
            style="color: #ff0000"
            @click.stop="deleteData(item)"
          ></em>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getLinkConfigSetStatus,
  deleteLinkConfig,
} from "@/api/linkage/linkageAdministration";

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
  methods: {
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
  },
};
</script>

<style lang="scss" scoped>
.linkage-data-list {
  height: calc(100vh - 364px);
  overflow: auto;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin-top: 20px;
  padding-bottom: 90px;
}
.item {
  width: 25%;
  min-width: 380px;
  margin-bottom: 20px;
  padding-right: 20px;
}
.col {
  margin: 0 15px;
  text-align: center;
}
.el-image {
  width: 50px;
  height: 50px;
}
.title {
  width: 300px;
  padding-left: 8px;
  font-size: 20px;
  font-weight: 1000;
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.icon {
  display: inline-block;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  margin-right: 0.2vw;
}

.icon-btn-box {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  box-sizing: border-box;
}

.icon-bnt {
  font-size: 26px;
  cursor: pointer;
}

.rotates {
  transform: rotate(90deg);
  font-size: 26px;
  font-weight: 300;
  color: #cccccc;
}
</style>
