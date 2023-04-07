<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-15 11:04:28
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-15 15:11:44
-->
<template>
  <el-dialog
    :title="dialogFormVisibleText"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    @close="closes"
  >
    <el-form :model="formData" ref="refForm" :rules="formDataRules">
      <div>
        <el-form-item label="定时属性"> </el-form-item>

        <div>
          <el-form-item label-width="100px" label="区域：" prop="region">
            <el-cascader
              v-model="formData.region"
              :options="treeOptions"
              :props="props"
              collapse-tags
              clearable
            ></el-cascader>
          </el-form-item>

          <el-form-item label-width="100px" label="计划名称：" prop="planName">
            <el-input v-model="formData.planName"></el-input>
          </el-form-item>

          <div>
            <el-form-item label-width="100px" label="播放日期："
              ><el-radio-group
                v-model="formData.dateModel"
                @change="radioTypef"
              >
                <el-radio label="EVERYDAY">每天</el-radio>
                <el-radio label="EVERYWEEK">每周</el-radio>
                <el-radio label="ONEDAY">指定一天</el-radio>
                <el-radio label="SCOPE">日期范围</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              label-width="100px"
              v-show="formData.dateModel == 'EVERYWEEK'"
            >
              <el-checkbox-group v-model="formData.weeks">
                <el-checkbox :label="1">周一</el-checkbox>
                <el-checkbox :label="2">周二</el-checkbox>
                <el-checkbox :label="3">周三</el-checkbox>
                <el-checkbox :label="4">周四</el-checkbox>
                <el-checkbox :label="5">周五</el-checkbox>
                <el-checkbox :label="6">周六</el-checkbox>
                <el-checkbox :label="7">周日</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item
              label-width="100px"
              v-show="formData.dateModel == 'ONEDAY'"
            >
              <el-date-picker
                v-model="formData.dates"
                type="date"
                :picker-options="beforeDate"
                placeholder=""
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item
              label-width="100px"
              v-show="formData.dateModel == 'SCOPE'"
            >
              <el-date-picker
                v-model="formData.DateRange"
                type="daterange"
                :picker-options="beforeDate"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </div>

          <el-form-item
            label-width="100px"
            label="播放时间："
            prop="timeStartEnd"
          >
            <el-time-picker
              is-range
              v-model="formData.timeStartEnd"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
          </el-form-item>
        </div>
      </div>

      <div>
        <el-form-item label="播放列表"> </el-form-item>

        <div>
          <el-form-item label-width="100px" label="播放歌曲：" prop="songSheet">
            <el-select
              v-model="formData.songSheet"
              placeholder=""
              @change="changeSongSheet"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.songNames"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label-width="100px" label="播放音量：">
            <el-slider v-model="formData.volumes"></el-slider>
          </el-form-item>

          <el-form-item label-width="100px" label="播放模式：">
            <el-radio-group v-model="formData.patterns">
              <el-radio :label="1">单曲播放</el-radio>
              <el-radio :label="2">单曲循环</el-radio>
              <el-radio :label="3">目录循环</el-radio>
              <el-radio :label="4">全部循环</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <div slot="footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="determine">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  postBroadcastJobAdd,
  getSongsAll,
  getOneJob,
  updateJob,
} from "@/api/subsystem/public-broadcasting/index";
import { getRegionTree } from "@/api/subsystem/access-control-system/accessControlEquipment";
function tree(data) {
  for (let key in data) {
    if (key == "regionId") {
      data["value"] = data["regionId"];
      data["label"] = data["regionName"];
    }
    if (typeof data[key] == "object") {
      tree(data[key]);
    }
  }
  return data;
}
export default {
  name: "TimePlayDetail",
  components: {},
  props: {},
  data() {
    return {
      options: [],
      treeOptions: [],
      addEditText: null,
      dialogFormVisible: false,
      dialogFormVisibleText: "新增定时",
      props: {
        multiple: true,
        checkStrictly: true,
      },
      beforeDate: {
        disabledDate(time) {
          // 禁止选择以前的时间
          return time.getTime() < Date.now();
        },
      },
      // 新增/编辑
      formData: {
        region: [], // 区域ID
        planName: "", // 计划名称
        dateModel: "EVERYDAY", // 播放日期类型
        weeks: [], // 周
        dates: null, // 指定某一天
        DateRange: null, // 日期范围
        timeStartEnd: null, // 播放时间
        songSheet: null, // 歌曲ID
        directName: "", // 歌曲名称
        volumes: 56, // 播放音量
        patterns: 1, // 播放模式
      },
      formDataRules: {
        region: [
          {
            required: true,
            message: "请选择活动区域",
            trigger: "change",
          },
        ],
        planName: [{ required: true, message: "计划名称不能为空", trigger: "blur" }],
        timeStartEnd: [
          {
            required: true,
            message: "请选择播放时间",
            trigger: "change",
          },
        ],
        songSheet: [
          {
            required: true,
            message: "请选择歌曲",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    this.getRegionTrees();
    this.getSongsAlls();
  },
  created() {},
  methods: {
    add(type) {
      this.addEditText = type;
      this.dialogFormVisible = true;
    },
    edit(type, data) {
      this.addEditText = type;
      this.getOneJobs(data.jobId);
      this.dialogFormVisible = true;
    },
    // 根据 jobId 获取数据
    getOneJobs(jobId) {
      getOneJob({ jobId }).then((response) => {
        let {
            regionList,
            jobName,
            dateModel,
            dateRange,
            timeStartEnd,
            directIndex,
            directName,
            volume,
            playModel,
            jobId,
          } = response.data,
          playModels = {
            SINGLE: "1",
            SINGECIRCLE: "2",
            DIRECIRCLE: "3",
            ALLCIRCLE: "4",
          };
        this.formData.region = regionList;
        this.formData.planName = jobName;
        this.formData.dateModel = dateModel;
        this.formData.weeks = dateModel == "EVERYWEEK" ? datas : [];
        this.formData.dates = dateModel == "ONEDAY" ? dateRange[0] : null;
        this.formData.DateRange = dateModel == "SCOPE" ? dateRange : null;
        this.formData.timeStartEnd = timeStartEnd;
        this.formData.songSheet = directIndex;
        this.formData.directName = directName;
        this.formData.volumes = volume;
        this.formData.patterns = Number(playModels[playModel]);
        this.formData.jobId = jobId;
      });
    },
    // 选中歌曲时触发的事件
    changeSongSheet(val) {
      this.options.forEach((item) => {
        if (item.id == val) {
          this.formData.directName = item.songNames;
        }
      });
    },

    // 单选 change 事件
    radioTypef() {
      this.formData.weeks = [];
      this.formData.dates = null;
      this.formData.DateRange = null;
    },

    // 获取所有的歌曲
    getSongsAlls() {
      getSongsAll().then((response) => {
        this.options = response.data.map((item) => {
          item.songNames = item.songName.split(".")[0];
          return item;
        });
      });
    },

    // 获取树形数据
    getRegionTrees() {
      getRegionTree({ regionId: 0 }).then((response) => {
        this.treeOptions = tree(response.data);
      });
    },

    // 确定
    determine() {
      let {
          region,
          planName,
          dateModel,
          weeks,
          dates,
          DateRange,
          timeStartEnd,
          songSheet,
          volumes,
          patterns,
          directName,
        } = this.formData,
        dateModels = {
          EVERYDAY: "",
          EVERYWEEK: weeks ? weeks.toString() : "",
          ONEDAY: dates ? this.parseTime(new Date(dates), "{y}-{m}-{d}") : "",
          SCOPE: DateRange
            ? this.parseTime(new Date(DateRange[0]), "{y}-{m}-{d}") +
              "~" +
              this.parseTime(new Date(DateRange[1]), "{y}-{m}-{d}")
            : "",
        },
        playModel = {
          1: "SINGLE",
          2: "SINGECIRCLE",
          3: "DIRECIRCLE",
          4: "ALLCIRCLE",
        };
      let arr = region.flat(),
        newArr = arr.filter((item, index) => arr.indexOf(item) === index);

      let form = {
        regionId: newArr.toString(), // 区域ID
        regionList: region, // 原始的区域ID
        jobName: planName, // 计划名称
        dateModel: dateModel, // 播放日期类型
        dates: dateModels[dateModel], // 播放日期值
        startTime: timeStartEnd
          ? this.parseTime(new Date(timeStartEnd[0]), "{h}:{i}:{s}")
          : "", // 播放时间（开始）
        endTime: timeStartEnd
          ? this.parseTime(new Date(timeStartEnd[1]), "{h}:{i}:{s}")
          : "", // 播放时间（end）
        directIndex: songSheet, // 播放歌曲
        directName,
        volume: volumes, // 播放音量
        playModel: playModel[patterns], // 播放模式
        dateRange: DateRange || [dates], // 播放日期
        timeStartEnd, // 播放时间
      };

      if (this.addEditText == "add") {
        this.$refs["refForm"].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)",
            });
            postBroadcastJobAdd(form)
              .then((response) => {
                this.$message({
                  type: "success",
                  message: "添加成功",
                });
                this.dialogFormVisible = false;
                this.$emit("ok");
                loading.close();
              })
              .catch(() => {
                loading.close();
              });
          } else {
            return false;
          }
        });
      } else {
        form.jobId = this.formData.jobId;
        this.$refs["refForm"].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)",
            });
            updateJob(form).then((response) => {
              this.$message({
                type: "success",
                message: "更新成功",
              });
              this.dialogFormVisible = false;
              this.$emit("ok");
              loading.close();
            });
          } else {
            return false;
          }
        });
      }
    },
    // 关闭弹窗
    closes() {
      this.$refs["refForm"].resetFields();
      this.$refs["refForm"].clearValidate();
      this.formData = {
        region: [], // 区域ID
        planName: "", // 计划名称
        dateModel: "EVERYDAY", // 播放日期类型
        weeks: [], // 周
        dates: null, // 指定某一天
        DateRange: null, // 日期范围
        timeStartEnd: null, // 播放时间
        songSheet: null, // 歌曲ID
        directName: "", // 歌曲名称
        volumes: 56, // 播放音量
        patterns: 1, // 播放模式
      };
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
