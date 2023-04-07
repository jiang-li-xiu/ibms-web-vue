<!--
 * @Author: MJ
 * @Date: 2021-10-13 16:30:57
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-19 11:24:25
 * @Description: 
-->
<template>
  <div class="box">
    <el-row :gutter="20">
      <!-- 左侧数据 -->
      <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="8" ref="left">
        <div class="left_modular_box">
          <!-- 树形 -->
          <div
            class="overflow_y_scroll overflow_y_scroll_0"
            style="height: 36em"
          >
            <el-tree
              :data="videoDeviceTreeData"
              :props="videoDeviceTreeProps"
              @node-click="videoDeviceTreeNodeClick"
              accordion
            >
              <div class="custom_tree_node" slot-scope="{ node, data }">
                <div>{{ node.label }}</div>

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
              </div>
            </el-tree>
          </div>
          <!-- 优化方向 start -->
          <!-- <el-form :model="queryParams" :rules="queryFormRules" ref="queryForm">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="form.beginTime"
                type="datetime"
                style="width: 180px"
                placeholder="选择开始日期时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="startTime">
              <el-date-picker
                v-model="form.beginTime"
                type="datetime"
                style="width: 180px"
                placeholder="选择结束日期时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
              >
              </el-date-picker>
            </el-form-item>
          </el-form> -->
          <!-- 优化方向 end -->
          <el-date-picker
            v-model="dateS"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            :picker-options="pickerOptions"
            @change="changeStartTime"
            align="right"
          >
          </el-date-picker>
        </div>
      </el-col>

      <!-- 右侧数据 -->
      <el-col :xl="20" :lg="18" :md="18" :sm="16" :xs="16" ref="right">
        <div class="right_modular_box">
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

                  <div
                    class="hms_box"
                    ref="refVideo0"
                    v-if="isShowTime && videoIndex == 0 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video0', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>

            <!-- 2*2 -->
            <div
              class="overflow_y_scroll overflow_y_scroll_0"
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
                    >
                    </cus-player>
                  </div>

                  <div
                    class="hms_box"
                    ref="refVideo0"
                    v-if="isShowTime && videoIndex == 0 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video0', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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
                    >
                    </cus-player>
                  </div>

                  <div
                    class="hms_box"
                    ref="refVideo1"
                    v-if="isShowTime && videoIndex == 1 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video1', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>

              <el-row
                class="margin-tb"
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

                  <div
                    class="hms_box"
                    ref="refVideo2"
                    v-if="isShowTime && videoIndex == 2 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video2', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo3"
                    v-if="isShowTime && videoIndex == 3 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video3', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>

            <!-- 3*3 -->
            <div
              class="overflow_y_scroll overflow_y_scroll_0"
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

                  <div
                    class="hms_box"
                    ref="refVideo0"
                    v-if="isShowTime && videoIndex == 0 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video0', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo1"
                    v-if="isShowTime && videoIndex == 1 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video1', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo2"
                    v-if="isShowTime && videoIndex == 2 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video2', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>

              <el-row
                class="margin-tb"
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

                  <div
                    class="hms_box"
                    ref="refVideo3"
                    v-if="isShowTime && videoIndex == 3 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video3', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo4"
                    v-if="isShowTime && videoIndex == 4 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video4', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo5"
                    v-if="isShowTime && videoIndex == 5 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video5', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>

              <el-row
                class="margin-tb"
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

                  <div
                    class="hms_box"
                    ref="refVideo6"
                    v-if="isShowTime && videoIndex == 6 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video6', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo7"
                    v-if="isShowTime && videoIndex == 7 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video7', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo8"
                    v-if="isShowTime && videoIndex == 8 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video8', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>

            <!-- 4*4 -->
            <div
              class="overflow_y_scroll overflow_y_scroll_0"
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

                  <div
                    class="hms_box"
                    ref="refVideo0"
                    v-if="isShowTime && videoIndex == 0 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video0', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo1"
                    v-if="isShowTime && videoIndex == 1 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video1', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo2"
                    v-if="isShowTime && videoIndex == 2 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video2', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo3"
                    v-if="isShowTime && videoIndex == 3 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video3', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>

              <el-row
                class="margin-tb"
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
                  <div
                    class="hms_box"
                    ref="refVideo4"
                    v-if="isShowTime && videoIndex == 4 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video4', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo5"
                    v-if="isShowTime && videoIndex == 5 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video5', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo6"
                    v-if="isShowTime && videoIndex == 6 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video6', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo7"
                    v-if="isShowTime && videoIndex == 7 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video7', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>

              <el-row
                class="margin-tb"
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

                  <div
                    class="hms_box"
                    ref="refVideo8"
                    v-if="isShowTime && videoIndex == 8 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video8', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo9"
                    v-if="isShowTime && videoIndex == 9 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video9', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo10"
                    v-if="isShowTime && videoIndex == 10 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video10', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo11"
                    v-if="isShowTime && videoIndex == 11 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video11', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>

              <el-row
                class="margin-tb"
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

                  <div
                    class="hms_box"
                    ref="refVideo12"
                    v-if="isShowTime && videoIndex == 12 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video12', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo13"
                    v-if="isShowTime && videoIndex == 13 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video13', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo14"
                    v-if="isShowTime && videoIndex == 14 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video14', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
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

                  <div
                    class="hms_box"
                    ref="refVideo15"
                    v-if="isShowTime && videoIndex == 15 ? true : false"
                  >
                    <div
                      class="hms_item"
                      v-for="(items, i) in 1440"
                      :key="items"
                      @mouseenter="mouseEnter(i)"
                      @click.stop="clickTime('video15', i)"
                    >
                      <el-tooltip
                        effect="dark"
                        :content="tipsText"
                        placement="top"
                      >
                        <el-button
                          class="hms_item_tooltip"
                          :class="{
                            item_times_back: i % 60 == 0 ? true : false,
                          }"
                        ></el-button>
                      </el-tooltip>

                      <div class="item_times">
                        {{
                          i % 60 == 0
                            ? `${i / 60 > 10 ? i / 60 : "0" + i / 60}:00`
                            : ""
                        }}
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getStreamGetPlaybackStream,
  listVideoDevice,
} from "@/api/subsystem/video-monitoring/videomonitor";

