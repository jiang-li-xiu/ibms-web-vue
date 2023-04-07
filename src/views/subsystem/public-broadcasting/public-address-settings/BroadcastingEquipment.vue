<!--
 * @Author: MJ
 * @Date: 2021-09-16 15:41:57
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-18 16:29:28
 * @Description: 
-->
<template>
  <div class="broadcasting-equipment-box">
    <div class="broadcasting-equipment">

      <el-form :model="formQuery" :inline="true" ref="refs">
        <el-form-item prop="regionId" label="区域">
          <el-cascader :options="options" :props="{
            checkStrictly: true,
            value: 'regionId',
            label: 'regionName',
          }" v-model="formQuery.regionId" placeholder="请选择播放区域" clearable></el-cascader>
        </el-form-item>

        <el-form-item label-width="60px" label=" ">
          <el-button type="primary" @click="getTableData" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-video-pause" :disabled="multiple" @click.stop="playbackManagement">
            批量播放</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-video-play" :disabled="multiple" @click.stop="suspendManagement">批量暂停
          </el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-headset" :disabled="multiple" @click.stop="openPanel">批量设置音量
          </el-button>
        </el-col>
        <!-- 
        <el-col :span="1.5">
          <el-select v-model="playParams.playModel" :disabled="multiple" placeholder="选择播放模式">
            <el-option v-for="item in PLAY_MODEL" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
            </el-option>
          </el-select>
        </el-col> -->
      </el-row>

      <el-table :height="tableHeight" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" label="设备名称" prop="deviceName"></el-table-column>

        <el-table-column align="center" label="运行状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 0">运行</el-tag>
            <el-tag type="danger" v-else>停止</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="所属分区" prop="regionName"></el-table-column>

        <el-table-column align="center" label="歌曲">
          <template slot-scope="scope">
            <span>{{ scope.row.songName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="音量">
          <template slot-scope="scope">
            <el-slider v-model="scope.row.volume" @change="changeVolume(scope.row)"></el-slider>
          </template>
        </el-table-column>

        <el-table-column align="center" label="播放模式" prop="playModel" :formatter="varPlayModelName"></el-table-column>

        <el-table-column align="center" label="歌单" prop="directoryName"></el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-form :inline="true">
              <el-form-item v-if="scope.row.playSwitch === 'STOP'">
                <el-button type="primary" icon="el-icon-video-play" @click.stop="singlePlay(scope.row)">播放</el-button>
              </el-form-item>
              <el-form-item v-else>
                <el-button type="primary" icon="el-icon-video-pause" @click.stop="suspendPlay(scope.row)">暂停
                </el-button>
              </el-form-item>
            </el-form>
            <!-- </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="formQuery.pageNum" :limit.sync="formQuery.pageSize"
        :page-sizes="[15, 20, 30, 50]" @pagination="getTableData" />
    </div>

    <!-- 批量设置音量面板 -->
    <el-dialog title="设置音量" :visible.sync="dialogFormVisible">
      <el-slider v-model="volumeVal"></el-slider>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchVolumePlay">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 批量播放弹窗 -->
    <el-dialog title="播放管理" :visible.sync="isDialog" width="30%" @close="closes">
      <el-form :model="query" ref="formPlan" :rules="rulesPlan">
        <el-form-item prop="playModel" label-width="130px" label="播放模式：">
          <el-select v-model="query.playModel" placeholder="请选择播放模式">
            <el-option v-for="item in PLAY_MODEL" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="directoryId" label-width="130px" label="歌单：">
          <el-select v-model="query.directoryId" placeholder="请选择歌单" :disabled="!Boolean(query.playModel)"
            @change="changes()">
            <el-option v-for="item in directory" :key="item.id" :label="item.dirName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="songId" label-width="130px" label="歌曲：">
          <el-select v-model="query.songId" placeholder="请选择歌曲" :disabled="!Boolean(query.directoryId)">
            <el-option v-for="item in songs" :key="item.id" :label="item.songName" :value="item.id"></el-option>
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
  getCurrentList,
  getRegionTree,
  putCurrentPlay,
  getDirectory,
  getSongsId,
  putSetVolumes
} from "@/api/subsystem/public-broadcasting/index";

export default {
  data() {
    return {
      options: [],
      multiple: true,
      formQuery: {
        pageNum: 1,
        pageSize: 15,
        regionId: null, // 区域ID
        deviceName: "", // 设备名称
        status: "", // 设备状态
      },
      playbackMode: "",
      tableData: [],
      total: 0,
      tableHeight: null,
      // 播放模式 字典
      PLAY_MODEL: [],
      // 播放参数
      playParams: {
        deviceCodes: "", // 设备唯一编码
        directoryId: "", // 歌单ID
        playModel: "SINGECIRCLE", // 播放模式
        playSwitch: "", // 播放or停止
        songId: "", // 歌曲ID
        volume: 20, // 音量
      },

      dialogFormVisible: false,
      volumeVal: null, // 批量设置音量值

      // 批量播放弹窗
      isDialog: false,
      // 批量播放参数
      query: {
        playModel: null,
        directoryId: null,
        songId: null
      },
      // 批量播放表单验证
      rulesPlan: {
        playModel: [
          { required: true, message: "请选择播放模式", trigger: "blur" },
        ],
        directoryId: [
          { required: true, message: "请选择歌单", trigger: "blur" },
        ],
        songId: [{ required: true, message: "请选择歌曲", trigger: "blur" }],
      },
      // 全部歌单
      directory: [],
      // 歌单歌曲
      songs: [],

    };
  },
  created() {
    // 播放模式 字典
    this.getDicts("PLAY_MODEL").then((response) => {
      this.PLAY_MODEL = response.data;
    });
    this.getTableData();
    this.getRegionTrees();
  },
  mounted() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight, true);
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight, true);
  },

  methods: {
    // 播放模式 字典换算
    varPlayModelName(row, column) {
      return this.selectDictLabel(this.PLAY_MODEL, row.playModel);
    },
    // 获取区域数据
    getRegionTrees() {
      getRegionTree({ regionId: 0, subSystemCode: "sub-broadcast" }).then(
        (response) => {
          this.options = [
            {
              regionId: 0,
              fid: 0,
              regionName: "全部",
              children: response.data,
            },
          ];
        }
      );
    },

    // 获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 560;
    },
    // 获取 设备 列表数据
    getTableData() {
      let deepClone = function (data) {
        if (data === null || typeof data !== "object") return data;
        let cloneData = Array.isArray(data) ? [] : {};
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            cloneData[key] = deepClone(data[key]);
          }
        }
        return cloneData;
      };

      let obj = deepClone(this.formQuery);
      if (obj.regionId) {
        obj.regionId = obj.regionId[obj.regionId.length - 1];
      }

      getCurrentList(obj).then((response) => {
        let { total, rows } = response;
        this.total = total;
        this.tableData = rows
      });
    },

    // 重置
    resetForm() {
      this.$refs["refs"].resetFields();
      this.getTableData();
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

    // 批量播放、暂停
    putCurrentPlay(msg) {
      putCurrentPlay(this.playParams).then(res => {
        if (this.isDialog) {
          this.isDialog = false
        }
        if (this.dialogFormVisible) {
          this.dialogFormVisible = false
        }
        this.$message({
          message: msg,
          type: "success",
        });
        this.getTableData()
      })
    },

    // 多选触发
    handleSelectionChange(selection) {
      let deviceCode = selection
        .map((item) => {
          return item.deviceCode;
        })
        .toString();
      this.multiple = !selection.length;;
      this.$set(this.playParams, "deviceCodes", deviceCode);
    },

    // 批量播放
    playbackManagement() {
      this.getDicts("PLAY_MODEL").then((response) => {
        this.PLAY_MODEL = response.data;
      });
      this.getDirectorys();
      this.getSongsAlls()
      this.isDialog = true;
    },

    // 处理批量播放面板
    changes() {
      this.getSongsAlls();
      this.query.songId = null
    },

    // 批量播放管理提交
    handelSubmit() {
      this.$refs["formPlan"].validate((valid) => {
        if (valid) {
          this.playParams.playSwitch = "PLAY"
          this.playParams.playModel = this.query.playModel,
            this.playParams.directoryId = this.query.directoryId,
            this.playParams.songId = this.query.songId
          this.putCurrentPlay("播放成功")
          // console.log(this.playParams);
        }
      });
    },

    // 关闭 批量播放 面板
    closes() {
      this.query = {
        playModel: null,
        directoryId: null,
        songId: null
      }
      this.isDialog = false;
      this.$refs["formPlan"].clearValidate();
    },

    // 批量暂停
    suspendManagement() {
      this.playParams.playSwitch = "STOP";
      this.putCurrentPlay("批量暂停成功")
    },

    // 打开批量设置音量面板
    openPanel() {
      this.dialogFormVisible = true;
    },

    // 批量设置音量
    batchVolumePlay() {
      this.playParams.volume = this.volumeVal
      this.putCurrentPlay("设置音量成功")
    },

    // 单个音量设置
    changeVolume(row) {
      let {
        deviceCode, // 设备唯一编码
        volume, // 音量
      } = row;
      this.playParams.deviceCodes = deviceCode; // 设备唯一编码
      this.playParams.volume = volume; // 音量
      this.putCurrentPlay("设置音量成功")
    },

    // 单个暂停
    suspendPlay(row) {
      this.playParams.deviceCodes = row.deviceCode; // 设备唯一编码
      this.playParams.playSwitch = "STOP"; // 播放or停止
      this.putCurrentPlay("暂停成功")
    },

    // 单个播放
    singlePlay(row) {
      let {
          deviceCode, // 设备唯一编码
          playSwitch, // 播放or停止
          volume, // 音量
          directoryId,// 歌单ID
          playModel,// 播放模式
          songId// 歌曲ID
        } = row;
        this.playParams.deviceCodes = deviceCode; // 设备唯一编码
      if (row.songId) {
        this.playParams.playSwitch = playSwitch === "STOP" ? "PLAY" : "STOP"; // 播放or停止
        this.playParams.volume = volume; // 音量
        this.playParams.directoryId = directoryId
        this.playParams.playModel = playModel
        this.playParams.songId = songId
        this.putCurrentPlay("播放成功")
      }
      else{
        this.playbackManagement()
      }
    },

    // 设置音量
    // putSetVolumes(){
    //   // let data = new URLSearchParams();
    //   // data.append("deviceCodes",this.playParams.deviceCodes)
    //   // data.append("volume",this.playParams.volume)
    //   let data = {
    //     deviceCodes:this.playParams.deviceCodes,
    //     volume:this.playParams.volume
    //   }
    //   console.log(data);
    //   putSetVolumes(data).then(res=>{
    //     this.$message.success("设置音量成功")
    //     this.getTableData()
    //   })
    // }
  }
};
</script>

<style lang="scss" scoped>
.broadcasting-equipment-box {
  min-height: calc(100vh - 346px);
  background-color: #fff;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  padding: 20px 0
}

.broadcasting-equipment {
  width: 95%;
}

.status-text {
  color: #00ff00;
}

.playback-management {
  cursor: pointer;
  color: #0527af;
}

.suspend-text {
  cursor: pointer;
  color: #ffba00;
}
</style>
