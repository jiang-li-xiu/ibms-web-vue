<!--
 * @Author: Yelucc
 * @Date: 2021-06-25 16:53:27
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-29 10:54:49
 * @Description:
-->
<template>
  <div class="main">
    <el-row :gutter="10">
      <el-col :span="9" class="main-form" style="padding-right: 40px">
        <div class="step-title">设备类型基础信息</div>

        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="图标">
            <el-select
              style="width: 100%"
              v-model="ruleForm.iconFilepath"
              placeholder="请选择图标"
              @change="changeSelection"
              ref="refSelect"
            >
              <el-option v-for="item in optionsImg" :key="item.id" :value="item.label">
                <div class="option_box">
                  <el-image class="option_img" :src="item.valueImg"></el-image>
                  <span v-text="item.label"></span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="类型名称" prop="className">
            <el-input v-model="ruleForm.className"></el-input>
          </el-form-item>

          <el-form-item label="类型标识" prop="classCode">
            <el-input v-model="ruleForm.classCode"></el-input>
          </el-form-item>

          <el-form-item label="3d模型类型">
            <el-select
              style="width: 100%"
              v-model="ruleForm.unityType"
              placeholder="请选择3d模型类型"
            >
              <el-option
                v-for="dict in unityTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="子系统" prop="attachSystemCode">
            <el-button
              class="mb-20"
              type="primary"
              icon="el-icon-search"
              v-model="ruleForm.attachSystemCode"
              @click="selectSubSystem"
              >选择归属子系统</el-button
            >
            <div v-if="selectSysObj">
              <sub-system-card :systemInfo="selectSysObj" :edit="false" />
            </div>
          </el-form-item>

          <el-form-item label="插件" prop="attachPluginCode" v-if="selectSysObj">
            <el-button
              class="mb-20"
              type="primary"
              icon="el-icon-search"
              v-model="ruleForm.attachPluginCode"
              @click="selectPlugin"
              >选择归属插件</el-button
            >
            <div v-if="selectPluginObj">
              <sub-plugins-card
                :pluginBasicInfo="selectPluginObj"
                :edit="false"
              ></sub-plugins-card>
            </div>
          </el-form-item>

          <el-form-item label="物模型" prop="thingModelCode" v-if="selectPluginObj">
            <el-button
              class="mb-20"
              type="primary"
              icon="el-icon-search"
              style="width: 160px"
              v-model="ruleForm.thingModelCode"
              @click="selectThingModel"
              >选择物模型</el-button
            >
            <el-row :gutter="10" v-if="selectThingModelObj">
              <el-col :span="24">
                <thing-model-card
                  :thingModelInfo="selectThingModelObj"
                  :edit="false"
                ></thing-model-card>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="15">
        <!-- 子系统 -->
        <div v-if="select == 1">
          <sub-system-card
            v-for="(i, k) in subsystemlist"
            :key="k"
            :systemInfo="i"
            :edit="false"
            @titleClickHandler="selectSubSystemHandler"
          ></sub-system-card>
        </div>

        <!-- 插件 -->
        <div v-if="select == 2">
          <sub-plugins-card
            v-for="(i, k) in subpluginlist"
            :key="k"
            :pluginBasicInfo="i"
            :edit="false"
            @titleClickHandler="selectPluginsHandler"
          ></sub-plugins-card>
        </div>

        <!-- 物模型 -->
        <div v-if="select == 3">
          <thing-model-card
            v-for="(i, k) in thingModelList"
            :thingModelInfo="i"
            :key="k"
            :edit="false"
            @titleClickHandler="selectThingModelHandler"
          ></thing-model-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listSystem, getSystem, getThingModelByPid } from "@/api/subsystem/system";

import SubSystemCard from "@/components/SubSystemCard";
import SubPluginsCard from "@/components/SubPluginsCard";
import ThingModelCard from "@/components/ThingModelCard";

