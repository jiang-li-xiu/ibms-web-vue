<!--
 * @Author: your name
 * @Date: 2021-08-13 10:51:05
 * @LastEditTime: 2022-02-24 14:59:17
 * @LastEditors: PengXuanwei
 * @Description: In User Settings Edit
 * @FilePath: \ibms-web-vue\src\views\dashboard\LinkageRecord.vue
-->
<template>
  <div class="conten">
    <div class="record-head">
      <div class="record-head-title">联动记录</div>
      <div class="el-icon-refresh-left" @click.stop="refresh"></div>
    </div>

    <div class="record-main">
      <div class="record-title">
        <h3>联动事件</h3>
        <h3>联动时间</h3>
      </div>

      <div
        class="record-frame"
        v-infinite-scroll="infiniteScroll"
        :infinite-scroll-disabled="isInfiniteScroll"
        :infinite-scroll-distance="5"
      >
        <div v-if="dataList.length">
          <div class="record-info" v-for="item in dataList" :key="item.id">
            <div>{{ item.linkName }}</div>
            <div v-text="item.triggerTime"></div>
          </div>
        </div>

        <div class="null-text" v-else>暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLinkRecordV1List } from "@/api/index";

export default {
  name: "LinkageRecord",
  data() {
    return {
      dataList: [],
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 15,
      },
      isInfiniteScroll: false, // 控制滚动禁用
      num: 0,
    };
  },

  methods: {
    // 刷新
    refresh() {
      this.query.pageNum = 1;
      this.isInfiniteScroll = false;
      if (this.dataList.length <= 15) {
        this.dataList = [];
        this.getLinkRecordV1ListS();
      } else {
        this.dataList = [];
      }
    },

    // 滚动条触底
    infiniteScroll() {
      this.isInfiniteScroll = true;
      this.getLinkRecordV1ListS();
    },

    // 获取 联动记录 数据
    getLinkRecordV1ListS() {
      getLinkRecordV1List(this.query).then((response) => {
        let {
          data: { total, records },
        } = response;
        this.dataList = [...this.dataList, ...records];
        this.total = total;
        this.query.pageNum += 1;

        if (
          records.length < this.query.pageSize ||
          this.dataList.length == this.total
        ) {
          this.isInfiniteScroll = true;
          return false;
        }

        this.isInfiniteScroll = false;
      });
    },
  },
};
</script>

<style lang="scss">
.conten {
  background-color: #fff;
  margin-bottom: 32px;
  padding-bottom: 25px;
}
.record-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e7e7e7;
  .record-head-title {
    font-size: 16px;
    color: #666666;
    font-weight: 600;
  }
  // .el-icon-d-arrow-right {
  //   cursor: pointer;
  //   color: #d9d9d9;
  //   font-size: 16px;
  //   font-weight: 600;
  // }
  .el-icon-refresh-left {
    cursor: pointer;
    color: #d9d9d9;
    font-size: 16px;
    font-weight: 600;
    transition: 1s;
  }
  .el-icon-refresh-left:hover {
    color: #207bff;
    transform: rotate(-360deg) scale(1.3);
  }
}

.record-frame {
  height: 470px;
  overflow-y: scroll;
}

.record-frame::-webkit-scrollbar {
  width: 6px;
}
/*定义滚动条轨道*/
::-webkit-scrollbar-track {
  background-color: transparent;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  background-color: rgba(32, 123, 255, 0.25);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
.record-main {
  padding: 25px 25px 0 25px;
  .record-title {
    display: flex;
    justify-content: space-around;
    border-radius: 2px;
    background-color: rgb(236, 243, 253);
    h3 {
      margin: 14px;
      font-size: 14px;
    }
  }
  .record-info {
    font-size: 12px;
    color: rgb(102, 102, 102);
    text-align: center;
    display: flex;
    margin-top: 24px;
    font-size: 600;
    div {
      flex: 1;
    }
  }
}
.record-frame:hover {
  box-shadow: 0px 0px 8.28px 0.72px rgba(32, 123, 255, 0.25);
}

.null-text {
  line-height: 470px;
  text-align: center;
}
</style>
