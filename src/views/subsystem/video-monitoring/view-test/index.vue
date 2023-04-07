<!--
 * @Author: MJ
 * @Date: 2021-10-11 10:24:50
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-31 10:07:54
 * @Description: 
-->
<template>
  <div class="access-control-record-box">
    <el-row :gutter="20">
      <!-- 左侧 -->
      <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="8" ref="left">
        <div class="video-monitor-system-card">
          <!-- 用户视图 -->
          <div>
            <div class="view-add-box">
              <span>用户视图</span>

              <el-button
                type="primary"
                class="el-icon-plus"
                @click.stop="newAddFolder"
              >
                新增
              </el-button>
            </div>

            <div class="video-name-box">
              <el-input
                v-model="queryView.viewName"
                placeholder="请输入视图名称"
                clearable
                size="small"
                @input="inputSearchView"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click.stop="getVideoViewLists"
                ></el-button>
              </el-input>
            </div>

            <div
              v-for="(item, i) in videoViewList"
              :key="item.id"
              @dragenter="dragenter(item, i)"
              @dragend="dragend()"
            >
              <div
                class="view_name_box"
                @click.stop="openFolder(i)"
                @contextmenu.prevent="rightClick(i)"
                @mouseover.stop="mouseOver(i)"
                @mouseleave.stop="mouseLeave"
              >
                <div style="font-weight: 700; cursor: pointer">
                  <span v-if="item.isFolder">▲</span>
                  <span v-else>▼</span>
                  <span :title="item.viewName">{{ item.viewName }}</span>
                </div>

                <div v-show="isBtn && isBtnIndex == i">
                  <span class="edit-view" @click.stop="rightClick(i)"
                    >编辑</span
                  >
                  <span class="delete-view" @click.stop="deleteView(item.id)"
                    >删除</span
                  >
                </div>
              </div>

              <div v-show="item.isFolder">
                <div
                  class="is-folder"
                  v-for="items in item.viewInfos"
                  :key="items.id"
                  @click.stop="viewPlaySingle(items)"
                >
                  <div>
                    <span style="margin-left: 23px">{{ items.viewName }}</span>
                    <el-popconfirm
                      @confirm="deletePointPosition(items.id)"
                      title="此操作将永久删除该文件, 是否继续?"
                    >
                      <span class="delete-video" slot="reference">×</span>
                    </el-popconfirm>
                  </div>

                  <div v-if="item.deviceCode != 'null'">
                    <svg
                      t="1628576508832"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2962"
                      width="24"
                      height="24"
                    >
                      <path
                        d="M682.666667 426.666667l139.797333-69.888a21.333333 21.333333 0 0 1 30.869333 19.072v272.298666a21.333333 21.333333 0 0 1-30.869333 19.072L682.666667 597.333333v85.333334a85.333333 85.333333 0 0 1-85.333334 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333V341.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h341.333333a85.333333 85.333333 0 0 1 85.333334 85.333333v85.333334z m-138.901334 98.453333a21.333333 21.333333 0 0 0 0-37.376l-147.733333-81.258667a21.333333 21.333333 0 0 0-31.616 18.709334v162.496a21.333333 21.333333 0 0 0 31.616 18.688l147.733333-81.258667z"
                        fill="#068d58"
                        p-id="2963"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 监控点列表 -->
          <div style="margin-top: 27px">
            <div style="margin-bottom: 10px">监控点列表</div>

            <!-- 树形 -->
            <div>
              <el-input placeholder="输入关键字进行过滤" v-model="filterText" />

              <div class="tree-box">
                <el-tree
                  :data="videoDeviceTreeData"
                  :props="videoDeviceTreeProps"
                  node-key="id"
                  @node-click="handlePlay"
                  :filter-node-method="filterNode"
                  :default-expanded-keys="treeArr"
                  accordion
                  ref="tree"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span
                      draggable="true"
                      @dragstart="dragstart(data)"
                      @dragenter="dragenter(data)"
                      @dragend="dragend()"
                    >
                      {{ node.label }}
                    </span>

                    <div v-if="data.type == 1">
                      <svg
                        t="1628576508832"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2962"
                        width="24"
                        height="24"
                      >
                        <path
                          d="M682.666667 426.666667l139.797333-69.888a21.333333 21.333333 0 0 1 30.869333 19.072v272.298666a21.333333 21.333333 0 0 1-30.869333 19.072L682.666667 597.333333v85.333334a85.333333 85.333333 0 0 1-85.333334 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333V341.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h341.333333a85.333333 85.333333 0 0 1 85.333334 85.333333v85.333334z m-138.901334 98.453333a21.333333 21.333333 0 0 0 0-37.376l-147.733333-81.258667a21.333333 21.333333 0 0 0-31.616 18.709334v162.496a21.333333 21.333333 0 0 0 31.616 18.688l147.733333-81.258667z"
                          fill="#068d58"
                          p-id="2963"
                        ></path>
                      </svg>
                    </div>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧 -->
      <el-col :xl="20" :lg="18" :md="18" :sm="16" :xs="16" ref="right">
        <div class="view-test-right-box">
          <!-- 选择屏幕按钮 -->
          <div class="btn-select-type">
            <el-button @click="selectType(0)" type="primary">单屏</el-button>
            <el-button @click="selectType(1)" type="primary">四分屏</el-button>
            <el-button @click="selectType(2)" type="primary">九分屏</el-button>
            <el-button @click="selectType(3)" type="primary"
              >十六分屏</el-button
            >
          </div>

          <!-- 屏幕 -->
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              position: fixed;
              bottom: 0px;
              top: 180px;
              width: 70%;
              margin-top: 1em;
              margin-left: 20px;
            "
          >
            <!-- 1*1 -->
            <div
              style="width: 100%; height: 100%; margin-left: 10px"
              v-if="selected == 0"
            >
              <el-row
                :gutter="10"
                type="flex"
                style="min-height: 90%"
                justify="center"
              >
                <el-col :span="24">
                  <div
                    @click="clickVideo(0)"
                    :class="videoIndex == 0 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 0)"
                      ref="video0"
                    ></cus-player>
                  </div>
                </el-col>
              </el-row>
            </div>

            <!-- 2*2 -->
            <div
              style="width: 100%; height: 100%; margin-left: 10px"
              v-else-if="selected == 1"
            >
              <el-row
                :gutter="1"
                type="flex"
                style="height: 45%"
                justify="center"
              >
                <el-col :span="12">
                  <div
                    @click="clickVideo(0)"
                    :class="videoIndex == 0 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 0)"
                      ref="video0"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div
                    @click="clickVideo(1)"
                    :class="videoIndex == 1 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 1)"
                      ref="video1"
                    ></cus-player>
                  </div>
                </el-col>
              </el-row>

              <el-row
                :gutter="1"
                type="flex"
                style="height: 45%"
                justify="center"
              >
                <el-col :span="12">
                  <div
                    @click="clickVideo(2)"
                    :class="videoIndex == 2 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 2)"
                      ref="video2"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div
                    @click="clickVideo(3)"
                    :class="videoIndex == 3 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 3)"
                      ref="video3"
                    ></cus-player>
                  </div>
                </el-col>
              </el-row>
            </div>

            <!-- 3*3 -->
            <div
              style="height: 100%; width: 100%; margin-left: 10px"
              v-else-if="selected == 2"
            >
              <el-row
                :gutter="1"
                type="flex"
                style="height: 30%"
                justify="center"
              >
                <el-col :span="8">
                  <div
                    @click="clickVideo(0)"
                    :class="videoIndex == 0 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 0)"
                      ref="video0"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div
                    @click="clickVideo(1)"
                    :class="videoIndex == 1 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 1)"
                      ref="video1"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div
                    @click="clickVideo(2)"
                    :class="videoIndex == 2 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 2)"
                      ref="video2"
                    ></cus-player>
                  </div>
                </el-col>
              </el-row>

              <el-row
                :gutter="1"
                type="flex"
                style="height: 30%"
                justify="center"
              >
                <el-col :span="8">
                  <div
                    @click="clickVideo(3)"
                    :class="videoIndex == 3 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 3)"
                      ref="video3"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div
                    @click="clickVideo(4)"
                    :class="videoIndex == 4 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 4)"
                      ref="video4"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div
                    @click="clickVideo(5)"
                    :class="videoIndex == 5 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 5)"
                      ref="video5"
                    ></cus-player>
                  </div>
                </el-col>
              </el-row>

              <el-row
                :gutter="1"
                type="flex"
                style="height: 30%"
                justify="center"
              >
                <el-col :span="8">
                  <div
                    @click="clickVideo(6)"
                    :class="videoIndex == 6 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 6)"
                      ref="video6"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div
                    @click="clickVideo(7)"
                    :class="videoIndex == 7 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 7)"
                      ref="video7"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div
                    @click="clickVideo(8)"
                    :class="videoIndex == 8 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 8)"
                      ref="video8"
                    ></cus-player>
                  </div>
                </el-col>
              </el-row>
            </div>

            <!-- 4*4 -->
            <div
              style="height: 100%; width: 100%; margin-left: 10px"
              v-else-if="selected == 3"
            >
              <el-row
                :gutter="1"
                type="flex"
                style="height: 22.5%"
                justify="center"
              >
                <el-col :span="6">
                  <div
                    @click="clickVideo(0)"
                    :class="videoIndex == 0 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 0)"
                      ref="video0"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    @click="clickVideo(1)"
                    :class="videoIndex == 1 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 1)"
                      ref="video1"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    @click="clickVideo(2)"
                    :class="videoIndex == 2 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 2)"
                      ref="video2"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    @click="clickVideo(3)"
                    :class="videoIndex == 3 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 3)"
                      ref="video3"
                    ></cus-player>
                  </div>
                </el-col>
              </el-row>

              <el-row
                :gutter="1"
                type="flex"
                style="height: 22.5%"
                justify="center"
              >
                <el-col :span="6">
                  <div
                    @click="clickVideo(4)"
                    :class="videoIndex == 4 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 4)"
                      ref="video4"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    @click="clickVideo(5)"
                    :class="videoIndex == 5 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 5)"
                      ref="video5"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    @click="clickVideo(6)"
                    :class="videoIndex == 6 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 6)"
                      ref="video6"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    @click="clickVideo(7)"
                    :class="videoIndex == 7 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 7)"
                      ref="video7"
                    ></cus-player>
                  </div>
                </el-col>
              </el-row>

              <el-row
                :gutter="1"
                type="flex"
                style="height: 22.5%"
                justify="center"
              >
                <el-col :span="6">
                  <div
                    @click="clickVideo(8)"
                    :class="videoIndex == 8 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 8)"
                      ref="video8"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    @click="clickVideo(9)"
                    :class="videoIndex == 9 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 9)"
                      ref="video9"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    @click="clickVideo(10)"
                    :class="videoIndex == 10 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 10)"
                      ref="video10"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    @click="clickVideo(11)"
                    :class="videoIndex == 11 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 11)"
                      ref="video11"
                    ></cus-player>
                  </div>
                </el-col>
              </el-row>

              <el-row
                :gutter="1"
                type="flex"
                style="height: 22.5%"
                justify="center"
              >
                <el-col :span="6">
                  <div
                    @click="clickVideo(12)"
                    :class="videoIndex == 12 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 12)"
                      ref="video12"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    @click="clickVideo(13)"
                    :class="videoIndex == 13 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 13)"
                      ref="video13"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    @click="clickVideo(14)"
                    :class="videoIndex == 14 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 14)"
                      ref="video14"
                    ></cus-player>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    @click="clickVideo(15)"
                    :class="videoIndex == 15 ? 'selectVideo' : 'video'"
                  >
                    <cus-player
                      @clickPlayer="clickPlayer($event, 15)"
                      ref="video15"
                    ></cus-player>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 新增视图 面板 -->
    <el-dialog
      :title="viewTitle"
      :visible.sync="isView"
      width="30%"
      @close="closes"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="视图名称" prop="viewName">
          <el-input v-model="ruleForm.viewName"></el-input>
        </el-form-item>

        <el-form-item style="text-align: right">
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import "xgplayer";
import FlvJsPlayer from "xgplayer-flv.js";
import CusPlayer from "./CusPlayer";