export default {
  name: "DeviceClassesBasic",
  components: {
    SubSystemCard,
    SubPluginsCard,
    ThingModelCard,
  },
  data() {
    return {
      imageUrl: "",
      select: 0,
      selectSysObj: null,
      selectPluginObj: null,
      selectThingModelObj: null,

      thingModelList: [],
      subsystemlist: [],
      subpluginlist: [],
      unityTypeOptions: [],
      ruleForm: {
        className: null,
        classIcon: null,
        classCode: "",
        classStatus: null,
        unityType: "",
        thingModelCode: "",
        attachSystemCode: "",
        attachPluginCode: "",
        selectSysObj: null,
        selectPluginObj: null,
        selectThingModelObj: null,
        iconFilepath: "",
      },
      rules: {
        classCode: [{ required: true, message: "请输入设备类型标识", trigger: "blur" }],
        className: [{ required: true, message: "请输入设备类型名称", trigger: "blur" }],
        attachSystemCode: [
          { required: true, message: "请选择归属子系统", trigger: "change" },
        ],
        attachPluginCode: [
          { required: true, message: "请选择归属插件", trigger: "change" },
        ],
        thingModelCode: [
          { required: true, message: "请选择归物模型", trigger: "change" },
        ],
      },
      optionsImg: [],
      updatedCoun: 0,
    };
  },

  created() {
    listSystem().then((res) => {
      this.subsystemlist = res.data.records;
    });
    this.getDicts("UNITY_TYPE").then((response) => {
      this.unityTypeOptions = response.data;
    });
    this.$emit("update:form", this.ruleForm);
    // 获取可选图标
    this.imgData();
  },

  methods: {
    // 图标处理
    imgData() {
      let imgName = ["video_camera", "icon-8"],
        i = 0,
        item = null;
      for (; i < imgName.length; i++) {
        item = imgName[i];
        this.optionsImg.push({
          id: i + 1,
          valueImg: require(`@/assets/images/equipmentTypeIcon/${item}.png`),
          label: item,
        });
      }
    },
    // select标签的change事件
    changeSelection(val) {
      let optionsImg = this.optionsImg,
        i = optionsImg.findIndex((item) => item.label == val);
      this.$refs["refSelect"].$el.children[0].children[0].setAttribute(
        "style",
        `background: url(${optionsImg[i].valueImg}) no-repeat; background-position: 10px center; background-size: 20px 20px; text-indent: 30px; `
      );
    },

    // 接收 子系统 组件返回的数据
    selectSubSystemHandler(v) {
      this.ruleForm.attachSystemCode = v.code;
      // this.ruleForm.classCode += v.code + "-";
      this.ruleForm.selectSysObj = v;
      this.selectSysObj = v;
      // this.selectPlugin();
    },

    selectPluginsHandler(v) {
      this.ruleForm.attachPluginCode = v.code;
      // this.ruleForm.classCode += v.code + "-";
      this.selectPluginObj = v;
      this.ruleForm.selectPluginObj = v;
      // this.selectThingModel();
    },
    selectThingModelHandler(v) {
      this.ruleForm.thingModelCode = v.id;
      this.ruleForm.modelId = v.modelId;
      // this.ruleForm.classCode += v.id + "-";
      this.ruleForm.selectThingModelObj = v;
      this.selectThingModelObj = v;
    },

    selectSubSystem() {
      this.select = 1;
      listSystem().then((res) => {
        this.subsystemlist = res.data.records;
      });
    },

    // 选择归属插件
    selectPlugin() {
      this.select = 2;
      this.subpluginlist = this.selectSysObj.subPluginList;
    },

    // 选择物模型
    selectThingModel() {
      this.select = 3;
      getThingModelByPid(this.selectPluginObj.code).then((res) => {
        this.thingModelList = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 70vh;
  min-height: calc(100vh - 328px);
  .step-title {
    font-size: 24px;
    font-weight: 600;
    padding-left: 20px;
    margin-bottom: 20px;
  }
  .main-form {
    min-height: calc(100vh - 328px);
    border-right: 2px solid #e6ebf5;
  }
}

.option_box {
  display: flex;
  align-items: center;
}

.option_img {
  width: 20px;
  height: 20px;
  margin-right: 7px;
}
</style>
