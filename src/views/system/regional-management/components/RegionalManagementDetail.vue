<template>
  <div class="regional-management-detail" v-loading="loading">
    <!-- 头部标题区域 -->
    <div class="head-title">{{ title }}</div>
    <!-- 数据信息区域 -->
    <div class="data-info">
      <div class="info-head">
        <div class="info-head-title">数据信息</div>
        <div class="info-head-btn">
          <!-- <el-button
            v-if="title !== '全部'"
            type="text"
            size="mini"
            icon="el-icon-upload"
            @click="$message.warning('待开发')"
            >导入</el-button
          >
          <el-button
            v-if="title !== '全部'"
            type="text"
            size="mini"
            icon="el-icon-download"
            @click="$message.warning('待开发')"
            >下载模板</el-button
          >
          <el-button
            v-if="title !== '全部'"
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleOpenDialog(treeData)"
            >编辑</el-button
          > -->
        </div>
      </div>
      <!-- 表格区域 -->
      <table class="info-table">
        <tr>
          <td class="column">区域名称</td>
          <td>{{ regionDetails.regionName || "全部" }}</td>
        </tr>
        <tr>
          <td class="column">区域编码</td>
          <td>{{ regionDetails.regionCode || "无" }}</td>
        </tr>
        <tr>
          <td class="column">父级区域</td>
          <td>{{ regionDetails.fname || "无" }}</td>
        </tr>
        <tr>
          <td class="column">区域类型</td>
          <td>{{ regionType(regionDetails.regionType) }}</td>
        </tr>
        <tr>
          <td class="column">关联子系统</td>
          <td>{{ regionDetails.subSytemNames || subSystemStr }}</td>
        </tr>
      </table>
    </div>

    <!-- 区域信息列表 -->
    <div class="region-info">
      <div class="info-head">
        <div class="info-head-title">区域信息列表</div>
      </div>
      <!-- 表格区域 -->
      <el-table
        border
        :data="tableData"
        row-key="regionId"
        :tree-props="{ children: 'children' }"
        :max-height="tableHeight"
        ref="table"
      >
        <el-table-column
          align="center"
          prop="regionName"
          label="区域名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="fname"
          label="父级区域"
        ></el-table-column>
        <el-table-column align="center" prop="regionType" label="区域类型">
          <template #default="scope">
            <span>{{ regionType(scope.row.regionType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="subSystemNames"
          label="关联子系统"
        ></el-table-column>
      </el-table>
    </div>

    <!-- 编辑区域 -->
    <region-edit
      ref="RegionEditDialog"
      :treeData="treeData"
      @getData="getDataEmit"
    ></region-edit>
  </div>
</template>

<script>
import RegionEdit from "./RegionEdit";
import bus from "@/utils/bus.js";

import {
  getRegionDetails,
  getSubSystemList,
  getRegionDetailsTree,
} from "@/api/system/regionalManagement.js";
export default {
  props: {
    treeNode: Object,
  },
  components: {
    RegionEdit,
  },
  data() {
    return {
      // 树形点击过来的数据
      treeData: {
        regionId: 0,
        fid: 0,
        regionName: "全部",
      },
      // 标题
      title: "全部",
      // 弹窗开关
      dialogVisible: false,
      // 表单参数
      formData: {},
      // 验证表单
      rules: {
        regionName: [{ required: true, message: "请输入区域名称", trigger: "blur" }],
        fid: [{ required: true, message: "请选择父级区域", trigger: "blur" }],
        regionType: [{ required: true, message: "请选择区域类型", trigger: "blur" }],
        // subSytemCodes: [
        //   { required: true, message: '请选择子系统', trigger: 'blur' },
        // ],
      },
      // 区域类型
      regionTypes: [],
      // 子系统列表
      subSystems: [],
      subSystemNames: [],
      // 当前选择的父级区域
      parentRegion: {},
      // 区域信息表格数据
      tableData: [],
      // 表格的最大高度
      tableHeight: 0,
      // 区域详情信息
      regionDetails: {},
      // 加载开关
      loading: true,
    };
  },
  created() {
    bus.$on("refresh", () => {
      // 获取区域详情树形列表数据
      this.getRegionDetailsTreeData();
    });
    bus.$on("refreshTreeData", this.getDataEmit);
    // 获取区域管理字典
    this.getRegionTypeDicts();
    // 获取子系统列表
    this.getSubSystems();
    // 获取区域详情树形列表数据
    this.getRegionDetailsTreeData();
    this.getTableHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getTableHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getTableHeight);
    bus.$off("refresh"); // 组件销毁时关闭监听
    bus.$off("refreshTreeData"); // 组件销毁时关闭监听
  },

  methods: {
    getDataEmit(data) {
      this.$emit("getData");
      this.treeData = {
        regionId: data.regionId,
        fid: data.fid,
        regionName: data.regionName,
      };
      this.title = this.treeData.regionName
      this.getRegionDetailsData();
      // 获取区域详情树形列表数据
      this.getRegionDetailsTreeData();
    },
    // 获取区域详情数据
    async getRegionDetailsData() {
      const { data } = await getRegionDetails(this.treeData.regionId);
      this.regionDetails = data;
      this.treeData.regionCode = this.regionDetails.regionCode;
    },

    // 获取区域类型字典
    getRegionTypeDicts() {
      this.getDicts("region_type").then((res) => {
        this.regionTypes = res.data;
      });
    },

    // 获取区域详情树形列表数据
    async getRegionDetailsTreeData() {
      // 打开加载
      this.loading = true;
      const { data } = await getRegionDetailsTree({
        regionId: this.treeData.regionId,
      });
      this.tableData = data;
      // 关闭加载
      this.loading = false;
    },

    // 获取子系统列表
    async getSubSystems() {
      const { data } = await getSubSystemList();
      this.subSystems = data;
      // 保存字符串
      this.subSystemNames = data.map((item) => item.title);
    },
    // 打开弹窗
    handleOpenDialog(data) {
      this.$refs.RegionEditDialog.edit(data);
      this.$refs.RegionEditDialog.title = "编辑";
      this.$refs.RegionEditDialog.dialogVisible = true;
    },
    // 获取表格的高度
    getTableHeight() {
      const innerHeight = window.innerHeight;
      this.tableHeight = innerHeight - 550 + "px";
    },
  },
  computed: {
    regionType() {
      return (regionType) => {
        if (!regionType || this.regionTypes.length === 0) return "无";
        const type = this.regionTypes.filter(
          (item) => item.dictValue === regionType
        );
        return type[0].dictLabel;
      };
    },
    subSystemStr() {
      let str = "无";
      // 判断当前是否为全部
      if (this.treeData.regionId === 0) {
        str = this.subSystemNames.join("、");
        return str;
      }
      // 判断当前子系统列表是否为空
      if (!this.regionDetails.subSytemNames) return str;
    },
  },
  watch: {
    treeNode: {
      handler(newVal) {
        this.treeData = newVal;
        this.title = newVal.regionName;
        this.getRegionDetailsData();
        // 获取区域详情树形列表数据
        this.getRegionDetailsTreeData();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.regional-management-detail {
  height: 100%;
  & > div {
    padding: 0 20px;
  }
  .head-title {
    height: 48px;
    line-height: 48px;
    font-size: 15px;
    color: #232323;
    font-weight: 600;
    border-bottom: 1px solid #e7ebf3;
  }
  .data-info {
    .info-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px 0;

      .info-head-title {
        display: flex;
        align-items: center;
        font-size: 14px;
        &::before {
          content: "";
          display: block;
          width: 5px;
          height: 13px;
          background-color: #1e7aff;
          margin-top: 1px;
          margin-right: 15px;
        }
      }
    }
    .info-table {
      font-size: 14px;
      width: 100%;
      border-top: 1px solid #e6eaee;
      border-left: 1px solid #e6eaee;
      tr {
        td {
          height: 50px;
          line-height: 50px;
          box-sizing: border-box;
          padding: 0 10px;
          border-bottom: 1px solid #e6eaee;
          border-right: 1px solid #e6eaee;
        }

        .column {
          background-color: #fafafc;
          color: #393c3e;
          width: 10%;
          text-align: center;
        }
      }
    }
  }
  .region-info {
    .info-head {
      margin: 17px 0;

      .info-head-title {
        display: flex;
        align-items: center;
        font-size: 14px;
        &::before {
          content: "";
          display: block;
          width: 5px;
          height: 13px;
          background-color: #1e7aff;
          margin-top: 1px;
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