import {
  listVideoDevice,
  getStreamUrlByDeviceId,
  putVideoView,
  postVideoView,
  getVideoViewList,
  postVideoViewAddCamera,
  deleteVideoViewDeleteCamera,
  deleteVideoViewDelete,
} from "@/api/subsystem/video-monitoring/videomonitor";

export default {
  components: {
    CusPlayer,
  },
  data() {
    return {
      selected: 1, // 表格类型
      videoIndex: 0, // 表格索引
      tableData: [], // 列表
      selectValue: "", // 当前选择的相机
      playUrl: "", // 播放的url

      // ------------------------------------------左侧（start）------------------------------------------
      queryView: {
        id: "",
        viewName: "",
      },
      videoViewList: [],
      queryParams: {},
      videoDeviceTreeData: [], // 视频设备树
      videoDeviceTreeProps: {
        children: "children",
        label: "label",
      },
      viewTitle: "新增视图",
      isView: false,
      ruleForm: {
        id: null,
        viewName: "",
      },
      rules: {
        viewName: [
          { required: true, message: "请输入视图名称", trigger: "blur" },
        ],
      },
      isBtn: false,
      isBtnIndex: null,
      isFolder: false,
      filterText: "", // 树形搜索
      treeArr: [],
      // ------------------------------------------左侧（end）------------------------------------------
    };
  },
  mounted() {
    this.getVideoViewLists();
    this.listVideoDevices();
  },
  watch: {
    // 树形搜索
    filterText(val) {
      if (!val) {
        this.treeArr = null;
      }
      this.$refs.tree.filter(val);
    },
  },

  methods: {
    // ------------------------------------------左侧（start）------------------------------------------
    // 树形搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    // 用户视图 请求 播放 数据（单个）
    viewPlaySingle(item) {
      getStreamUrlByDeviceId({ deviceCode: item.deviceCode }).then((res) => {
        this.playUrl = res.data.uri;
        console.log(res);

        if (this.playUrl) {
          let ref = "video" + this.videoIndex;
          this.$refs[ref].createPlayer(
            item.deviceCode,
            this.playUrl,
            true,
            this.videoIndex
          );
        } else {
          this.$message.error("地址流不能为空");
        }
      });
    },

    // 删除视图
    deleteView(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteVideoViewDelete(id).then(() => {
            this.getVideoViewLists();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 文件夹右键（编辑）
    rightClick(i) {
      this.viewTitle = "编辑视图";
      this.ruleForm = {
        id: this.videoViewList[i].id,
        viewName: this.videoViewList[i].viewName,
      };
      this.isView = !this.isView;
    },

    // 删除点位信息
    deletePointPosition(id) {
      // this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      //   .then(() => {
      deleteVideoViewDeleteCamera(id)
        .then(() => {
          this.getVideoViewLists();
          this.$message.success("删除成功");
        })
        // })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 用户视图 展开和关闭文件夹
    openFolder(i) {
      this.indexView = i;
      let videoViewList = this.videoViewList;
      for (let is = 0; is < videoViewList.length; is++) {
        if (i == is && !videoViewList[i].isFolder) {
          videoViewList[is].isFolder = true;
        } else {
          videoViewList[is].isFolder = false;
        }
      }
    },

    // 最终操作
    dragend() {
      if (!this.oldItem.deviceCode)
        return this.$message.warning("不能添加文件夹");
      if (
        this.oldItem.deviceCode != this.newItem.deviceCode &&
        this.videoViewListId.includes(this.newItem.id) &&
        this.newItem.id
      ) {
        this.addFile = {
          viewId: this.newItem.id,
          deviceCode: this.oldItem.deviceCode,
          videoName: this.oldItem.label,
        };
        let videoViewList = this.videoViewList;

        postVideoViewAddCamera(this.addFile).then(() => {
          this.getVideoViewLists();
          this.$message.success("添加成功");
          for (let is = 0; is < videoViewList.length; is++) {
            if (
              this.newItem.i == is &&
              !videoViewList[this.newItem.i].isFolder
            ) {
              videoViewList[this.newItem.i].isFolder = true;
            } else {
              videoViewList[is].isFolder = false;
            }
          }
        });
      }
    },

    // 初始信息
    dragstart(node) {
      this.oldItem = node;
    },

    // 过程信息
    dragenter(node, i) {
      node.i = i;
      this.newItem = node;
    },

    // 移出
    mouseLeave() {
      this.isBtnIndex = null;
      this.isBtn = false;
    },

    // 移入
    mouseOver(i) {
      console.log(i);
      this.isBtnIndex = i;
      this.isBtn = true;
    },

    // 获取视图数据
    getVideoViewLists() {
      getVideoViewList(this.queryView).then((response) => {
        let videoViewListId = [];
        this.videoViewList = response.data.map((item) => {
          item.isFolder = false;
          videoViewListId.push(item.id);
          return item;
        });
        console.log("this.videoViewList", this.videoViewList);
        this.videoViewListId = videoViewListId;

        this.$nextTick(() => {
          if (this.newItem) {
            this.videoViewList[this.newItem.i].isFolder = true;
            return false;
          } else if (this.indexView) {
            this.videoViewList[this.indexView].isFolder = true;
            return false;
          }
        });
      });
    },

    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            putVideoView(this.ruleForm).then(() => {
              this.getVideoViewLists();
              this.$message.success("编辑成功");
              this.isView = !this.isView;
            });
          } else {
            postVideoView(this.ruleForm).then(() => {
              this.getVideoViewLists();
              this.$message.success("添加成功");
              this.isView = !this.isView;
            });
          }
        } else {
          return false;
        }
      });
    },

    // 关闭 新增视图 面板
    closes() {
      this.ruleForm = {
        id: "",
        viewName: "",
      };
    },

    // 新增视图
    newAddFolder() {
      this.viewTitle = "新增视图";
      this.isView = !this.isView;
    },

    // 监控点列表
    listVideoDevices() {
      listVideoDevice().then((res) => {
        console.log("监控点列表:", res);
        this.videoDeviceTreeData = res.data;
      });
    },

    // 搜索
    inputSearchView(val) {
      if (!val) this.getVideoViewLists();
    },
    // ------------------------------------------左侧（end）------------------------------------------

    // 分屏切换
    selectType(selected) {
      this.selected = selected;
    },

    // 选中样式
    clickVideo(index) {
      this.videoIndex = index;
    },

    // 树形点击播放
    handlePlay(data) {
      if (data.type == 1) {
        getStreamUrlByDeviceId({ deviceCode: data.deviceCode }).then((res) => {
          this.playUrl = res.data.uri;

          if (this.playUrl) {
            let ref = "video" + this.videoIndex;
            this.$refs[ref].createPlayer(
              data.deviceCode,
              this.playUrl,
              true,
              this.videoIndex
            );
          } else {
            this.$message.error("地址流不能为空");
          }
        });
      }
    },

    // 点击视图播放
    clickPlayer(e, index) {
      console.log("clickPlayer:", e, index);
      this.videoIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.access-control-record-box {
  padding: 20px;
  background-color: #eee;
}

.selectVideo {
  border: solid 2px red;
  height: 100%;
  width: 100%;
  position: relative;
}
.video {
  border: solid 1px #55557f;
  height: 100%;
  width: 100%;
  position: relative;
}

.video-monitor-system-card {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  padding: 20px;
}

.view-test-right-box {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}

.overflow_y_scroll {
  overflow-y: scroll;
}

.overflow_y_scroll_0::-webkit-scrollbar {
  width: 0 !important;
}

.view_name_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  background-color: #aaa;
}
.monitor-title {
  display: flex;
  justify-items: flex-end;
}

.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  // min-height: 36px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node {
  div {
    margin-top: 10px;
  }
}

.view-add-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-name-box {
  margin-top: 5px;
  margin-bottom: 10px;
}

.el-form--inline .el-form-item {
  margin-right: 0;
}

.ellipsis {
  /* 超出隐藏 */
  overflow: hidden;
  /* 不换行 */
  white-space: nowrap;
  /* 使用省略号 */
  text-overflow: ellipsis;
}

.btn-select-type {
  display: flex;
  justify-content: flex-end;
  margin: 10px;
  width: 89.45%;
}

.tree-box {
  height: 27em;
  overflow-y: scroll;
}

.tree-box::-webkit-scrollbar {
  width: 0 !important;
}

.edit-view {
  font-size: 14px;
  color: #1890ff;
  cursor: pointer;
  padding: 3px;
  margin-left: 6px;
  margin-right: 6px;
}

.delete-view {
  font-size: 14px;
  color: #ff0000;
  cursor: pointer;
  padding: 3px;
}

.is-folder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.delete-video {
  margin-left: 16px;
  color: #ff0000;
  font-weight: 600;
  padding: 2px;
  cursor: pointer;
}
</style>
