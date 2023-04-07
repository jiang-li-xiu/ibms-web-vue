<!--
 * @Author: MJ
 * @Date: 2021-09-16 14:12:09
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-06-06 14:19:18
 * @Description: 
-->
<template>
  <div>
    <div class="public-address-settings-box">
      <el-row>
        <el-col>
          <el-form>
            <el-form-item>
              <div style="border-bottom: 1px solid #bbb; padding-left: 10px">
                公共广播总控制
              </div>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col>
          <el-form>
            <el-form-item>
              <div class="table">
                <div class="table-box">
                  <el-table
                    :data="tableData"
                    v-loading="loading"
                    border
                    key="id"
                  >
                    <el-table-column align="center" label="是否统一控制">
                      <template slot-scope="scope">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="1，播放管理：选择歌单，歌单和播放模式;  2，开启统一播放"
                          placement="top"
                        >
                          <el-switch
                            v-model="scope.row.controlSwitch"
                            @change="changeTotalControl($event)"
                          >
                          </el-switch>
                        </el-tooltip>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" label="音量">
                      <template slot-scope="scope">
                        <el-slider
                          v-model="scope.row.volume"
                          @change="changeTotalVolume($event)"
                        ></el-slider>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="歌单"
                      prop="directoryName"
                      show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="歌曲"
                      prop="songName"
                      show-overflow-tooltip
                    >
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="播放模式"
                      prop="playModelName"
                      :formatter="varPlayModelName"
                      show-overflow-tooltip
                    >
                    </el-table-column>

                    <!-- <el-table-column align="center" label="火灾告警">
                      <template slot-scope="scope">
                        <el-switch v-model="scope.row.fireSwitch" active-color="#0527af" inactive-color="#999999"
                          ></el-switch>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" label="麦克风">
                      <template slot-scope="scope">
                        <el-switch v-model="scope.row.microphoneSwitch" active-color="#0527af" inactive-color="#999999"
                          ></el-switch>
                      </template>
                    </el-table-column> -->

                    <el-table-column align="center" label="操作" width="250">
                      <template slot-scope="scope">
                        <el-button
                          type="primary"
                          @click="openPlaybackManagement(scope.row)"
                          >播放管理
                        </el-button>
                        <el-button type="primary"
                          :icon="scope.row.playSwitch === 'PLAY' ? 'el-icon-video-pause' : 'el-icon-video-play'"
                          @click="controlPlay(scope.row.playSwitch)" v-if="scope.row.directoryId">
                          {{ scope.row.playSwitch === "PLAY" ? '暂停' : '播放' }}
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <el-dialog title="播放管理" :visible.sync="isDialog" width="30%" @close="closes">
      <el-form :model="query" ref="formPlan" :rules="rulesPlan">
        <el-form-item prop="playModel" label-width="130px" label="播放模式：">
          <el-select v-model="query.playModel" placeholder="请选择播放模式">
            <el-option
              v-for="item in PLAY_MODEL"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="directoryId" label-width="130px" label="歌单：">
          <el-select
            v-model="query.directoryId"
            placeholder="请选择歌单"
            :disabled="!Boolean(query.playModel)"
            @change="changes()"
          >
            <el-option
              v-for="item in directory"
              :key="item.id"
              :label="item.dirName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="songId" label-width="130px" label="歌曲：">
          <el-select
            v-model="query.songId"
            placeholder="请选择歌曲"
            :disabled="!Boolean(query.directoryId)"
          >
            <el-option
              v-for="item in songs"
              :key="item.id"
              :label="item.songName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <div style="text-align: right">
            <el-button @click.stop="closes">取消</el-button>
            <el-button type="primary" @click="handelSubmit">播放</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getControlState,
  putTotalControl,
  putDetailControl,
  getDirectory,
  getSongsId,
} from "@/api/subsystem/public-broadcasting/index";