// import viewPlayback from "../../components/viewPlayback/index.vue";

import "xgplayer";
import FlvJsPlayer from "xgplayer-flv.js";
import CusPlayer from "./CusPlayer";
import moment from "moment";

export default {
  components: {
    // viewPlayback,
    CusPlayer,
  },
  data() {
    return {
      // -------------------------------------------------------------右侧（start）-------------------------------------------------------------
      selected: 1, // 表格类型
      videoIndex: 0, // 表格索引
      tableData: [], // 列表
      selectValue: "", // 当前选择的相机
      playUrl: "", // 播放的url
      isShowTime: false,
      // -------------------------------------------------------------右侧（end）-------------------------------------------------------------

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now(); // 禁止选择以后的时间
        },
      },
      dateS: moment().format("YYYY-MM-DD HH:mm:ss"),
      screen: 4,
      viewUri: [{}, {}, {}, {}],
      // 视频设备树
      videoDeviceTreeData: [],
      videoDeviceTreeProps: {
        children: "children",
        label: "label",
      },
      tipsText: "",
      query: {
        deviceCode: null,
        startTime: null,
        endTime: null,
      },
      temporaryStorage: {},
    };
  },

  mounted() {
    // this.query.startTime = this.parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
    this.listVideoDevices();
    for (let i = 0; i < 4; i++) {
      //   this.playUrl =
      //     "ws://192.168.1.240:20101/live?token=1111111111111111111111";
      //   if (this.playUrl) {
      //     this.videoIndex = i;
      //     let ref = "video" + this.videoIndex;
      //     this.$refs[ref].createPlayer(this.playUrl, true, this.videoIndex);
      //   } else {
      //     this.$message.error("请填写播放地址");
      //   }
    }
  },

  methods: {
    // -------------------------------------------------------------右侧（start）-------------------------------------------------------------
    selectType(selected) {
      this.selected = selected;
      this.videoIndex = "";
      this.isShowTime = false;

      // let len = selected == 0 ? 1 : selected == 1 ? 4 : selected == 2 ? 9 : 16;
      // for (let i = 0; i < len; i++) {
      //   this.videoIndex = i;
      // }
    },

    clickVideo(index) {
      this.isShowTime = true;
      this.videoIndex = index;
    },

    changeSelectValue() {
      this.playUrl = "ws://localhost:8866/live?url=" + this.selectValue;
    },

    getList() {
      // this.$http.get("/list").then((res) => {
      //   if (res.data.code == 200) {
      //     this.tableData = res.data.data;
      //   }
      // });
    },

    handlePlay(data) {
      if (data.type == 1) {
        // getStreamUrlByDeviceId(data.deviceCode).then((res) => {
        //   this.$refs.monitorBackground.clickLeft([
        //     {
        //       viewName: data.label,
        //       uri: res.data.uri,
        //       channelId: res.data.channelId,
        //     },
        //   ]);
        //   this.$forceUpdate();
        // });

        this.playUrl =
          "ws://192.168.1.240:20101/live?token=1111111111111111111111";
        if (this.playUrl) {
          let ref = "video" + this.videoIndex;
          this.$refs[ref].createPlayer(this.playUrl, true, this.videoIndex);
        } else {
          this.$message.error("请填写播放地址");
        }
      }
    },

    clickPlayer(e, index) {
      this.videoIndex = index;
    },
    // -------------------------------------------------------------右侧（end）-------------------------------------------------------------

    // 点击树形后获取播放流
    getStreamGetPlaybackStreams() {
      getStreamGetPlaybackStream(this.query).then((response) => {
        this.playUrl = response.data.uri;

        if (this.playUrl) {
          let ref = "video" + this.videoIndex;
          this.$refs[ref].createPlayer(this.playUrl, true, this.videoIndex);
          this.tableData[this.videoIndex] = response.data;
        } else {
          this.$message.error("地址流不能为空");
        }
      });
    },

    // 监控点列表
    listVideoDevices() {
      listVideoDevice().then((res) => {
        this.videoDeviceTreeData = res.data;
      });
    },

    // 点击树形播放
    videoDeviceTreeNodeClick(data) {
      if (data.type == 1) {
        this.query.deviceCode = data.deviceCode;
        this.query.startTime = this.dateS;
        this.query.endTime = moment().format("YYYY-MM-DD HH:mm:ss");
        this.temporaryStorage = data;
        this.getStreamGetPlaybackStreams();
      }
    },
    // 切换事件触发
    changeStartTime() {
      this.query.startTime = this.dateS;
      this.query.endTime = moment().format("YYYY-MM-DD HH:mm:ss");
      this.getStreamGetPlaybackStreams();
    },

    // 点击视频下方的时间
    clickTime(ref, i) {
      console.log(ref, i);
      this.query.deviceCode = this.tableData[this.videoIndex].deviceCode;
      this.query.startTime = this.dateS;

      getStreamGetPlaybackStream(this.query).then((response) => {
        // let refVideo = "refVideo" + ref.charAt(ref.length - 1);
        let refVideo = "refVideo" + this.videoIndex;
        this.$refs[refVideo].scrollLeft = i * 7;

        this.playUrl = response.data.uri;

        if (this.playUrl) {
          let ref = "video" + this.videoIndex;
          this.$refs[ref].createPlayer(this.playUrl, true, this.videoIndex);
        } else {
          this.$message.error("请填写播放地址");
        }
      });
    },

    // 鼠标移入
    mouseEnter(val) {
      this.tipsText = `${
        parseInt(val / 60) < 10 ? "0" + parseInt(val / 60) : parseInt(val / 60)
      }:${val % 60 < 10 ? "0" + (val % 60) : val % 60}`;
    },

    // 选择屏幕
    splitScreen(screen) {
      let viewUri = [...this.viewUri],
        newData = [];

      if (viewUri.length != screen) {
        for (let i = 0; i < screen; i++) {
          viewUri.push({
            id: i + 1,
          });
        }
      }

      for (let i = 0; i < screen; i++) {
        viewUri[i].id = i + 1;
        newData.push(viewUri[i]);
      }

      this.viewUri = newData;
      this.screen = screen;
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  padding: 20px;
  box-sizing: border-box;
  background-color: #eee;
}

.left_modular_box,
.right_modular_box {
  min-height: calc(100vh - 124px);
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
}

.custom_tree_node {
  display: flex;
}

.margin-tb {
  margin: 50px 0 0 0;
}

.hms_box {
  width: 97%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  overflow-x: scroll;
  margin: 0 auto;
}

.hms_box::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}

.hms_item {
  position: relative;
  margin: 6px 2px;
  height: 30px;
}

.hms_item_tooltip {
  width: 4px;
  height: 10px;
  background-color: #777;
  margin: 0;
  padding: 0;
  border-radius: 0;
}

.item_times_back {
  background-color: #ff0000;
  height: 16px;
}

.item_times {
  position: absolute;
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

.overflow_y_scroll {
  overflow-y: scroll;
}

.overflow_y_scroll_0::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}

.left {
  background-color: #aaa;
  height: 90vh;
}

.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
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
</style>
