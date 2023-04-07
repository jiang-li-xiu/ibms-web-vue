<!--
 * @Author: MJ
 * @Date: 2021-09-17 09:01:12
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-07 09:22:31
 * @Description: 
-->
<template>
  <div>
    <el-row class="playlist-management-card">
      <el-col>
        <el-form>
          <el-form-item>
            <div class="assembly-table-title">
              {{ title }}
            </div>
          </el-form-item>
        </el-form>
      </el-col>
      <div style="padding: 0 16px 16px 16px">
        <el-col>
          <el-form
            ref="queryForm"
            :model="queryParams"
            :rules="queryFormRules"
            :inline="true"
          >
            <el-form-item label="歌曲名字：" prop="songName">
              <el-input
                v-model="queryParams.songName"
                placeholder="请输入歌曲名字"
                clearable
                @keyup.enter.native="handleQuery"
              ></el-input>
            </el-form-item>
            <el-form-item label-width="100px">
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="handleQuery"
                >查询</el-button
              >
              <el-button icon="el-icon-refresh" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col>
          <el-form :inline="true">
            <!-- <el-form-item>
              <el-button
                icon="el-icon-upload"
                type="primary"
                :disabled="isShow"
                @click="uploads"
                >上传</el-button
              >
            </el-form-item> -->
            <!-- <el-form-item>
              <el-button
                icon="el-icon-delete"
                type="danger"
                @click.stop="deleteSong(2)"
                >批量删除</el-button
              >
            </el-form-item> -->
          </el-form>
        </el-col>
        <el-col>
          <el-form>
            <el-form-item>
              <el-table
                :height="tableHeight"
                v-loading="loading"
                :data="tableList"
                border
                @selection-change="handleSelectionChange"
              >
                <!-- <el-table-column
                  align="center"
                  type="selection"
                ></el-table-column> -->
                <el-table-column
                  align="center"
                  label="歌曲名字"
                  prop="songName"
                ></el-table-column>
                <!-- <el-table-column align="center" label="操作">
                  <el-button type="danger" @click.stop="deleteSong(1)"
                    >删除</el-button
                  >
                </el-table-column> -->
              </el-table>
              <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                :page-sizes="[10, 15, 20, 30]"
                @pagination="getList"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
import bus from "@/utils/bus.js";

import {
  getSongSheet,
  getSongSheetTable,
} from "@/api/subsystem/public-broadcasting/index";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  name:"SongsTable",
  mixins: [TableListMixin],
  data() {
    return {
      title: "",
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        id: "",
        songName: "",
      },
      // 检索验证
      queryFormRules: {
        // songName: [
        //   { validator: this.validateQueryFormRules, trigger: "change" },
        // ],
      },
      // 表格高度
      tableHeight: 0,
      isShow: false,
      interface: {
        getTableList: getSongSheetTable,
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight());

    // 获取 歌单列表
    this.getSongSheets();
  },
  mounted() {
    // 兄弟组件传值
    // 获取树形组件回传的数据、子组件互相传值
    bus.$on("busMethod", (data) => {
      if (data) {
        this.queryParams.id = data.id;
        this.title = data.dirName;

        this.getList();
      }
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight());
  },
  beforeDestroy() {
    bus.$off("busMethod"); // 组件销毁时关闭监听
  },

  methods: {
    // 获取 歌单列表
    getSongSheets() {
      getSongSheet().then((response) => {
        this.queryParams.id = response.data[0].id;
        this.title = response.data[0].dirName;

        this.getList();
      });
    },

    // 获取 table 表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 390;
    },

    // 删除
    deleteSong(parameter) {
      if (parameter == 1) {
        console.log("单条删除");
      } else {
        console.log("批量删除");
      }
      this.$message({
        message: "暂不支持该操作",
        type: "warning",
      });
    },

    // 上传
    uploads() {
      this.$message({
        message: "暂不支持该操作",
        type: "warning",
      });
    },

  },
};
</script>

<style lang="scss" scoped>
.playlist-management-card {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  box-sizing: border-box;
}

.assembly-table-title {
  letter-spacing: 2px;
  font-weight: 600;
  padding: 10px;
  font-size: 18px;
  border-bottom: 1px solid #d6d6d6;
}

.delete-btn {
  cursor: pointer;
  color: #ff0000;
}
</style>