export default {
  props: {},
  data() {
    return {
      isDialog: false,
      loading: true,
      controlSwitch: null, //总控按钮状态
      tableData: [
        // {
        //   controlSwitch: false, // 是否统一控制
        //   volume: 68, // 音量
        //   playModel: null, // 播放模式标识
        //   playModelName: null, // 播放模式
        //   directoryId: null, // 歌单ID
        //   directoryName: null, // 歌单
        //   songId: null, // 歌曲ID
        //   songName: null, // 歌曲
        //   fireSwitch: false, // 火灾报警
        //   microphoneSwitch: false, // 麦克风
        // },
      ],

      // 总控制参数
      totalParameter: {
        playSwitch: false,
        volume: 69, // 音量
        playModel: null, // 播放模式标识
        directoryId: null, // 歌单ID
        songId: null, // 歌曲ID
        fireSwitch: false, // 火灾报警
        microphoneSwitch: false, // 麦克风
      },
      query: {
        playModel: null,
        directoryId: null,
        songId: null,
      },
      // 播放模式 字典
      PLAY_MODEL: [],
      // 全部歌单
      directory: [],
      // 全部歌曲
      // 根据歌单id获取歌曲
      songId: null,
      // 统一控制时，用来验证是否选择songId,playModel,directoryId
      playModel: null,
      directoryId: null,
      songs: [],
      rulesPlan: {
        playModel: [
          { required: true, message: "请选择播放模式", trigger: "blur" },
        ],
        directoryId: [
          { required: true, message: "请选择歌单", trigger: "blur" },
        ],
        songId: [{ required: true, message: "请选择歌曲", trigger: "blur" }],
      },
    };
  },
  mounted() {
    // 播放模式 字典
    this.getDicts("PLAY_MODEL").then((response) => {
      this.PLAY_MODEL = response.data;
    });
    this.getControlState();
  },

  methods: {
    // 播放模式字典
    varPlayModelName(row, column) {
      return this.selectDictLabel(this.PLAY_MODEL, row.playModel);
    },

    // 获取广播总控状态
    getControlState() {
      this.loading = true;
      getControlState().then((res) => {
        let { data } = res;
        this.tableData = [{ ...data }];
        this.totalParameter = {
          playSwitch: data.playSwitch,
          volume: data.volume, // 音量
          playModel: data.playModel, // 播放模式标识
          directoryId: data.directoryId, // 歌单ID
          songId: data.songId, // 歌曲ID
          fireSwitch: data.fireSwitch, // 火灾报警
          microphoneSwitch: data.microphoneSwitch, // 麦克风
        };
        this.query = {
          playModel: data.playModel,
          directoryId: data.directoryId,
          songId: data.songId
        },
          this.loading = false
        this.controlSwitch = data.controlSwitch
      })
    },

    // 总控制（统一控制）
    changeTotalControl(data) {
      console.log(data);
      if (!data) {
        if (this.totalParameter.playSwitch === 'PLAY') {
          this.totalParameter.playSwitch = 'STOP'
          this.putDetailControl()
        }
      }

      putTotalControl({ data: data }).then(res => {
        this.controlSwitch = data
        this.$message({
          message: res.message,
          type: "success",
        });
      });
    },

    // 总控制 控制音量
    changeTotalVolume(num) {
      this.totalParameter.volume = num;
      // console.log(this.totalParameter);
      this.putDetailControl("设置音量成功")
    },

    // 总控播放管理提交
    handelSubmit() {
      this.$refs["formPlan"].validate((valid) => {
        if (valid) {
          this.totalParameter.playSwitch = "PLAY"
          this.totalParameter.playModel = this.query.playModel,
            this.totalParameter.directoryId = this.query.directoryId,
            this.totalParameter.songId = this.query.songId
          this.putDetailControl("播放成功")
        }
      });
    },
    controlPlay(playSwitch) {
      let msg
      if (playSwitch === "PLAY") {
        this.totalParameter.playSwitch = "STOP"
        msg = '暂停成功'
      }
      else {
        this.totalParameter.playSwitch = "PLAY"
        msg = '播放成功'
      }
      this.putDetailControl(msg)
    },

    // 总控制参数设置
    putDetailControl(msg) {
      if (!this.controlSwitch) {
        this.$message({
          message: "请开启统一控制",
          type: "warning",
        });
      } else {
        putDetailControl(this.totalParameter).then((res) => {
          if (this.isDialog) {
            this.isDialog = false;
          }
          this.$message({
            message: msg,
            type: "success",
          });

          this.getControlState()
        })
      }
    },

    // 获取全部歌曲
    getSongsAlls() {
      getSongsId({ id: this.query.directoryId }).then((response) => {
        this.songs = response.data;
      });
    },

    // 获取全部歌单
    getDirectorys() {
      getDirectory({ directoryName: null }).then((response) => {
        this.directory = response.data;
      });
    },

    // 处理获取到的播放管理面板
    changes() {
      this.getSongsAlls();
      this.query.songId = null
    },

    // 打开 播放管理 面板
    openPlaybackManagement(row) {
      if (row.controlSwitch) {
        this.query = {
          playModel: this.totalParameter.playModel,
          directoryId: this.totalParameter.directoryId,
          songId: this.totalParameter.songId,
        };
        this.getDicts("PLAY_MODEL").then((response) => {
          this.PLAY_MODEL = response.data;
        });

        this.getDirectorys();
        this.getSongsAlls()

        this.isDialog = true;
      } else {
        this.$message({
          message: "请开启统一控制",
          type: "warning",
        });
      }
    },

    // 关闭 播放管理 面板
    closes() {
      this.isDialog = false;
      this.$refs["formPlan"].clearValidate();
    },
  },
};
</script>

<style lang="scss" scoped>
.public-address-settings-box {
  background-color: #fff;
  height: 190px;
}

.table {
  display: flex;
  justify-content: center;
  align-items: center;

  .table-box {
    width: 95%;
    text-align: center;
  }
}

.playback-management {
  cursor: pointer;
  color: #0527af;
}

.el-table tbody tr:hover>td {
  background-color: #ffffff !important;
}
</style>
