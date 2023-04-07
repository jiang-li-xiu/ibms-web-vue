<!--
 * @Author: MJ
 * @Date: 2021-09-16 11:24:52
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-25 15:23:05
 * @Description: 
-->
<template>
  <div class="song-sheetList-box">
    <!-- 顶部标题 -->
    <div class="song-sheetList-title">
      {{ title }}
    </div>

    <!-- 检索 -->
    <div class="retrieval-box">
      <el-select
        class="el-select-box"
        v-model="songId"
        clearable
        placeholder="请选择歌单分类"
        @change="clickValue($event)"
      >
        <el-option
          v-for="item in directory"
          :key="item.id"
          :label="item.dirName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>

    <!-- 歌单列表 -->
    <div class="song-sheet-box">
      <div class="table-box">
        <el-table
          :data="songs"
          border
          :height="600"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column
            align="center"
            label="歌曲名称"
            prop="songName"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import publicAddressSettings from "@/utils/publicAddressSettings.js";

import {
  getDirectory,
  getSongsId,
} from "@/api/subsystem/public-broadcasting/index";

export default {
  props: {
    title: {
      type: String,
      default: () => {
        return "顶部标题";
      },
    },
  },
  data() {
    return {
      // 全部歌单
      directory: [],
      // 根据歌单id获取歌曲
      songId: null,
      songs: [],
      // 单选
      radioVal: null,
    };
  },
  mounted() {
    this.getDirectorys();
    this.getSongsIds();
  },

  methods: {
    // 根据歌单ID获取歌曲
    getSongsIds() {
      getSongsId({ id: this.songId }).then((response) => {
        this.songs = response.data;
      });
    },

    // 获取全部歌单
    getDirectorys() {
      getDirectory({ directoryName: null }).then((response) => {
        this.directory = response.data;
      });
    },

    // 检索选中值
    clickValue(val) {
      this.songId = val;
      this.getSongsIds();
    },

    // 单选
    handleCurrentChange(e) {
      this.radioVal = e.id;
      publicAddressSettings.$emit("songId", this.radioVal);
    },
  },
};
</script>

<style lang="scss" scoped>
.song-sheetList-box {
  min-height: calc(100vh - 334px);
  background: #fff;
  margin-top: 20px;

  // 顶部标题
  .song-sheetList-title {
    background-color: #434348;
    text-align: center;
    color: #fff;
    height: 5vh;
    line-height: 5vh;
  }

  // 检索
  .retrieval-box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-select-box {
      width: 90%;
    }
  }

  // 歌单列表
  .song-sheet-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

    .table-box {
      width: 90%;
    }
  }
}

.playback-management {
  cursor: pointer;
  color: #0527af;
}
</style>
